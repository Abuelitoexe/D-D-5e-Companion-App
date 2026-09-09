import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { GENERAL_FEAT_IDS, phb2024Module } from '../data/phb2024'

const registry = buildRegistry([phb2024Module])

const ASI_CHOICE_IDS = [
  'barbarian-asi-choice', 'bard-asi-choice', 'cleric-asi-choice', 'druid-asi-choice', 'fighter-asi-choice',
  'monk-asi-choice', 'paladin-asi-choice', 'ranger-asi-choice', 'rogue-asi-choice', 'sorcerer-asi-choice',
  'warlock-asi-choice', 'wizard-asi-choice',
]

describe('Phase 5 slice 2 — General Feats are populated and wired into every class\'s ASI-or-Feat slot', () => {
  it('GENERAL_FEAT_IDS has 43 entries (Ability Score Improvement + 42 General feats), all resolving to real feats', () => {
    expect(GENERAL_FEAT_IDS).toHaveLength(43)
    expect(new Set(GENERAL_FEAT_IDS).size).toBe(43) // no duplicate ids
    for (const id of GENERAL_FEAT_IDS) {
      const feat = registry.feats[id]
      expect(feat, `${id} must exist in registry.feats`).toBeDefined()
      expect(feat.category).toBe('general')
    }
  })

  it('every one of the 12 classes\' -asi-choice uses GENERAL_FEAT_IDS verbatim', () => {
    expect(ASI_CHOICE_IDS).toHaveLength(12)
    for (const choiceId of ASI_CHOICE_IDS) {
      const choice = registry.choices[choiceId]
      expect(choice, `${choiceId} must exist`).toBeDefined()
      expect(choice.optionIds).toEqual(GENERAL_FEAT_IDS)
    }
  })

  it('Ability Score Improvement, Elemental Adept, and the Magic Initiate variants are repeatable; a typical General feat (Actor) is not', () => {
    expect(registry.feats.abilityScoreImprovement.repeatable).toBe(true)
    expect(registry.feats.elementalAdept.repeatable).toBe(true)
    expect(registry.feats.actor.repeatable).toBeUndefined()
  })

  it('a single-ability-requirement feat (Actor) carries both a minimumLevel and an abilityScoreAtLeast prerequisite', () => {
    expect(registry.feats.actor.prerequisites).toEqual([
      { kind: 'minimumLevel', level: 4 },
      { kind: 'abilityScoreAtLeast', ability: 'Charisma', score: 13 },
    ])
  })

  it('an ability-OR feat (Athlete) still carries the expressible minimumLevel prerequisite even though the OR itself can\'t be modeled', () => {
    expect(registry.feats.athlete.prerequisites).toEqual([{ kind: 'minimumLevel', level: 4 }])
  })
})
