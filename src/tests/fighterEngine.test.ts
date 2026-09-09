import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import {
  applyLongRest,
  applyShortRest,
  canCompleteLevelUp,
  createInitialTurnState,
  getAvailableActions,
  getAvailableBonusActions,
  getAvailableSpecialOptions,
  getCharacterFeatures,
  getLevelUpPreview,
  getResourceState,
  getUnresolvedChoices,
  spendResourceUse,
  validateCharacter,
} from '../engine'
import type { AbilityName, CharacterState } from '../domain/types'

const registry = buildRegistry([phb2024Module])

function baseAbilityScores(): Record<AbilityName, number> {
  return { Strength: 16, Dexterity: 12, Constitution: 14, Intelligence: 10, Wisdom: 10, Charisma: 8 }
}

function makeFighter(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-fighter',
    name: 'Test Fighter',
    level: 1,
    classId: 'fighter',
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

describe('registry contains the Fighter vertical slice content', () => {
  it('has the Fighter class and all 4 PHB subclasses', () => {
    expect(registry.classes.fighter).toBeDefined()
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'fighter')).toHaveLength(4)
  })
})

describe('getCharacterFeatures', () => {
  it('a level 1 Fighter has level 1 features only, plus species traits', () => {
    const features = getCharacterFeatures(makeFighter({ level: 1 }), registry)
    const ids = features.map((f) => f.id)
    expect(ids).toContain('fighter-fighting-style')
    expect(ids).toContain('fighter-second-wind')
    expect(ids).toContain('fighter-weapon-mastery')
    expect(ids).toContain('humanResourceful')
    expect(ids).not.toContain('fighter-action-surge') // level 2 feature
    expect(ids).not.toContain('fighter-extra-attack') // level 5 feature
  })

  it('does not grant subclass features before the subclass is chosen, even past level 3', () => {
    const features = getCharacterFeatures(makeFighter({ level: 5 }), registry)
    expect(features.map((f) => f.id)).not.toContain('champion-improvedCritical')
  })

  it('grants subclass features once a subclass is set, gated by the subclass\'s own levels', () => {
    const level7Champion = getCharacterFeatures(makeFighter({ level: 7, subclassId: 'champion' }), registry)
    const ids = level7Champion.map((f) => f.id)
    expect(ids).toContain('champion-improvedCritical') // level 3
    expect(ids).toContain('champion-additionalFightingStyle') // level 7
    expect(ids).not.toContain('champion-heroicWarrior') // level 10, not yet
  })

  it('Fighter reaches Extra Attack at 5, Two Extra Attacks at 11, Three Extra Attacks at 20 (verified against PHB p.92)', () => {
    expect(getCharacterFeatures(makeFighter({ level: 5 }), registry).map((f) => f.id)).toContain('fighter-extra-attack')
    expect(getCharacterFeatures(makeFighter({ level: 11 }), registry).map((f) => f.id)).toContain('fighter-two-extra-attacks')
    expect(getCharacterFeatures(makeFighter({ level: 20 }), registry).map((f) => f.id)).toContain('fighter-three-extra-attacks')
  })
})

describe('getResourceState — Fighter Features table (PHB p.91), re-verified via raw extraction', () => {
  it('Second Wind: 2 uses at level 1, 3 at level 4, 4 at level 10', () => {
    expect(getResourceState(makeFighter({ level: 1 }), registry).find((r) => r.resourceId === 'secondWind')?.max).toBe(2)
    expect(getResourceState(makeFighter({ level: 4 }), registry).find((r) => r.resourceId === 'secondWind')?.max).toBe(3)
    expect(getResourceState(makeFighter({ level: 10 }), registry).find((r) => r.resourceId === 'secondWind')?.max).toBe(4)
  })

  it('Action Surge: not available before level 2, 1 use at level 2, 2 uses at level 17', () => {
    expect(getResourceState(makeFighter({ level: 1 }), registry).find((r) => r.resourceId === 'actionSurge')).toBeUndefined()
    expect(getResourceState(makeFighter({ level: 2 }), registry).find((r) => r.resourceId === 'actionSurge')?.max).toBe(1)
    expect(getResourceState(makeFighter({ level: 17 }), registry).find((r) => r.resourceId === 'actionSurge')?.max).toBe(2)
  })

  it('Indomitable: 1 use at level 9, 2 at level 13, 3 at level 17', () => {
    expect(getResourceState(makeFighter({ level: 9 }), registry).find((r) => r.resourceId === 'indomitable')?.max).toBe(1)
    expect(getResourceState(makeFighter({ level: 13 }), registry).find((r) => r.resourceId === 'indomitable')?.max).toBe(2)
    expect(getResourceState(makeFighter({ level: 17 }), registry).find((r) => r.resourceId === 'indomitable')?.max).toBe(3)
  })

  it('a Battle Master gains Superiority Dice (4 at level 3) only once that subclass is chosen', () => {
    expect(getResourceState(makeFighter({ level: 3 }), registry).find((r) => r.resourceId === 'superiorityDice')).toBeUndefined()
    expect(
      getResourceState(makeFighter({ level: 3, subclassId: 'battleMaster' }), registry).find((r) => r.resourceId === 'superiorityDice')?.max,
    ).toBe(4)
  })
})

describe('rest recovery', () => {
  it('Short Rest restores only 1 Second Wind use (partial refresh), not the full max', () => {
    let character = makeFighter({ level: 4 }) // max Second Wind = 3
    character = spendResourceUse(character, registry, 'secondWind')
    character = spendResourceUse(character, registry, 'secondWind') // current = 1
    character = applyShortRest(character, registry)
    expect(character.resourceState.find((s) => s.resourceId === 'secondWind')?.current).toBe(2)
  })

  it('Long Rest fully restores Second Wind and Action Surge', () => {
    let character = makeFighter({ level: 17 })
    character = spendResourceUse(character, registry, 'secondWind')
    character = spendResourceUse(character, registry, 'actionSurge')
    character = spendResourceUse(character, registry, 'actionSurge')
    character = applyLongRest(character, registry)
    expect(character.resourceState.find((s) => s.resourceId === 'secondWind')?.current).toBe(4)
    expect(character.resourceState.find((s) => s.resourceId === 'actionSurge')?.current).toBe(2)
  })

  it('a resource not yet unlocked at the character\'s level is untouched by rest', () => {
    const character = applyLongRest(makeFighter({ level: 1 }), registry)
    expect(character.resourceState.find((s) => s.resourceId === 'actionSurge')).toBeUndefined()
  })
})

describe('getUnresolvedChoices', () => {
  it('a fresh level 1 Fighter has unresolved Fighting Style and Weapon Mastery choices', () => {
    const unresolved = getUnresolvedChoices(makeFighter({ level: 1 }), registry)
    const ids = unresolved.map((u) => u.choiceId)
    expect(ids).toContain('fighter-fighting-style-choice')
    expect(ids).toContain('fighter-weapon-mastery-choice')
  })

  it('resolves once enough selections are made', () => {
    const character = makeFighter({
      level: 1,
      selections: {
        'fighter-fighting-style-choice': ['defense'],
        'fighter-weapon-mastery-choice': ['weapon-mastery-greatsword', 'weapon-mastery-longsword', 'weapon-mastery-longbow'],
      },
    })
    const unresolved = getUnresolvedChoices(character, registry)
    expect(unresolved.map((u) => u.choiceId)).not.toContain('fighter-fighting-style-choice')
    expect(unresolved.map((u) => u.choiceId)).not.toContain('fighter-weapon-mastery-choice')
  })

  it('Weapon Mastery requires MORE selections once the character reaches level 4 (3 -> 4 kinds)', () => {
    const character = makeFighter({
      level: 4,
      selections: { 'fighter-weapon-mastery-choice': ['weapon-mastery-greatsword', 'weapon-mastery-longsword', 'weapon-mastery-longbow'] },
    })
    const unresolved = getUnresolvedChoices(character, registry)
    expect(unresolved.find((u) => u.choiceId === 'fighter-weapon-mastery-choice')?.missingSelections).toBe(1)
  })
})

describe('getAvailableActions / BonusActions / Special', () => {
  it('a fresh turn surfaces all 12 general actions under Action, all available', () => {
    const actions = getAvailableActions(makeFighter(), createInitialTurnState(), registry, 'action')
    const general = actions.filter((a) => a.sourceKind === 'general')
    expect(general).toHaveLength(12)
    expect(general.every((a) => a.available)).toBe(true)
  })

  it('Second Wind appears as an available Bonus Action for a level 1 Fighter', () => {
    const bonusActions = getAvailableBonusActions(makeFighter(), createInitialTurnState(), registry)
    const secondWind = bonusActions.find((a) => a.id === 'fighter-second-wind')
    expect(secondWind?.available).toBe(true)
  })

  it('Second Wind becomes unavailable once its resource uses are exhausted', () => {
    let character = makeFighter({ level: 1 }) // max 2
    character = spendResourceUse(character, registry, 'secondWind')
    character = spendResourceUse(character, registry, 'secondWind')
    const bonusActions = getAvailableBonusActions(character, createInitialTurnState(), registry)
    const secondWind = bonusActions.find((a) => a.id === 'fighter-second-wind')
    expect(secondWind?.available).toBe(false)
    expect(secondWind?.unavailableReason).toBe('noResourceUses')
  })

  it('Action Surge appears under the Special/Other bucket, not Action or Bonus Action', () => {
    const character = makeFighter({ level: 2 })
    const turn = createInitialTurnState()
    expect(getAvailableSpecialOptions(character, turn, registry).map((a) => a.id)).toContain('fighter-action-surge')
    expect(getAvailableActions(character, turn, registry, 'action').map((a) => a.id)).not.toContain('fighter-action-surge')
    expect(getAvailableBonusActions(character, turn, registry).map((a) => a.id)).not.toContain('fighter-action-surge')
  })

  it('a weapon attack is offered once the weapon is equipped, tagged with its Mastery property if selected', () => {
    const character = makeFighter({
      equipmentIds: ['greatsword'],
      selections: { 'fighter-weapon-mastery-choice': ['weapon-mastery-greatsword'] },
    })
    const actions = getAvailableActions(character, createInitialTurnState(), registry, 'action')
    const attack = actions.find((a) => a.id === 'attack-greatsword')
    expect(attack).toBeDefined()
    expect(attack?.summary).toContain('Graze') // Greatsword's mastery property, PHB p.214
  })

  it('the Attack action (general or weapon) is unavailable once the Action slot is used this turn', () => {
    const turn = { ...createInitialTurnState(), actionUsed: true }
    const actions = getAvailableActions(makeFighter(), turn, registry, 'action')
    expect(actions.every((a) => !a.available)).toBe(true)
  })
})

describe('getLevelUpPreview', () => {
  it('leveling 1 -> 5 previews Extra Attack as a gain and the level-4 ASI as a required choice', () => {
    const preview = getLevelUpPreview(makeFighter({ level: 1 }), 5, registry)
    expect(preview.gains.map((g) => g.featureId)).toContain('fighter-extra-attack')
    expect(preview.requiredChoices.some((c) => c.choiceId === 'fighter-asi-choice')).toBe(true)
  })

  it('leveling into level 3 previews a subclass choice as required', () => {
    const preview = getLevelUpPreview(makeFighter({ level: 1 }), 3, registry)
    expect(preview.requiredChoices.some((c) => c.type === 'subclassUnlock')).toBe(true)
  })

  it('previews the Second Wind resource increase at level 4 without mutating the character', () => {
    const character = makeFighter({ level: 1 })
    const preview = getLevelUpPreview(character, 4, registry)
    const secondWindChange = preview.resourceChanges.find((r) => r.resourceId === 'secondWind')
    expect(secondWindChange).toEqual({ resourceId: 'secondWind', name: 'Second Wind', oldMax: 2, newMax: 3 })
    expect(character.level).toBe(1) // unchanged — preview must not mutate
  })

  it('canCompleteLevelUp is false while a mandatory choice (subclass) is unresolved, true once resolved', () => {
    const character = makeFighter({
      level: 2,
      selections: {
        'fighter-fighting-style-choice': ['defense'],
        'fighter-weapon-mastery-choice': ['weapon-mastery-greatsword', 'weapon-mastery-longsword', 'weapon-mastery-longbow'],
      },
    })
    expect(canCompleteLevelUp(character, 3, registry)).toBe(false)
    expect(canCompleteLevelUp({ ...character, subclassId: 'champion' }, 3, registry)).toBe(true)
  })
})

describe('validateCharacter', () => {
  it('flags a level 3+ character with no subclass selected', () => {
    const result = validateCharacter(makeFighter({ level: 3 }), registry)
    expect(result.issues.some((i) => i.code === 'missingSubclass')).toBe(true)
  })

  it('is valid once required choices (including Human species traits) and subclass are resolved', () => {
    const character = makeFighter({
      level: 3,
      subclassId: 'champion',
      selections: {
        'fighter-fighting-style-choice': ['defense'],
        'fighter-weapon-mastery-choice': ['weapon-mastery-greatsword', 'weapon-mastery-longsword', 'weapon-mastery-longbow'],
        'human-skillful-choice': ['skill-perception'],
        'human-versatile-choice': ['savageAttacker'],
      },
    })
    const result = validateCharacter(character, registry)
    expect(result.issues).toEqual([])
    expect(result.valid).toBe(true)
  })
})
