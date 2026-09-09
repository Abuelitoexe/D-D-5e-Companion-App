import { describe, expect, it } from 'vitest'
import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import { getProficiencyBonus } from '../domain/formulas/proficiencyBonus'
import type { AbilityName, FormulaContext, NumberFormula } from '../domain/types/common'

type CtxOverrides = Partial<Omit<FormulaContext, 'abilityScores'>> & {
  abilityScores?: Partial<Record<AbilityName, number>>
}

function ctx(overrides: CtxOverrides = {}): FormulaContext {
  const baseAbilityScores: Record<AbilityName, number> = {
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10,
  }
  return {
    level: 1,
    classLevel: 1,
    proficiencyBonus: 2,
    ...overrides,
    abilityScores: { ...baseAbilityScores, ...overrides.abilityScores },
  }
}

describe('evaluateFormula', () => {
  it('flat: returns a constant regardless of context', () => {
    expect(evaluateFormula({ kind: 'flat', value: 4 }, ctx({ classLevel: 20 }))).toBe(4)
  })

  it('levelTable: uses the value at the greatest key <= classLevel (Fighter Second Wind: 1 use at lvl1, 2 at lvl8)', () => {
    const secondWind: NumberFormula = { kind: 'levelTable', table: { 1: 1, 8: 2 } }
    expect(evaluateFormula(secondWind, ctx({ classLevel: 1 }))).toBe(1)
    expect(evaluateFormula(secondWind, ctx({ classLevel: 7 }))).toBe(1)
    expect(evaluateFormula(secondWind, ctx({ classLevel: 8 }))).toBe(2)
    expect(evaluateFormula(secondWind, ctx({ classLevel: 20 }))).toBe(2)
  })

  it('abilityModifier: Bardic Inspiration pool = Charisma modifier, minimum 1', () => {
    const bardicInspiration: NumberFormula = { kind: 'abilityModifier', ability: 'Charisma', minimum: 1 }
    // CHA 8 -> modifier -1, floored to the minimum of 1
    expect(evaluateFormula(bardicInspiration, ctx({ abilityScores: { Charisma: 8 } }))).toBe(1)
    // CHA 16 -> modifier +3
    expect(evaluateFormula(bardicInspiration, ctx({ abilityScores: { Charisma: 16 } }))).toBe(3)
    // CHA 20 -> modifier +5
    expect(evaluateFormula(bardicInspiration, ctx({ abilityScores: { Charisma: 20 } }))).toBe(5)
  })

  it('proficiencyBonus: scales with the character\'s current proficiency bonus', () => {
    expect(evaluateFormula({ kind: 'proficiencyBonus' }, ctx({ proficiencyBonus: 3 }))).toBe(3)
    expect(evaluateFormula({ kind: 'proficiencyBonus', multiplier: 2 }, ctx({ proficiencyBonus: 3 }))).toBe(6)
  })

  it('derived: Rogue Sneak Attack dice = ceil(classLevel / 2)', () => {
    const sneakAttackDice: NumberFormula = { kind: 'derived', base: 'classLevel', divisor: 2, rounding: 'up' }
    expect(evaluateFormula(sneakAttackDice, ctx({ classLevel: 1 }))).toBe(1)
    expect(evaluateFormula(sneakAttackDice, ctx({ classLevel: 5 }))).toBe(3)
    expect(evaluateFormula(sneakAttackDice, ctx({ classLevel: 20 }))).toBe(10)
  })

  it('derived: Sorcerer Sorcery Points pool = classLevel', () => {
    const sorceryPoints: NumberFormula = { kind: 'derived', base: 'classLevel', multiplier: 1, rounding: 'down' }
    expect(evaluateFormula(sorceryPoints, ctx({ classLevel: 2 }))).toBe(2)
    expect(evaluateFormula(sorceryPoints, ctx({ classLevel: 20 }))).toBe(20)
  })

  it('sum: combines multiple formulas (e.g. a flat base plus an ability modifier)', () => {
    const combined: NumberFormula = {
      kind: 'sum',
      terms: [
        { kind: 'flat', value: 2 },
        { kind: 'abilityModifier', ability: 'Wisdom' },
      ],
    }
    expect(evaluateFormula(combined, ctx({ abilityScores: { Wisdom: 14 } }))).toBe(4) // 2 + (+2)
  })
})

describe('getProficiencyBonus', () => {
  it('follows the PHB 2024 Character Advancement table (p.41)', () => {
    expect(getProficiencyBonus(1)).toBe(2)
    expect(getProficiencyBonus(4)).toBe(2)
    expect(getProficiencyBonus(5)).toBe(3)
    expect(getProficiencyBonus(8)).toBe(3)
    expect(getProficiencyBonus(9)).toBe(4)
    expect(getProficiencyBonus(12)).toBe(4)
    expect(getProficiencyBonus(13)).toBe(5)
    expect(getProficiencyBonus(16)).toBe(5)
    expect(getProficiencyBonus(17)).toBe(6)
    expect(getProficiencyBonus(20)).toBe(6)
  })
})
