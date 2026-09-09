import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import { applyAbilityScoreIncreases, applyHitPointGain, getHitPointMaximum, isAllocationComplete } from '../engine'
import type { AbilityName, CharacterState } from '../domain/types'

const registry = buildRegistry([phb2024Module])

function baseAbilityScores(overrides: Partial<Record<AbilityName, number>> = {}): Record<AbilityName, number> {
  return { Strength: 15, Dexterity: 13, Constitution: 14, Intelligence: 10, Wisdom: 12, Charisma: 8, ...overrides }
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

describe('getHitPointMaximum — PHB 2024 p.40/42', () => {
  it('level 1 Fighter (d10, Con 14 -> +2 modifier) = hitDie + Con modifier = 12', () => {
    expect(getHitPointMaximum(makeFighter({ level: 1 }), registry)).toBe(12)
  })

  it('level 4 Fighter uses the Fixed Hit Points average (floor(10/2)+1=6) + Con modifier per level after 1', () => {
    // 12 (level 1) + 3 * (6 + 2) = 12 + 24 = 36
    expect(getHitPointMaximum(makeFighter({ level: 4 }), registry)).toBe(36)
  })

  it('level 1 Wizard (d6, Con 14) = 6 + 2 = 8', () => {
    expect(getHitPointMaximum(makeFighter({ level: 1, classId: 'wizard' }), registry)).toBe(8)
  })

  it('a negative Constitution modifier never reduces the per-level gain below 1 (PHB "minimum of 1")', () => {
    // Con 6 -> modifier -2; per-level average = floor(10/2)+1-2 = 4, still positive here,
    // so use a lower Hit Die (Wizard d6) with a very low Con to force the floor:
    // floor(6/2)+1 + (-3 from Con 4) = 4 - 3 = 1 -> clamps to max(1, 1) = 1, not below.
    const character = makeFighter({ level: 5, classId: 'wizard', abilityScores: baseAbilityScores({ Constitution: 4 }) })
    // level1: 6 + (-3) = 3; levels 2-5 (4 levels) each contribute max(1, 4-3)=1 -> 3 + 4*1 = 7
    expect(getHitPointMaximum(character, registry)).toBe(7)
  })

  it('retroactively reflects a Constitution increase across every level already attained', () => {
    const withCon14 = makeFighter({ level: 5 }) // Con 14, +2 modifier
    const maxAtCon14 = getHitPointMaximum(withCon14, registry) // 12 + 4*8 = 44
    const withCon16 = { ...withCon14, abilityScores: baseAbilityScores({ Constitution: 16 }) } // +3 modifier
    const maxAtCon16 = getHitPointMaximum(withCon16, registry) // 13 + 4*9 = 49
    expect(maxAtCon14).toBe(44)
    expect(maxAtCon16).toBe(49)
    expect(maxAtCon16 - maxAtCon14).toBe(5) // +1 HP per level attained (5 levels) for the +1 Con modifier
  })
})

describe('applyHitPointGain', () => {
  it('increases current HP by the same amount as max HP on a level-up', () => {
    const previous = makeFighter({ level: 1, currentHP: 12, maxHP: 12 }) // full HP at level 1
    const next = { ...previous, level: 2 }
    const result = applyHitPointGain(previous, next, registry)
    expect(result.maxHP).toBe(getHitPointMaximum(next, registry))
    expect(result.currentHP).toBe(result.maxHP) // was at full, stays at full
  })

  it('preserves a damaged character\'s HP deficit rather than healing them on level-up', () => {
    const previous = makeFighter({ level: 1, currentHP: 5, maxHP: 12 }) // damaged: 7 HP missing
    const next = { ...previous, level: 2 }
    const result = applyHitPointGain(previous, next, registry)
    const gained = getHitPointMaximum(next, registry) - getHitPointMaximum(previous, registry)
    expect(result.currentHP).toBe(5 + gained)
    expect(result.currentHP).toBeLessThan(result.maxHP!) // still damaged relative to the new max
  })

  it('folds in a same-level-up Constitution increase (ASI) as part of the same diff', () => {
    const level3 = makeFighter({ level: 3 }) // Con 14
    const startingMax = getHitPointMaximum(level3, registry) // 12 + 2*8 = 28
    const previous = { ...level3, currentHP: startingMax, maxHP: startingMax } // full HP at level 3
    // Simulate leveling to 4 AND raising Constitution from 14 to 16 in the same level-up.
    const next = { ...previous, level: 4, abilityScores: baseAbilityScores({ Constitution: 16 }) }
    const result = applyHitPointGain(previous, next, registry)
    // Expected: full recompute at level 4 with Con 16 (13 + 3*9 = 40), minus level 3 with Con 14 (28) = +12.
    const expectedNewMax = getHitPointMaximum(next, registry)
    expect(expectedNewMax).toBe(40)
    expect(result.maxHP).toBe(expectedNewMax)
    expect(result.currentHP).toBe(expectedNewMax) // started full, still full after the combined gain
  })
})

describe('applyAbilityScoreIncreases — PHB 2024 p.202', () => {
  it('a single-ability allocation increases that score by 2', () => {
    const result = applyAbilityScoreIncreases(baseAbilityScores(), [['Strength']])
    expect(result.Strength).toBe(17)
  })

  it('a two-ability allocation increases each by 1', () => {
    const result = applyAbilityScoreIncreases(baseAbilityScores(), [['Strength', 'Constitution']])
    expect(result.Strength).toBe(16)
    expect(result.Constitution).toBe(15)
  })

  it('never raises a score above 20', () => {
    const result = applyAbilityScoreIncreases(baseAbilityScores({ Strength: 19 }), [['Strength']])
    expect(result.Strength).toBe(20)
  })

  it('applies multiple allocations from multiple level-ups in sequence', () => {
    const afterFirst = applyAbilityScoreIncreases(baseAbilityScores(), [['Strength']])
    const afterSecond = applyAbilityScoreIncreases(afterFirst, [['Strength', 'Constitution']])
    expect(afterSecond.Strength).toBe(18) // 15 -> 17 -> 18
    expect(afterSecond.Constitution).toBe(15) // 14 -> 15
  })
})

describe('isAllocationComplete', () => {
  it('a single allocation is complete once one ability is chosen', () => {
    expect(isAllocationComplete(['Strength'], 'single')).toBe(true)
    expect(isAllocationComplete([], 'single')).toBe(false)
  })

  it('a double allocation requires two distinct abilities', () => {
    expect(isAllocationComplete(['Strength', 'Constitution'], 'double')).toBe(true)
    expect(isAllocationComplete(['Strength', 'Strength'], 'double')).toBe(false)
    expect(isAllocationComplete(['Strength'], 'double')).toBe(false)
  })
})
