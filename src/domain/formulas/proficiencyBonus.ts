/**
 * PHB 2024 Character Advancement table (p.41): Proficiency Bonus by level.
 * +2 through level 4, +3 through 8, +4 through 12, +5 through 16, +6 through 20.
 */
const PROFICIENCY_BONUS_TABLE: Record<number, number> = {
  1: 2,
  5: 3,
  9: 4,
  13: 5,
  17: 6,
}

export function getProficiencyBonus(level: number): number {
  const keys = Object.keys(PROFICIENCY_BONUS_TABLE)
    .map(Number)
    .sort((a, b) => a - b)
  let bonus = PROFICIENCY_BONUS_TABLE[1]
  for (const key of keys) {
    if (key <= level) bonus = PROFICIENCY_BONUS_TABLE[key]
    else break
  }
  return bonus
}
