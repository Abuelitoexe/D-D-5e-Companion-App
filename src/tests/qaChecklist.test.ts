import { describe, expect, it } from 'vitest'
import { buildRegistry, mergeIntoRegistry } from '../data/registry'
import type { RegistryModule } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import {
  getCharacterFeatures,
  getExhaustionD20Penalty,
  getExhaustionLevel,
  getExhaustionSpeedReduction,
  getResourceDefinitionsForCharacter,
  getResourceMaximum,
  getSpellcastingDefinition,
  getSpellSlotState,
  reduceExhaustionOnLongRest,
  setExhaustionLevel,
  validateCharacter,
} from '../engine'
import type { AbilityName, CharacterState, ClassDefinition } from '../domain/types'

const registry = buildRegistry([phb2024Module])

const ALL_CLASS_IDS = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard']
const NON_CASTER_CLASS_IDS = ['barbarian', 'fighter', 'monk', 'rogue'] // no base spellcasting (Fighter/Rogue subclasses that add it are excluded by not setting subclassId)

function baseAbilityScores(): Record<AbilityName, number> {
  return { Strength: 12, Dexterity: 12, Constitution: 12, Intelligence: 12, Wisdom: 12, Charisma: 12 }
}

function makeCharacter(classId: string, overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-char',
    name: 'Test Character',
    level: 1,
    classId,
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

describe('QA checklist — content completeness (plan Section 16)', () => {
  it('has exactly 12 classes, 48 subclasses, 16 backgrounds, and 10 species', () => {
    expect(Object.keys(registry.classes)).toHaveLength(12)
    expect(Object.keys(registry.subclasses)).toHaveLength(48)
    expect(Object.keys(registry.backgrounds)).toHaveLength(16)
    expect(Object.keys(registry.species)).toHaveLength(10)
  })

  it('every class has exactly 4 subclasses', () => {
    for (const classId of ALL_CLASS_IDS) {
      const count = Object.values(registry.subclasses).filter((s) => s.parentClassId === classId).length
      expect(count, `${classId} should have 4 subclasses`).toBe(4)
    }
  })

  it('every class/subclass/background/species/feat/spell record carries a valid SourceRef with a real sourceId', () => {
    const collections = [registry.classes, registry.subclasses, registry.backgrounds, registry.species, registry.feats, registry.spells]
    for (const collection of collections) {
      for (const record of Object.values(collection)) {
        expect(record.source, `${record.id} must have a source`).toBeDefined()
        expect(['PHB2024', 'RAVENLOFT', 'HEROES_FAERUN', 'CLASS_TIPS']).toContain(record.source.sourceId)
      }
    }
  })

  it('every id referenced by a class/subclass featuresByLevel actually exists in registry.features', () => {
    const missing: string[] = []
    for (const cls of [...Object.values(registry.classes), ...Object.values(registry.subclasses)]) {
      for (const ids of Object.values(cls.featuresByLevel)) {
        for (const id of ids) {
          if (!registry.features[id]) missing.push(`${cls.id} -> ${id}`)
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('every choiceId referenced by a class/subclass actually exists in registry.choices', () => {
    const missing: string[] = []
    for (const cls of [...Object.values(registry.classes), ...Object.values(registry.subclasses)] as (ClassDefinition & { choiceIds?: string[] })[]) {
      for (const choiceId of cls.choiceIds ?? []) {
        if (!registry.choices[choiceId]) missing.push(`${cls.id} -> ${choiceId}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('every resourceId referenced by a class/subclass actually exists in registry.resources', () => {
    const missing: string[] = []
    for (const cls of [...Object.values(registry.classes), ...Object.values(registry.subclasses)]) {
      for (const resourceId of cls.resources ?? []) {
        if (!registry.resources[resourceId]) missing.push(`${cls.id} -> ${resourceId}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('every background\'s originFeatId and every species\' traitIds resolve to real records', () => {
    for (const bg of Object.values(registry.backgrounds)) {
      expect(registry.feats[bg.originFeatId], `${bg.id} -> ${bg.originFeatId}`).toBeDefined()
    }
    for (const sp of Object.values(registry.species)) {
      for (const traitId of sp.traitIds) {
        expect(registry.features[traitId], `${sp.id} -> ${traitId}`).toBeDefined()
      }
    }
  })
})

describe('QA checklist — cross-class rule engine invariants (plan Section 16)', () => {
  it('a level 1 character of any class never receives a feature whose EARLIEST grant is level 3+', () => {
    // A feature id can legitimately reappear at a later level to represent
    // the same feature's choice count growing (e.g. Rogue's Expertise: id
    // "rogue-expertise" is granted at level 1 AND re-listed at level 6) — so
    // the real invariant is about a feature's first appearance, not every
    // level key that happens to reference it.
    for (const classId of ALL_CLASS_IDS) {
      const cls = registry.classes[classId]
      const earliestLevelById = new Map<string, number>()
      for (const [levelStr, ids] of Object.entries(cls.featuresByLevel)) {
        const level = Number(levelStr)
        for (const id of ids) {
          const existing = earliestLevelById.get(id)
          if (existing === undefined || level < existing) earliestLevelById.set(id, level)
        }
      }
      const level1FeatureIds = new Set(getCharacterFeatures(makeCharacter(classId, { level: 1 }), registry).map((f) => f.id))
      for (const [id, earliestLevel] of earliestLevelById) {
        if (earliestLevel >= 3) {
          expect(level1FeatureIds.has(id), `${classId} level 1 incorrectly has "${id}" (first granted at level ${earliestLevel})`).toBe(false)
        }
      }
    }
  })

  it('every class evaluates its full resource/feature set without throwing at every level 1-20', () => {
    for (const classId of ALL_CLASS_IDS) {
      for (let level = 1; level <= 20; level++) {
        const character = makeCharacter(classId, { level })
        expect(() => getCharacterFeatures(character, registry)).not.toThrow()
        for (const def of getResourceDefinitionsForCharacter(character, registry)) {
          expect(() => getResourceMaximum(def, character)).not.toThrow()
        }
      }
    }
  })

  it('a non-caster class never receives spell slots from the generic spell engine', () => {
    for (const classId of NON_CASTER_CLASS_IDS) {
      const character = makeCharacter(classId, { level: 20 })
      expect(getSpellcastingDefinition(character, registry)).toBeUndefined()
      expect(getSpellSlotState(character, registry)).toEqual([])
    }
  })

  it('Warlock Pact Magic is never shaped like a standard per-level full-caster slot table', () => {
    const warlock = makeCharacter('warlock', { level: 11 })
    const casting = getSpellcastingDefinition(warlock, registry)
    expect(casting?.slotProgression).toBe('pact')
    // A full-caster at level 11 has multiple slot levels simultaneously (1st-6th);
    // Warlock's pact pool is always a single row at one slot level.
    expect(getSpellSlotState(warlock, registry)).toHaveLength(1)
  })

  it('a Wizard\'s prepared spells are always validated as a subset of the spellbook — a corrupted save is flagged, not silently accepted', () => {
    const corrupted = makeCharacter('wizard', {
      level: 1,
      selections: { cantripsKnown: ['fireBolt', 'light', 'mageHand'] },
      spellbookSpellIds: ['magicMissile', 'shield', 'mageArmor', 'detectMagic', 'featherFall', 'sleep'],
      preparedSpellIds: ['magicMissile', 'thunderwave'], // thunderwave was never added to the spellbook
    })
    const result = validateCharacter(corrupted, registry)
    expect(result.issues.some((i) => i.code === 'preparedSpellNotInSpellbook')).toBe(true)

    const consistent = { ...corrupted, preparedSpellIds: ['magicMissile', 'shield'] }
    const okResult = validateCharacter(consistent, registry)
    expect(okResult.issues.some((i) => i.code === 'preparedSpellNotInSpellbook')).toBe(false)
  })
})

describe('QA checklist — Exhaustion (PHB 2024 Appendix C, added this phase)', () => {
  it('defaults to 0 and is clamped to [0, 6]', () => {
    const character = makeCharacter('fighter')
    expect(getExhaustionLevel(character)).toBe(0)
    expect(getExhaustionLevel(setExhaustionLevel(character, 9))).toBe(6)
    expect(getExhaustionLevel(setExhaustionLevel(character, -3))).toBe(0)
  })

  it('D20 Test penalty is 2x level and Speed reduction is 5x level', () => {
    const character = setExhaustionLevel(makeCharacter('fighter'), 3)
    expect(getExhaustionD20Penalty(character)).toBe(6)
    expect(getExhaustionSpeedReduction(character)).toBe(15)
  })

  it('finishing a Long Rest removes exactly 1 level, floored at 0', () => {
    const atThree = setExhaustionLevel(makeCharacter('fighter'), 3)
    expect(getExhaustionLevel(reduceExhaustionOnLongRest(atThree))).toBe(2)
    const atZero = makeCharacter('fighter')
    expect(getExhaustionLevel(reduceExhaustionOnLongRest(atZero))).toBe(0)
  })
})

describe('QA checklist — disabling a source hides content from new selection but never breaks an existing character', () => {
  const stubModule: RegistryModule = {
    classes: {
      'test-stub-class': {
        id: 'test-stub-class',
        name: 'Test Stub Class',
        source: { sourceId: 'RAVENLOFT', sourceLabel: 'Ravenloft (stub)' },
        primaryAbilities: ['Intelligence'],
        hitDie: 8,
        subclassLevel: 3,
        featuresByLevel: { 1: ['test-stub-feature'] },
      },
    },
    features: {
      'test-stub-feature': {
        id: 'test-stub-feature',
        name: 'Test Stub Feature',
        source: { sourceId: 'RAVENLOFT', sourceLabel: 'Ravenloft (stub)' },
        activation: 'passive',
        summary: 'A stub feature used only to prove disabling a source never breaks an existing character.',
      },
    },
  }
  const stubRegistry = mergeIntoRegistry(buildRegistry([phb2024Module]), stubModule)

  it('an already-saved character keeps working normally even with its class\'s source absent from enabledSourceIds', () => {
    const character = makeCharacter('test-stub-class', { enabledSourceIds: ['PHB2024'] }) // RAVENLOFT NOT enabled
    const features = getCharacterFeatures(character, stubRegistry)
    expect(features.map((f) => f.id)).toContain('test-stub-feature')
  })
})
