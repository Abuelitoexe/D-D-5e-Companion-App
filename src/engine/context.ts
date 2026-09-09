import { getProficiencyBonus } from '../domain/formulas/proficiencyBonus'
import type { CharacterState, FormulaContext } from '../domain/types'

/** No multiclassing in v1, so character level and class level are always equal. */
export function buildFormulaContext(character: CharacterState): FormulaContext {
  return {
    level: character.level,
    classLevel: character.level,
    abilityScores: character.abilityScores,
    proficiencyBonus: getProficiencyBonus(character.level),
  }
}
