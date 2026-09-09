import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import {
  applyLongRest,
  applyShortRest,
  buildFormulaContext,
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
  return { Strength: 8, Dexterity: 14, Constitution: 14, Intelligence: 10, Wisdom: 15, Charisma: 16 }
}

function makeBard(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-bard',
    name: 'Test Bard',
    level: 1,
    classId: 'bard',
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

function makeDruid(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-druid',
    name: 'Test Druid',
    level: 1,
    classId: 'druid',
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

describe('registry contains the Phase 4 pair 3 Bard + Druid content', () => {
  it('has both classes and their 4 subclasses each', () => {
    expect(registry.classes.bard).toBeDefined()
    expect(registry.classes.druid).toBeDefined()
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'bard')).toHaveLength(4)
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'druid')).toHaveLength(4)
  })
})

describe('Bard — Bardic Inspiration uses LeveledValue.overridesFromLevel for real (first actual use of the field)', () => {
  it('refreshes on Long Rest only below level 5, and on Short or Long Rest from level 5 on', () => {
    const bi = registry.resources.bardicInspiration
    expect(getResourceRefreshRules(bi, makeBard({ level: 1 }))).toEqual(['longRest'])
    expect(getResourceRefreshRules(bi, makeBard({ level: 4 }))).toEqual(['longRest'])
    expect(getResourceRefreshRules(bi, makeBard({ level: 5 }))).toEqual(['shortRest', 'longRest'])
    expect(getResourceRefreshRules(bi, makeBard({ level: 20 }))).toEqual(['shortRest', 'longRest'])
  })

  it('a Short Rest does not refill it below level 5, but does at level 5+', () => {
    const spent = { resourceState: [{ resourceId: 'bardicInspiration', current: 0 }] }
    const low = applyShortRest(makeBard({ level: 4, ...spent }), registry)
    expect(low.resourceState.find((s) => s.resourceId === 'bardicInspiration')?.current).toBe(0)
    const high = applyShortRest(makeBard({ level: 5, ...spent }), registry)
    expect(high.resourceState.find((s) => s.resourceId === 'bardicInspiration')?.current).toBeGreaterThan(0)
  })

  it('max uses equal Charisma modifier (minimum 1)', () => {
    expect(getResourceMaximum(registry.resources.bardicInspiration, makeBard({ level: 1 }))).toBe(3)
  })
})

describe('Bard — Spellcasting is knownList (like Warlock/Sorcerer), sharing the full-caster prepared/slot tables', () => {
  it('preparedSource is knownList with a 1-per-level-up swap policy', () => {
    const casting = getSpellcastingDefinition(makeBard({ level: 1 }), registry)
    expect(casting?.preparedSource).toBe('knownList')
    expect(casting?.swapPolicy).toEqual({ timing: ['onLevelUp'], count: 1 })
  })

  it('cantrips known: 2 at level 1, 3 at level 4, 4 at level 10', () => {
    expect(getSpellcastingState(makeBard({ level: 1 }), registry)?.cantripsMax).toBe(2)
    expect(getSpellcastingState(makeBard({ level: 4 }), registry)?.cantripsMax).toBe(3)
    expect(getSpellcastingState(makeBard({ level: 10 }), registry)?.cantripsMax).toBe(4)
  })

  it('prepared spells and slots match the shared full-caster tables (4 at level 1, standard slot table)', () => {
    expect(getSpellcastingState(makeBard({ level: 1 }), registry)?.preparedMax).toBe(4)
    expect(getSpellSlotState(makeBard({ level: 1 }), registry)).toEqual([{ level: 1, current: 2, max: 2 }])
  })
})

describe('Bard — Expertise grows 2 (level 2) -> 4 (level 9)', () => {
  it('matches the confirmed table', () => {
    const choice = registry.choices['bard-expertise-choice']
    const countAt = (level: number) => evaluateFormula(choice.maximumSelections, buildFormulaContext(makeBard({ level })))
    expect(countAt(1)).toBe(0)
    expect(countAt(2)).toBe(2)
    expect(countAt(9)).toBe(4)
  })
})

describe('getCharacterFeatures — Bard level gating', () => {
  it('a level 1 Bard has Bardic Inspiration/Spellcasting but not Expertise (level 2)', () => {
    const ids = getCharacterFeatures(makeBard({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('bard-bardic-inspiration')
    expect(ids).toContain('bard-spellcasting')
    expect(ids).not.toContain('bard-expertise')
  })
})

describe('Druid — Wild Shape resource', () => {
  it('matches the confirmed table: 2/3/4 at levels 2/6/17', () => {
    const wildShape = registry.resources.wildShape
    expect(wildShape.minimumLevel).toBe(2)
    expect(getResourceMaximum(wildShape, makeDruid({ level: 2 }))).toBe(2)
    expect(getResourceMaximum(wildShape, makeDruid({ level: 6 }))).toBe(3)
    expect(getResourceMaximum(wildShape, makeDruid({ level: 17 }))).toBe(4)
  })

  it('regains exactly 1 use on a Short Rest, all uses on a Long Rest — same shape as Rage', () => {
    let character = makeDruid({ level: 6, resourceState: [{ resourceId: 'wildShape', current: 0 }] })
    character = applyShortRest(character, registry)
    expect(character.resourceState.find((s) => s.resourceId === 'wildShape')?.current).toBe(1)
    character = { ...character, resourceState: [{ resourceId: 'wildShape', current: 0 }] }
    character = applyLongRest(character, registry)
    expect(character.resourceState.find((s) => s.resourceId === 'wildShape')?.current).toBe(3)
  })
})

describe('Druid — Spellcasting is classListFull, same shape as Cleric', () => {
  it('preparedSource is classListFull with a swap-everything-on-Long-Rest policy', () => {
    const casting = getSpellcastingDefinition(makeDruid({ level: 1 }), registry)
    expect(casting?.preparedSource).toBe('classListFull')
    expect(casting?.swapPolicy).toEqual({ timing: ['onLongRest'], count: 'all' })
  })

  it('cantrips known: 2 at level 1, 3 at level 4, 4 at level 10', () => {
    expect(getSpellcastingState(makeDruid({ level: 1 }), registry)?.cantripsMax).toBe(2)
    expect(getSpellcastingState(makeDruid({ level: 4 }), registry)?.cantripsMax).toBe(3)
    expect(getSpellcastingState(makeDruid({ level: 10 }), registry)?.cantripsMax).toBe(4)
  })

  it('prepared spells reuse the shared full-caster table (4 at level 1, 6 at level 3 — a fourth independent confirmation)', () => {
    expect(getSpellcastingState(makeDruid({ level: 1 }), registry)?.preparedMax).toBe(4)
    expect(getSpellcastingState(makeDruid({ level: 3 }), registry)?.preparedMax).toBe(6)
  })
})

describe('Druid — Primal Order is a single permanent character-creation choice', () => {
  it('has exactly 2 options and no replacement policy', () => {
    const choice = registry.choices['druid-primal-order-choice']
    expect(choice.mode).toBe('single')
    expect(choice.optionIds).toHaveLength(2)
    expect(choice.replacementPolicies).toBeUndefined()
    expect(choice.timing).toEqual(['characterCreation'])
  })
})

describe('getCharacterFeatures — Druid level gating', () => {
  it('a level 1 Druid has Spellcasting/Primal Order/Druidic but not Wild Shape (level 2)', () => {
    const ids = getCharacterFeatures(makeDruid({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('druid-spellcasting')
    expect(ids).toContain('druid-primal-order')
    expect(ids).toContain('druid-druidic')
    expect(ids).not.toContain('druid-wild-shape')
  })
})
