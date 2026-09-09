import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import {
  buildFormulaContext,
  createInitialTurnState,
  getAvailableActions,
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
  return { Strength: 16, Dexterity: 12, Constitution: 14, Intelligence: 8, Wisdom: 10, Charisma: 15 }
}

function makeBarbarian(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-barbarian',
    name: 'Test Barbarian',
    level: 1,
    classId: 'barbarian',
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

function makeSorcerer(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-sorcerer',
    name: 'Test Sorcerer',
    level: 1,
    classId: 'sorcerer',
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

describe('registry contains the Phase 4 Barbarian + Sorcerer content', () => {
  it('has both classes and their 4 subclasses each', () => {
    expect(registry.classes.barbarian).toBeDefined()
    expect(registry.classes.sorcerer).toBeDefined()
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'barbarian')).toHaveLength(4)
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'sorcerer')).toHaveLength(4)
  })
})

describe('Barbarian — Rage resource', () => {
  it('matches the confirmed Rages column: 2/3/4/5/6 at levels 1/3/6/12/17', () => {
    const usesAt = (level: number) => getResourceMaximum(registry.resources.rages, makeBarbarian({ level }))
    expect(usesAt(1)).toBe(2)
    expect(usesAt(2)).toBe(2)
    expect(usesAt(3)).toBe(3)
    expect(usesAt(5)).toBe(3)
    expect(usesAt(6)).toBe(4)
    expect(usesAt(12)).toBe(5)
    expect(usesAt(17)).toBe(6)
  })

  it('regains exactly 1 use on a Short Rest, all uses on a Long Rest', () => {
    const rages = registry.resources.rages
    const rules = getResourceRefreshRules(rages, makeBarbarian({ level: 1 }))
    expect(rules).toEqual(['shortRest', 'longRest'])
    expect(evaluateFormula(rages.partialRefresh!.shortRest!, buildFormulaContext(makeBarbarian({ level: 1 })))).toBe(1)
  })
})

describe('Barbarian — level gating and choice growth', () => {
  it('a level 1 Barbarian has Rage/Unarmored Defense/Weapon Mastery but not Danger Sense (level 2)', () => {
    const ids = getCharacterFeatures(makeBarbarian({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('barbarian-rage')
    expect(ids).toContain('barbarian-unarmored-defense')
    expect(ids).toContain('barbarian-weapon-mastery')
    expect(ids).not.toContain('barbarian-danger-sense')
  })

  it('Weapon Mastery grows 2 (level 1) -> 3 (level 4) -> 4 (level 10)', () => {
    const choice = registry.choices['barbarian-weapon-mastery-choice']
    const countAt = (level: number) => evaluateFormula(choice.maximumSelections, buildFormulaContext(makeBarbarian({ level })))
    expect(countAt(1)).toBe(2)
    expect(countAt(4)).toBe(3)
    expect(countAt(10)).toBe(4)
  })

  it('ASI/Feat follows the standard 4/8/12/16 progression', () => {
    const choice = registry.choices['barbarian-asi-choice']
    const countAt = (level: number) => evaluateFormula(choice.maximumSelections, buildFormulaContext(makeBarbarian({ level })))
    expect(countAt(4)).toBe(1)
    expect(countAt(8)).toBe(2)
    expect(countAt(12)).toBe(3)
    expect(countAt(16)).toBe(4)
  })
})

describe('Weapon Mastery tagging works for any class, not just Fighter', () => {
  it("tags a Barbarian's mastered weapon attack, since the lookup keys off any *-weapon-mastery-choice selection", () => {
    const character = makeBarbarian({
      level: 1,
      equipmentIds: ['greataxe'],
      selections: { 'barbarian-weapon-mastery-choice': ['weapon-mastery-greataxe', 'weapon-mastery-handaxe'] },
    })
    const actions = getAvailableActions(character, createInitialTurnState(), registry, 'action')
    const attack = actions.find((a) => a.id === 'attack-greataxe')
    expect(attack?.summary).toContain('Cleave')
  })
})

describe('Sorcerer — Spellcasting is a knownList full caster (like Warlock, unlike Wizard)', () => {
  it('preparedSource is knownList with a 1-per-level-up swap policy', () => {
    const casting = getSpellcastingDefinition(makeSorcerer({ level: 1 }), registry)
    expect(casting?.preparedSource).toBe('knownList')
    expect(casting?.swapPolicy).toEqual({ timing: ['onLevelUp'], count: 1 })
  })

  it('cantrips known: 4 at level 1, 5 at level 4, 6 at level 10', () => {
    expect(getSpellcastingState(makeSorcerer({ level: 1 }), registry)?.cantripsMax).toBe(4)
    expect(getSpellcastingState(makeSorcerer({ level: 4 }), registry)?.cantripsMax).toBe(5)
    expect(getSpellcastingState(makeSorcerer({ level: 10 }), registry)?.cantripsMax).toBe(6)
  })

  it('prepared spells follow the confirmed non-linear table (2/6/14/22 at levels 1/3/9/20)', () => {
    expect(getSpellcastingState(makeSorcerer({ level: 1 }), registry)?.preparedMax).toBe(2)
    expect(getSpellcastingState(makeSorcerer({ level: 3 }), registry)?.preparedMax).toBe(6)
    expect(getSpellcastingState(makeSorcerer({ level: 9 }), registry)?.preparedMax).toBe(14)
    expect(getSpellcastingState(makeSorcerer({ level: 20 }), registry)?.preparedMax).toBe(22)
  })

  it('spell slots follow the same standard full-caster table as Wizard', () => {
    expect(getSpellSlotState(makeSorcerer({ level: 1 }), registry)).toEqual([{ level: 1, current: 2, max: 2 }])
    expect(getSpellSlotState(makeSorcerer({ level: 5 }), registry)).toEqual([
      { level: 1, current: 4, max: 4 },
      { level: 2, current: 3, max: 3 },
      { level: 3, current: 2, max: 2 },
    ])
  })
})

describe('Sorcerer — Sorcery Points and Metamagic', () => {
  it('Sorcery Points equal the Sorcerer level starting at level 2 (not present below it)', () => {
    const sp = registry.resources.sorceryPoints
    expect(sp.minimumLevel).toBe(2)
    expect(getResourceMaximum(sp, makeSorcerer({ level: 2 }))).toBe(2)
    expect(getResourceMaximum(sp, makeSorcerer({ level: 5 }))).toBe(5)
    expect(getResourceMaximum(sp, makeSorcerer({ level: 20 }))).toBe(20)
  })

  it('Metamagic grows 2 (level 2) -> 4 (level 10) -> 6 (level 17)', () => {
    const choice = registry.choices['sorcerer-metamagic-choice']
    const countAt = (level: number) => evaluateFormula(choice.maximumSelections, buildFormulaContext(makeSorcerer({ level })))
    expect(countAt(1)).toBe(0)
    expect(countAt(2)).toBe(2)
    expect(countAt(10)).toBe(4)
    expect(countAt(17)).toBe(6)
    expect(choice.optionIds).toHaveLength(10)
  })

  it('Innate Sorcery is a flat 2-use Long-Rest resource available from level 1', () => {
    const innate = registry.resources.innateSorcery
    expect(innate.minimumLevel).toBe(1)
    expect(getResourceMaximum(innate, makeSorcerer({ level: 1 }))).toBe(2)
    expect(getResourceRefreshRules(innate, makeSorcerer({ level: 1 }))).toEqual(['longRest'])
  })
})

describe('getCharacterFeatures — Sorcerer level gating', () => {
  it('a level 1 Sorcerer has Spellcasting and Innate Sorcery but not Font of Magic/Metamagic (level 2)', () => {
    const ids = getCharacterFeatures(makeSorcerer({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('sorcerer-spellcasting')
    expect(ids).toContain('sorcerer-innate-sorcery')
    expect(ids).not.toContain('sorcerer-font-of-magic')
    expect(ids).not.toContain('sorcerer-metamagic')
  })
})
