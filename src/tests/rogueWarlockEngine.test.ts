import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import {
  applyLongRest,
  applyShortRest,
  buildFormulaContext,
  canRemoveOption,
  createInitialTurnState,
  getAvailableActions,
  getAvailableBonusActions,
  getCharacterFeatures,
  getConditionalModifiersForCharacter,
  getSpellcastingState,
  getSpellSlotState,
  spendSpellSlot,
} from '../engine'
import type { AbilityName, CharacterState } from '../domain/types'

const registry = buildRegistry([phb2024Module])

function baseAbilityScores(): Record<AbilityName, number> {
  return { Strength: 8, Dexterity: 16, Constitution: 14, Intelligence: 10, Wisdom: 12, Charisma: 14 }
}

function makeRogue(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-rogue',
    name: 'Test Rogue',
    level: 1,
    classId: 'rogue',
    backgroundId: 'soldier',
    speciesId: 'human',
    enabledSourceIds: ['PHB2024'],
    abilityScores: baseAbilityScores(),
    selections: {},
    preparedSpellIds: [],
    resourceState: [],
    activeEffects: [],
    equipmentIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

function makeWarlock(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-warlock',
    name: 'Test Warlock',
    level: 1,
    classId: 'warlock',
    backgroundId: 'soldier',
    speciesId: 'human',
    enabledSourceIds: ['PHB2024'],
    abilityScores: baseAbilityScores(),
    selections: {},
    preparedSpellIds: [],
    resourceState: [],
    activeEffects: [],
    equipmentIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('registry contains the Rogue + Warlock vertical slice content', () => {
  it('has both classes and their 4 subclasses each', () => {
    expect(registry.classes.rogue).toBeDefined()
    expect(registry.classes.warlock).toBeDefined()
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'rogue')).toHaveLength(4)
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'warlock')).toHaveLength(4)
  })
})

describe('Rogue — Sneak Attack as a conditional modifier, not a resource', () => {
  it('is not present in the resource system at all', () => {
    expect(registry.resources.sneakAttack).toBeUndefined()
  })

  it('scales ceil(level/2) d6s, matching the confirmed PHB table', () => {
    const scaling = (level: number) => {
      const modifier = getConditionalModifiersForCharacter(makeRogue({ level }), registry).find((m) => m.id === 'sneakAttack')!
      return evaluateFormula(modifier.amount, buildFormulaContext(makeRogue({ level })))
    }
    expect(scaling(1)).toBe(1)
    expect(scaling(2)).toBe(1)
    expect(scaling(3)).toBe(2)
    expect(scaling(5)).toBe(3)
    expect(scaling(20)).toBe(10)
  })

  it('tags a qualifying (finesse) weapon attack with the Sneak Attack summary, but not a non-qualifying one', () => {
    const character = makeRogue({ level: 3, equipmentIds: ['rapier', 'greatclub'] })
    const actions = getAvailableActions(character, createInitialTurnState(), registry, 'action')
    const rapierAttack = actions.find((a) => a.id === 'attack-rapier')
    const greatclubAttack = actions.find((a) => a.id === 'attack-greatclub')
    expect(rapierAttack?.summary).toContain('2d6 Sneak Attack')
    expect(rapierAttack?.summary).toContain('once per turn')
    expect(greatclubAttack?.summary).not.toContain('Sneak Attack')
  })

  it('also tags a ranged (non-finesse) weapon, since Sneak Attack accepts finesse OR ranged', () => {
    const character = makeRogue({ level: 1, equipmentIds: ['shortbow'] })
    const actions = getAvailableActions(character, createInitialTurnState(), registry, 'action')
    expect(actions.find((a) => a.id === 'attack-shortbow')?.summary).toContain('1d6 Sneak Attack')
  })
})

describe('Rogue — Cunning Action grants existing general actions as a Bonus Action', () => {
  it('is absent at level 1 (feature unlocks at level 2)', () => {
    const bonusActions = getAvailableBonusActions(makeRogue({ level: 1 }), createInitialTurnState(), registry)
    expect(bonusActions.some((a) => a.sourceId === 'dash')).toBe(false)
  })

  it('surfaces Dash, Disengage, and Hide under Bonus Action at level 2+, alongside the Cunning Action feature entry itself', () => {
    const bonusActions = getAvailableBonusActions(makeRogue({ level: 2 }), createInitialTurnState(), registry)
    const ids = bonusActions.map((a) => a.sourceId)
    expect(ids).toContain('dash')
    expect(ids).toContain('disengage')
    expect(ids).toContain('hide')
    expect(ids).toContain('rogue-cunning-action')
    const dash = bonusActions.find((a) => a.sourceId === 'dash')
    expect(dash?.summary).toContain('via Cunning Action')
  })

  it('granted actions share the granting feature\'s turn-economy availability', () => {
    const turn = { ...createInitialTurnState(), bonusActionUsed: true }
    const bonusActions = getAvailableBonusActions(makeRogue({ level: 2 }), turn, registry)
    const dash = bonusActions.find((a) => a.sourceId === 'dash' && a.label === 'Dash')
    expect(dash?.available).toBe(false)
    expect(dash?.unavailableReason).toBe('alreadyUsedThisTurn')
  })
})

describe('Rogue — choice counts differ from Fighter/Bard by data only', () => {
  it('Weapon Mastery is 2 kinds (vs Fighter\'s 3)', () => {
    const ctx = buildFormulaContext(makeRogue({ level: 1 }))
    const choice = registry.choices['rogue-weapon-mastery-choice']
    expect(evaluateFormula(choice.maximumSelections, ctx)).toBe(2)
  })

  it('Expertise grows from 2 (level 1) to 4 (level 6)', () => {
    expect(evaluateFormula(registry.choices['rogue-expertise-choice'].maximumSelections, buildFormulaContext(makeRogue({ level: 1 })))).toBe(2)
    expect(evaluateFormula(registry.choices['rogue-expertise-choice'].maximumSelections, buildFormulaContext(makeRogue({ level: 6 })))).toBe(4)
  })

  it('ASI/Feat is granted at Rogue\'s own non-uniform levels (4, 8, 10, 12, 16)', () => {
    const choice = registry.choices['rogue-asi-choice']
    const countAt = (level: number) => evaluateFormula(choice.maximumSelections, buildFormulaContext(makeRogue({ level })))
    expect(countAt(4)).toBe(1)
    expect(countAt(8)).toBe(2)
    expect(countAt(10)).toBe(3)
    expect(countAt(12)).toBe(4)
    expect(countAt(16)).toBe(5)
  })
})

describe('Warlock — Pact Magic is a single always-highest-level slot pool, not a standard slot table', () => {
  it('matches the confirmed pact slot table at representative levels', () => {
    expect(getSpellSlotState(makeWarlock({ level: 1 }), registry)).toEqual([{ level: 1, current: 1, max: 1 }])
    expect(getSpellSlotState(makeWarlock({ level: 2 }), registry)).toEqual([{ level: 1, current: 2, max: 2 }])
    expect(getSpellSlotState(makeWarlock({ level: 3 }), registry)).toEqual([{ level: 2, current: 2, max: 2 }])
    expect(getSpellSlotState(makeWarlock({ level: 5 }), registry)).toEqual([{ level: 3, current: 2, max: 2 }])
    expect(getSpellSlotState(makeWarlock({ level: 11 }), registry)).toEqual([{ level: 5, current: 3, max: 3 }])
    expect(getSpellSlotState(makeWarlock({ level: 17 }), registry)).toEqual([{ level: 5, current: 4, max: 4 }])
  })

  it('recovers on a Short Rest, unlike a standard full-caster progression (Wizard)', () => {
    let character = makeWarlock({ level: 3 })
    character = spendSpellSlot(character, registry, 2)
    expect(getSpellSlotState(character, registry)[0].current).toBe(1)
    character = applyShortRest(character, registry)
    expect(getSpellSlotState(character, registry)[0].current).toBe(2)
  })

  it('also recovers on a Long Rest', () => {
    let character = makeWarlock({ level: 3 })
    character = spendSpellSlot(character, registry, 2)
    character = applyLongRest(character, registry)
    expect(getSpellSlotState(character, registry)[0].current).toBe(2)
  })

  it('caps preparable spell level by current pact slot level (maxPreparableSlotLevel), independent of prepared count', () => {
    expect(getSpellcastingState(makeWarlock({ level: 1 }), registry)?.maxPreparableSpellLevel).toBe(1)
    expect(getSpellcastingState(makeWarlock({ level: 5 }), registry)?.maxPreparableSpellLevel).toBe(3)
    expect(getSpellcastingState(makeWarlock({ level: 9 }), registry)?.maxPreparableSpellLevel).toBe(5)
  })
})

describe('Warlock — Eldritch Invocations count grows per the verified table', () => {
  it('1 at level 1, jumping to 3 at level 2, up through 10 at level 18', () => {
    const choice = registry.choices['warlock-invocations-choice']
    const countAt = (level: number) => evaluateFormula(choice.maximumSelections, buildFormulaContext(makeWarlock({ level })))
    expect(countAt(1)).toBe(1)
    expect(countAt(2)).toBe(3)
    expect(countAt(5)).toBe(5)
    expect(countAt(7)).toBe(6)
    expect(countAt(9)).toBe(7)
    expect(countAt(12)).toBe(8)
    expect(countAt(15)).toBe(9)
    expect(countAt(18)).toBe(10)
  })
})

describe('Warlock — Eldritch Invocation prerequisite-on-drop blocking (hasSelectedOption reverse dependency)', () => {
  function characterWithInvocations(optionIds: string[]): CharacterState {
    return makeWarlock({ level: 12, selections: { 'warlock-invocations-choice': optionIds } })
  }

  it('blocks dropping Pact of the Blade while Thirsting Blade (which requires it) is still held', () => {
    const character = characterWithInvocations(['pactOfTheBlade', 'thirstingBlade'])
    const result = canRemoveOption(character, registry, 'pactOfTheBlade')
    expect(result.ok).toBe(false)
    expect(result.blockedByOptionIds).toContain('thirstingBlade')
  })

  it('blocks dropping Thirsting Blade while Devouring Blade (two-deep dependency chain) is still held', () => {
    const character = characterWithInvocations(['pactOfTheBlade', 'thirstingBlade', 'devouringBlade'])
    const result = canRemoveOption(character, registry, 'thirstingBlade')
    expect(result.ok).toBe(false)
    expect(result.blockedByOptionIds).toContain('devouringBlade')
  })

  it('allows dropping Devouring Blade itself, since nothing depends on it', () => {
    const character = characterWithInvocations(['pactOfTheBlade', 'thirstingBlade', 'devouringBlade'])
    expect(canRemoveOption(character, registry, 'devouringBlade')).toEqual({ ok: true })
  })

  it('allows dropping an invocation with no dependents at all', () => {
    const character = characterWithInvocations(['agonizingBlast'])
    expect(canRemoveOption(character, registry, 'agonizingBlast')).toEqual({ ok: true })
  })
})

describe('getCharacterFeatures — Rogue and Warlock level gating', () => {
  it('a level 1 Rogue has Sneak Attack, Expertise, Thieves\' Cant, Weapon Mastery, but not Cunning Action', () => {
    const ids = getCharacterFeatures(makeRogue({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('rogue-sneak-attack')
    expect(ids).toContain('rogue-expertise')
    expect(ids).toContain('rogue-thieves-cant')
    expect(ids).toContain('rogue-weapon-mastery')
    expect(ids).not.toContain('rogue-cunning-action')
  })

  it('a level 1 Warlock has Eldritch Invocations and Pact Magic, but not Magical Cunning (level 2)', () => {
    const ids = getCharacterFeatures(makeWarlock({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('warlock-eldritch-invocations')
    expect(ids).toContain('warlock-pact-magic')
    expect(ids).not.toContain('warlock-magical-cunning')
  })
})
