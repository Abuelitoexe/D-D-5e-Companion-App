import type { CharacterState } from '../domain/types'

const MAX_EXHAUSTION_LEVEL = 6

export function getExhaustionLevel(character: CharacterState): number {
  return character.exhaustionLevel ?? 0
}

/** PHB 2024 Appendix C: D20 Test rolls are reduced by 2 per Exhaustion level. */
export function getExhaustionD20Penalty(character: CharacterState): number {
  return getExhaustionLevel(character) * 2
}

/** PHB 2024 Appendix C: Speed is reduced by 5 feet per Exhaustion level. */
export function getExhaustionSpeedReduction(character: CharacterState): number {
  return getExhaustionLevel(character) * 5
}

/** Clamped to [0, 6]. A level of 6 is lethal per the PHB — this app tracks
 * the level but never auto-kills a character, matching its role as a
 * companion rather than a strict rules enforcer. */
export function setExhaustionLevel(character: CharacterState, level: number): CharacterState {
  const clamped = Math.max(0, Math.min(MAX_EXHAUSTION_LEVEL, level))
  return { ...character, exhaustionLevel: clamped, updatedAt: new Date().toISOString() }
}

/** Finishing a Long Rest removes 1 Exhaustion level (PHB 2024, "Long Rest"). */
export function reduceExhaustionOnLongRest(character: CharacterState): CharacterState {
  return setExhaustionLevel(character, getExhaustionLevel(character) - 1)
}
