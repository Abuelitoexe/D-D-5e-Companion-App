import type { FormulaContext, NumberFormula } from '../types/common'

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

/**
 * The single evaluator behind every numeric value in the ruleset — resource
 * maxima, prepared-spell counts, conditional-modifier dice, choice counts,
 * feature scaling. Keeping this the ONLY place that interprets a NumberFormula
 * is what lets class data differ (a level table here, an ability modifier
 * there) without the engine ever branching on a class's name.
 */
export function evaluateFormula(formula: NumberFormula, ctx: FormulaContext): number {
  switch (formula.kind) {
    case 'flat':
      return formula.value

    case 'levelTable': {
      // Sparse table keyed by level; use the value at the greatest key <= the
      // relevant level. Level tables in the PHB are always keyed by class
      // level (Rage uses, Second Wind uses, Channel Divinity uses, ...).
      const keys = Object.keys(formula.table)
        .map(Number)
        .sort((a, b) => a - b)
      let value = 0
      for (const key of keys) {
        if (key <= ctx.classLevel) value = formula.table[key]
        else break
      }
      return value
    }

    case 'abilityModifier': {
      const mod = getAbilityModifier(ctx.abilityScores[formula.ability])
      return formula.minimum !== undefined ? Math.max(formula.minimum, mod) : mod
    }

    case 'proficiencyBonus':
      return ctx.proficiencyBonus * (formula.multiplier ?? 1)

    case 'derived': {
      let value = formula.base === 'level' ? ctx.level : ctx.classLevel
      if (formula.divisor !== undefined) value = value / formula.divisor
      if (formula.multiplier !== undefined) value = value * formula.multiplier
      value = formula.rounding === 'up' ? Math.ceil(value) : Math.floor(value)
      if (formula.addend !== undefined) value += formula.addend
      return value
    }

    case 'sum':
      return formula.terms.reduce((total, term) => total + evaluateFormula(term, ctx), 0)
  }
}
