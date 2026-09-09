import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import {
  buildFormulaContext,
  createInitialTurnState,
  getAvailableBonusActions,
  getCharacterFeatures,
  getResourceMaximum,
  getResourceRefreshRules,
  getSpellcastingDefinition,
  getSpellcastingState,
  getSpellSlotState,
} from '../engine'
import type { AbilityName, CharacterState } from '../domain/types'

const registry = buildRegistry([phb2024Module])

function baseAbilityScores(): Record<AbilityName, number> {
  return { Strength: 10, Dexterity: 16, Constitution: 14, Intelligence: 8, Wisdom: 15, Charisma: 12 }
}

function makeMonk(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-monk',
    name: 'Test Monk',
    level: 1,
    classId: 'monk',
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

function makeCleric(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-cleric',
    name: 'Test Cleric',
    level: 1,
    classId: 'cleric',
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

describe('registry contains the Phase 4 pair 2 Monk + Cleric content', () => {
  it('has both classes and their 4 subclasses each', () => {
    expect(registry.classes.monk).toBeDefined()
    expect(registry.classes.cleric).toBeDefined()
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'monk')).toHaveLength(4)
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'cleric')).toHaveLength(4)
  })
})

describe('Monk — Focus Points resource', () => {
  it('equals the Monk level exactly, starting at level 2', () => {
    const focus = registry.resources.monkFocusPoints
    expect(focus.minimumLevel).toBe(2)
    expect(getResourceMaximum(focus, makeMonk({ level: 2 }))).toBe(2)
    expect(getResourceMaximum(focus, makeMonk({ level: 10 }))).toBe(10)
    expect(getResourceMaximum(focus, makeMonk({ level: 20 }))).toBe(20)
  })

  it('fully refills on either a Short or Long Rest (no partial-refresh split, unlike Rage)', () => {
    const focus = registry.resources.monkFocusPoints
    expect(getResourceRefreshRules(focus, makeMonk({ level: 2 }))).toEqual(['shortRest', 'longRest'])
    expect(focus.partialRefresh).toBeUndefined()
  })
})

describe('Monk — Patient Defense and Step of the Wind grant existing general actions for free', () => {
  it('surfaces Disengage and Dash under Bonus Action at level 2, tagged to their granting features', () => {
    const bonusActions = getAvailableBonusActions(makeMonk({ level: 2 }), createInitialTurnState(), registry)
    const disengage = bonusActions.find((a) => a.sourceId === 'disengage')
    const dash = bonusActions.find((a) => a.sourceId === 'dash')
    expect(disengage?.summary).toContain('via Patient Defense')
    expect(dash?.summary).toContain('via Step of the Wind')
  })
})

describe('Monk — ASI follows the standard 4/8/12/16 progression', () => {
  it('matches the confirmed table', () => {
    const choice = registry.choices['monk-asi-choice']
    const countAt = (level: number) => evaluateFormula(choice.maximumSelections, buildFormulaContext(makeMonk({ level })))
    expect(countAt(4)).toBe(1)
    expect(countAt(8)).toBe(2)
    expect(countAt(12)).toBe(3)
    expect(countAt(16)).toBe(4)
  })
})

describe('getCharacterFeatures — Monk level gating', () => {
  it('a level 1 Monk has Martial Arts/Unarmored Defense but not Focus-fueled features (level 2)', () => {
    const ids = getCharacterFeatures(makeMonk({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('monk-martial-arts')
    expect(ids).toContain('monk-unarmored-defense')
    expect(ids).not.toContain('monk-focus')
    expect(ids).not.toContain('monk-flurry-of-blows')
  })
})

describe('Cleric — Spellcasting is classListFull, the one prepared-source axis not yet exercised', () => {
  it('preparedSource is classListFull with a swap-everything-on-Long-Rest policy', () => {
    const casting = getSpellcastingDefinition(makeCleric({ level: 1 }), registry)
    expect(casting?.preparedSource).toBe('classListFull')
    expect(casting?.swapPolicy).toEqual({ timing: ['onLongRest'], count: 'all' })
  })

  it('cantrips known: 3 at level 1, 4 at level 4, 5 at level 10 (same shape as Wizard)', () => {
    expect(getSpellcastingState(makeCleric({ level: 1 }), registry)?.cantripsMax).toBe(3)
    expect(getSpellcastingState(makeCleric({ level: 4 }), registry)?.cantripsMax).toBe(4)
    expect(getSpellcastingState(makeCleric({ level: 10 }), registry)?.cantripsMax).toBe(5)
  })

  it('prepared spells reuse the exact Wizard table, confirmed via 2 independent PHB prose anchors (4 at level 1, 6 at level 3)', () => {
    expect(getSpellcastingState(makeCleric({ level: 1 }), registry)?.preparedMax).toBe(4)
    expect(getSpellcastingState(makeCleric({ level: 3 }), registry)?.preparedMax).toBe(6)
    expect(getSpellcastingState(makeCleric({ level: 20 }), registry)?.preparedMax).toBe(22)
  })

  it('spell slots follow the same standard full-caster table as Wizard and Sorcerer', () => {
    expect(getSpellSlotState(makeCleric({ level: 1 }), registry)).toEqual([{ level: 1, current: 2, max: 2 }])
    expect(getSpellSlotState(makeCleric({ level: 5 }), registry)).toEqual([
      { level: 1, current: 4, max: 4 },
      { level: 2, current: 3, max: 3 },
      { level: 3, current: 2, max: 2 },
    ])
  })
})

describe('Cleric — Channel Divinity resource', () => {
  it('grows 2 (level 2) -> 3 (level 6) -> 4 (level 18)', () => {
    const cd = registry.resources.channelDivinity
    expect(getResourceMaximum(cd, makeCleric({ level: 2 }))).toBe(2)
    expect(getResourceMaximum(cd, makeCleric({ level: 6 }))).toBe(3)
    expect(getResourceMaximum(cd, makeCleric({ level: 18 }))).toBe(4)
  })

  it('regains exactly 1 use on a Short Rest, all uses on a Long Rest — same shape as Rage', () => {
    expect(evaluateFormula(registry.resources.channelDivinity.partialRefresh!.shortRest!, buildFormulaContext(makeCleric({ level: 2 })))).toBe(1)
    expect(getResourceRefreshRules(registry.resources.channelDivinity, makeCleric({ level: 2 }))).toEqual(['shortRest', 'longRest'])
  })
})

describe('Cleric — Divine Order is a single permanent character-creation choice', () => {
  it('has exactly 2 options and no replacement policy', () => {
    const choice = registry.choices['cleric-divine-order-choice']
    expect(choice.mode).toBe('single')
    expect(choice.optionIds).toHaveLength(2)
    expect(choice.replacementPolicies).toBeUndefined()
    expect(choice.timing).toEqual(['characterCreation'])
  })
})

describe('getCharacterFeatures — Cleric level gating', () => {
  it('a level 1 Cleric has Spellcasting/Divine Order but not Channel Divinity (level 2)', () => {
    const ids = getCharacterFeatures(makeCleric({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('cleric-spellcasting')
    expect(ids).toContain('cleric-divine-order')
    expect(ids).not.toContain('cleric-channel-divinity')
  })
})
