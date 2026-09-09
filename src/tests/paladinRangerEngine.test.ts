import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import {
  buildFormulaContext,
  canRemoveOption,
  getCharacterFeatures,
  getResourceMaximum,
  getSpellcastingDefinition,
  getSpellcastingState,
  getSpellSlotState,
} from '../engine'
import type { AbilityName, CharacterState } from '../domain/types'

const registry = buildRegistry([phb2024Module])

function baseAbilityScores(): Record<AbilityName, number> {
  return { Strength: 15, Dexterity: 12, Constitution: 14, Intelligence: 8, Wisdom: 10, Charisma: 14 }
}

function makePaladin(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-paladin',
    name: 'Test Paladin',
    level: 1,
    classId: 'paladin',
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

function makeRanger(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-ranger',
    name: 'Test Ranger',
    level: 1,
    classId: 'ranger',
    backgroundId: 'soldier',
    speciesId: 'human',
    enabledSourceIds: ['PHB2024'],
    abilityScores: { Strength: 10, Dexterity: 16, Constitution: 14, Intelligence: 8, Wisdom: 14, Charisma: 10 },
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

describe('registry contains the Phase 4 pair 4 (final) Paladin + Ranger content', () => {
  it('has both classes and their 4 subclasses each, completing all 12 PHB classes', () => {
    expect(registry.classes.paladin).toBeDefined()
    expect(registry.classes.ranger).toBeDefined()
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'paladin')).toHaveLength(4)
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'ranger')).toHaveLength(4)
    expect(Object.keys(registry.classes)).toHaveLength(12)
  })
})

describe('Paladin — Spellcasting is the half-caster shape, starting at level 1 (a real 2024 rules change)', () => {
  it('preparedSource is classListFull with a swap-one-per-Long-Rest policy — a third distinct swapPolicy shape', () => {
    const casting = getSpellcastingDefinition(makePaladin({ level: 1 }), registry)
    expect(casting?.preparedSource).toBe('classListFull')
    expect(casting?.swapPolicy).toEqual({ timing: ['onLongRest'], count: 1 })
    expect(casting?.slotProgression).toBe('half')
    expect(casting?.cantripProgression).toBeUndefined()
  })

  it('has 2 prepared spells and 2 level-1 slots already at level 1, not level 2', () => {
    expect(getSpellcastingState(makePaladin({ level: 1 }), registry)?.preparedMax).toBe(2)
    expect(getSpellSlotState(makePaladin({ level: 1 }), registry)).toEqual([{ level: 1, current: 2, max: 2 }])
  })

  it('matches the confirmed half-caster slot table at level 5 (4/2)', () => {
    expect(getSpellSlotState(makePaladin({ level: 5 }), registry)).toEqual([
      { level: 1, current: 4, max: 4 },
      { level: 2, current: 2, max: 2 },
    ])
  })
})

describe('Paladin — Channel Divinity resource has its own id, distinct from Cleric\'s', () => {
  it('grows 2 (level 3) -> 3 (level 11), independent of Cleric\'s 2/3/4 at 2/6/18', () => {
    const cd = registry.resources.paladinChannelDivinity
    expect(cd).toBeDefined()
    expect(getResourceMaximum(cd, makePaladin({ level: 3 }))).toBe(2)
    expect(getResourceMaximum(cd, makePaladin({ level: 11 }))).toBe(3)
    // Cleric's own channelDivinity resource is untouched by Paladin's data.
    expect(getResourceMaximum(registry.resources.channelDivinity, { ...makePaladin({ level: 3 }), classId: 'cleric' })).toBe(2)
  })
})

describe('Paladin — Lay On Hands pool scales with level', () => {
  it('equals 5x Paladin level', () => {
    const layOnHands = registry.resources.layOnHands
    expect(getResourceMaximum(layOnHands, makePaladin({ level: 1 }))).toBe(5)
    expect(getResourceMaximum(layOnHands, makePaladin({ level: 10 }))).toBe(50)
  })
})

describe('getCharacterFeatures — Paladin level gating', () => {
  it('a level 1 Paladin has Lay On Hands/Spellcasting/Weapon Mastery but not Fighting Style (level 2)', () => {
    const ids = getCharacterFeatures(makePaladin({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('paladin-lay-on-hands')
    expect(ids).toContain('paladin-spellcasting')
    expect(ids).toContain('paladin-weapon-mastery')
    expect(ids).not.toContain('paladin-fighting-style')
  })
})

describe('Ranger — Spellcasting shares Paladin\'s exact half-caster shape', () => {
  it('preparedSource, swapPolicy, and slot table match Paladin\'s', () => {
    const casting = getSpellcastingDefinition(makeRanger({ level: 1 }), registry)
    expect(casting?.preparedSource).toBe('classListFull')
    expect(casting?.swapPolicy).toEqual({ timing: ['onLongRest'], count: 1 })
    expect(getSpellSlotState(makeRanger({ level: 5 }), registry)).toEqual([
      { level: 1, current: 4, max: 4 },
      { level: 2, current: 2, max: 2 },
    ])
  })
})

describe('Ranger — Favored Enemy resource', () => {
  it('matches the confirmed table: 2/3/4/5/6 at levels 1/5/9/13/17', () => {
    const fe = registry.resources.favoredEnemy
    expect(getResourceMaximum(fe, makeRanger({ level: 1 }))).toBe(2)
    expect(getResourceMaximum(fe, makeRanger({ level: 5 }))).toBe(3)
    expect(getResourceMaximum(fe, makeRanger({ level: 17 }))).toBe(6)
  })
})

describe('Ranger — Expertise grows via two different features sharing one choice (Deft Explorer at 2, Expertise at 9)', () => {
  it('minimumSelections is 1 at level 2 and 3 at level 9', () => {
    const choice = registry.choices['ranger-expertise-choice']
    const countAt = (level: number) => evaluateFormula(choice.maximumSelections, buildFormulaContext(makeRanger({ level })))
    expect(countAt(2)).toBe(1)
    expect(countAt(9)).toBe(3)
  })
})

describe('getCharacterFeatures — Ranger level gating', () => {
  it('a level 1 Ranger has Spellcasting/Favored Enemy/Weapon Mastery but not Deft Explorer (level 2)', () => {
    const ids = getCharacterFeatures(makeRanger({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('ranger-spellcasting')
    expect(ids).toContain('ranger-favored-enemy')
    expect(ids).toContain('ranger-weapon-mastery')
    expect(ids).not.toContain('ranger-deft-explorer')
  })
})

describe('Ranger Hunter subclass — swappable single-choice features (Hunter\'s Prey / Defensive Tactics)', () => {
  it('Hunter\'s Prey choice allows swapping on Short or Long Rest, unlike most permanent choices', () => {
    const choice = registry.choices['hunter-hunters-prey-choice']
    expect(choice.mode).toBe('single')
    expect(choice.replacementPolicies).toEqual([
      { timing: 'onShortRest', maxReplacements: 'unlimited' },
      { timing: 'onLongRest', maxReplacements: 'unlimited' },
    ])
  })

  it('canRemoveOption allows dropping a Hunter\'s Prey pick freely (nothing depends on it)', () => {
    const character = makeRanger({ level: 3, subclassId: 'hunter', selections: { 'hunter-hunters-prey-choice': ['huntersPrey-colossusSlayer'] } })
    expect(canRemoveOption(character, registry, 'huntersPrey-colossusSlayer')).toEqual({ ok: true })
  })
})
