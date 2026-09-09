import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import {
  applyLongRest,
  canCompleteLevelUp,
  getAvailableActions,
  getAvailableBonusActions,
  getAvailableReactions,
  getCharacterFeatures,
  getResourceState,
  getSpellcastingState,
  getSpellDeficits,
  getSpellSlotState,
  spendResourceUse,
  spendSpellSlot,
  validateCharacter,
} from '../engine'
import type { AbilityName, CharacterState } from '../domain/types'

const registry = buildRegistry([phb2024Module])

function baseAbilityScores(): Record<AbilityName, number> {
  return { Strength: 8, Dexterity: 14, Constitution: 14, Intelligence: 16, Wisdom: 12, Charisma: 10 }
}

function makeWizard(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'test-wizard',
    name: 'Test Wizard',
    level: 1,
    classId: 'wizard',
    backgroundId: 'soldier',
    speciesId: 'human',
    enabledSourceIds: ['PHB2024'],
    abilityScores: baseAbilityScores(),
    selections: {},
    preparedSpellIds: [],
    spellbookSpellIds: [],
    resourceState: [],
    activeEffects: [],
    equipmentIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const CANTRIPS = ['fireBolt', 'light', 'mageHand']
const SPELLBOOK_L1 = ['detectMagic', 'featherFall', 'mageArmor', 'magicMissile', 'sleep', 'thunderwave']

describe('registry contains the Wizard vertical slice content', () => {
  it('has the Wizard class, all 4 PHB subclasses, and the 36-spell test set', () => {
    expect(registry.classes.wizard).toBeDefined()
    expect(Object.values(registry.subclasses).filter((s) => s.parentClassId === 'wizard')).toHaveLength(4)
    expect(Object.keys(registry.spells).length).toBeGreaterThanOrEqual(36)
  })
})

describe('getCharacterFeatures — Wizard', () => {
  it('a level 1 Wizard has Spellcasting, Ritual Adept, and Arcane Recovery', () => {
    const ids = getCharacterFeatures(makeWizard({ level: 1 }), registry).map((f) => f.id)
    expect(ids).toContain('wizard-spellcasting')
    expect(ids).toContain('wizard-ritual-adept')
    expect(ids).toContain('wizard-arcane-recovery')
    expect(ids).not.toContain('wizard-scholar') // level 2
  })

  it('Abjurer subclass features are gated by their own levels', () => {
    const ids = getCharacterFeatures(makeWizard({ level: 6, subclassId: 'abjurer' }), registry).map((f) => f.id)
    expect(ids).toContain('abjurer-abjurationSavant') // level 3
    expect(ids).toContain('abjurer-arcaneWard') // level 3
    expect(ids).toContain('abjurer-projectedWard') // level 6
    expect(ids).not.toContain('abjurer-spellBreaker') // level 10, not yet
  })
})

describe('getSpellcastingState — verified against PHB p.166 Wizard Features table', () => {
  it('cantrips known: 3 at level 1, 4 at level 4, 5 at level 10', () => {
    expect(getSpellcastingState(makeWizard({ level: 1 }), registry)?.cantripsMax).toBe(3)
    expect(getSpellcastingState(makeWizard({ level: 4 }), registry)?.cantripsMax).toBe(4)
    expect(getSpellcastingState(makeWizard({ level: 10 }), registry)?.cantripsMax).toBe(5)
  })

  it('prepared spells: 4/5/6/7 at levels 1-4, then 9/10/11/12 at levels 5-8 (matches the confirmed non-linear table)', () => {
    expect(getSpellcastingState(makeWizard({ level: 1 }), registry)?.preparedMax).toBe(4)
    expect(getSpellcastingState(makeWizard({ level: 3 }), registry)?.preparedMax).toBe(6) // confirmed by PHB prose example
    expect(getSpellcastingState(makeWizard({ level: 5 }), registry)?.preparedMax).toBe(9)
    expect(getSpellcastingState(makeWizard({ level: 20 }), registry)?.preparedMax).toBe(25)
  })

  it('spellbook grows 6 at level 1, +2 per level after (8, 10, 12...)', () => {
    expect(getSpellcastingState(makeWizard({ level: 1 }), registry)?.spellbookMax).toBe(6)
    expect(getSpellcastingState(makeWizard({ level: 2 }), registry)?.spellbookMax).toBe(8)
    expect(getSpellcastingState(makeWizard({ level: 3 }), registry)?.spellbookMax).toBe(10)
  })

  it('spell slots match the confirmed table: level 1 = one L1 slot tier of 2; level 3 = 4/2; level 5 = 4/3/2', () => {
    expect(getSpellSlotState(makeWizard({ level: 1 }), registry)).toEqual([{ level: 1, current: 2, max: 2 }])
    expect(getSpellSlotState(makeWizard({ level: 3 }), registry)).toEqual([
      { level: 1, current: 4, max: 4 },
      { level: 2, current: 2, max: 2 },
    ])
    expect(getSpellSlotState(makeWizard({ level: 5 }), registry)).toEqual([
      { level: 1, current: 4, max: 4 },
      { level: 2, current: 3, max: 3 },
      { level: 3, current: 2, max: 2 },
    ])
  })
})

describe('spell slots and rests', () => {
  it('spending a slot reduces current but not max', () => {
    let character = makeWizard({ level: 3 })
    character = spendSpellSlot(character, registry, 1)
    const slots = getSpellSlotState(character, registry)
    expect(slots.find((s) => s.level === 1)).toEqual({ level: 1, current: 3, max: 4 })
    expect(slots.find((s) => s.level === 2)).toEqual({ level: 2, current: 2, max: 2 })
  })

  it('a Long Rest fully restores all spell slots (Wizard has no short-rest slot recovery)', () => {
    let character = makeWizard({ level: 3 })
    character = spendSpellSlot(character, registry, 1)
    character = spendSpellSlot(character, registry, 2)
    character = applyLongRest(character, registry)
    const slots = getSpellSlotState(character, registry)
    expect(slots.find((s) => s.level === 1)?.current).toBe(4)
    expect(slots.find((s) => s.level === 2)?.current).toBe(2)
  })

  it('Arcane Recovery is a single Long-Rest-only use, separate from spell slots', () => {
    let character = makeWizard({ level: 1 })
    expect(getResourceState(character, registry).find((r) => r.resourceId === 'arcaneRecovery')?.max).toBe(1)
    character = spendResourceUse(character, registry, 'arcaneRecovery')
    expect(getResourceState(character, registry).find((r) => r.resourceId === 'arcaneRecovery')?.current).toBe(0)
    character = applyLongRest(character, registry)
    expect(getResourceState(character, registry).find((r) => r.resourceId === 'arcaneRecovery')?.current).toBe(1)
  })
})

describe('getSpellDeficits and Level Up gating', () => {
  it('a fresh level 1 Wizard has cantrip/spellbook/prepared deficits', () => {
    const deficits = getSpellDeficits(makeWizard({ level: 1 }), registry)
    expect(deficits).toEqual({ cantrips: 3, spellbook: 6, prepared: 4 })
  })

  it('deficits resolve once selections are made', () => {
    const character = makeWizard({
      level: 1,
      selections: { cantripsKnown: CANTRIPS },
      spellbookSpellIds: SPELLBOOK_L1,
      preparedSpellIds: SPELLBOOK_L1.slice(0, 4),
    })
    expect(getSpellDeficits(character, registry)).toEqual({ cantrips: 0, spellbook: 0, prepared: 0 })
  })

  it('canCompleteLevelUp is false with spell deficits unresolved, true once resolved (plus mundane choices)', () => {
    const incomplete = makeWizard({
      level: 1,
      selections: { cantripsKnown: CANTRIPS, 'wizard-scholar-choice': ['skill-arcana'] },
      spellbookSpellIds: SPELLBOOK_L1,
      preparedSpellIds: SPELLBOOK_L1.slice(0, 4),
    })
    // Leveling to 2 requires the Scholar skill choice at level 2, already present here,
    // and level-2 spell deficits (spellbook should grow to 8, prepared to 5).
    expect(canCompleteLevelUp(incomplete, 2, registry)).toBe(false)

    const complete = {
      ...incomplete,
      spellbookSpellIds: [...SPELLBOOK_L1, 'burningHands', 'shield'],
      preparedSpellIds: [...SPELLBOOK_L1.slice(0, 4), 'burningHands'],
    }
    expect(canCompleteLevelUp(complete, 2, registry)).toBe(true)
  })
})

describe('getAvailableActions — spells', () => {
  const fullyPreparedWizard = () =>
    makeWizard({
      level: 1,
      selections: { cantripsKnown: CANTRIPS },
      spellbookSpellIds: SPELLBOOK_L1,
      preparedSpellIds: ['shield', 'featherFall', 'magicMissile', 'sleep'],
    })

  it('cantrips (level 0) appear under Action without needing a spell slot', () => {
    const actions = getAvailableActions(fullyPreparedWizard(), { actionUsed: false, bonusActionUsed: false, reactionUsed: false, movementUsed: 0, onceThisTurnFlags: [], turnNumber: 1 }, registry, 'action')
    const fireBolt = actions.find((a) => a.id === 'spell-fireBolt')
    expect(fireBolt?.available).toBe(true)
  })

  it('Reaction-cast spells (Shield, Feather Fall) appear under Reaction, not Action', () => {
    const turn = { actionUsed: false, bonusActionUsed: false, reactionUsed: false, movementUsed: 0, onceThisTurnFlags: [], turnNumber: 1 }
    const reactions = getAvailableReactions(fullyPreparedWizard(), turn, registry).map((a) => a.id)
    expect(reactions).toContain('spell-shield')
    expect(reactions).toContain('spell-featherFall')
    const actions = getAvailableActions(fullyPreparedWizard(), turn, registry, 'action').map((a) => a.id)
    expect(actions).not.toContain('spell-shield')
  })

  it('a prepared leveled spell becomes unavailable once its slot level is exhausted', () => {
    let character = fullyPreparedWizard() // 2 level-1 slots at level 1
    character = spendSpellSlot(character, registry, 1)
    character = spendSpellSlot(character, registry, 1)
    const turn = { actionUsed: false, bonusActionUsed: false, reactionUsed: false, movementUsed: 0, onceThisTurnFlags: [], turnNumber: 1 }
    const magicMissile = getAvailableActions(character, turn, registry, 'action').find((a) => a.id === 'spell-magicMissile')
    expect(magicMissile?.available).toBe(false)
    expect(magicMissile?.unavailableReason).toBe('noSpellSlots')
  })

  it('Misty Step (Bonus Action cast) is correctly bucketed even though it is not on this Wizard\'s prepared list yet', () => {
    // Sanity check the classifier itself rather than requiring Misty Step prepared.
    const turn = { actionUsed: false, bonusActionUsed: false, reactionUsed: false, movementUsed: 0, onceThisTurnFlags: [], turnNumber: 1 }
    const character = { ...fullyPreparedWizard(), level: 3, preparedSpellIds: ['mistyStep'], spellbookSpellIds: [...SPELLBOOK_L1, 'mistyStep', 'scorchingRay'] }
    const bonusActions = getAvailableBonusActions(character, turn, registry)
    expect(bonusActions.find((a) => a.id === 'spell-mistyStep')).toBeDefined()
  })
})

describe('validateCharacter — Wizard', () => {
  it('flags incomplete spell selections', () => {
    const result = validateCharacter(makeWizard({ level: 1 }), registry)
    expect(result.issues.some((i) => i.code === 'incompleteSpellSelections')).toBe(true)
  })
})
