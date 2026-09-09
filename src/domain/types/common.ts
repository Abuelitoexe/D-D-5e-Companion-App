export type AbilityName =
  | 'Strength'
  | 'Dexterity'
  | 'Constitution'
  | 'Intelligence'
  | 'Wisdom'
  | 'Charisma'

export type ActivationType =
  | 'action'
  | 'bonusAction'
  | 'reaction'
  | 'passive'
  | 'movement'
  | 'special'

/**
 * Every number in the ruleset that varies by level, ability score, or proficiency
 * bonus is expressed as one of these, and evaluated by evaluateFormula (see
 * domain/formulas). This is what lets the engine avoid ever special-casing a
 * class by name: a resource pool sized "= Charisma modifier" (Bardic Inspiration)
 * and one sized by a flat level table (Rage) are the same type.
 */
export type NumberFormula =
  | { kind: 'flat'; value: number }
  | { kind: 'levelTable'; table: Record<number, number> } // sparse; use greatest key <= level
  | { kind: 'abilityModifier'; ability: AbilityName; minimum?: number }
  | { kind: 'proficiencyBonus'; multiplier?: number }
  | {
      kind: 'derived'
      base: 'level' | 'classLevel'
      divisor?: number
      multiplier?: number
      rounding: 'up' | 'down'
      addend?: number
    }
  | { kind: 'sum'; terms: NumberFormula[] }

export interface FormulaContext {
  level: number
  classLevel: number
  abilityScores: Record<AbilityName, number>
  proficiencyBonus: number
}

/**
 * A value that changes at a specific later level — e.g. Bardic Inspiration's
 * refresh rule going from long-rest-only to short-or-long-rest at level 5.
 * Generic so any leveled property (not just refresh rules) can reuse it.
 */
export interface LeveledValue<T> {
  default: T
  overridesFromLevel?: { level: number; value: T }[]
}
