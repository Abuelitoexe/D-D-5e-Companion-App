import { getAbilityModifier } from '../domain/formulas/evaluateFormula'
import type { CharacterState } from '../domain/types'
import type { RulesRegistry } from '../data/registry'

/**
 * PHB 2024 p.40/42: Level 1 HP = class Hit Die + Constitution modifier.
 * Each level after that adds the class's "Fixed Hit Points" average
 * (floor(die/2) + 1) + Constitution modifier, minimum 1 per level — digital
 * dice rolling is explicitly out of scope, so this app always uses the
 * fixed/average value the rules offer as the alternative to rolling.
 *
 * This is computed live from the character's CURRENT level and Constitution
 * score rather than stored incrementally, so a retroactive Constitution
 * change (e.g. from an Ability Score Improvement) is automatically reflected
 * across every level already attained — exactly the "Adjust Ability
 * Modifiers" rule on p.42 ("your Hit Point maximum increases by 1 for each
 * level you have attained"), without needing separate bookkeeping for it.
 */
export function getHitPointMaximum(character: CharacterState, registry: RulesRegistry): number {
  const cls = registry.classes[character.classId]
  if (!cls) return 0
  const conModifier = getAbilityModifier(character.abilityScores.Constitution)
  const levelOneHP = cls.hitDie + conModifier
  const perLevelAverage = Math.max(1, Math.floor(cls.hitDie / 2) + 1 + conModifier)
  return levelOneHP + (character.level - 1) * perLevelAverage
}

/**
 * Applies the Hit Point consequence of a level-up (and any ability score
 * change bundled into the same level-up) by diffing the fully-recomputed
 * max HP before and after — this single diff naturally covers both "gain a
 * new level's Hit Die" and "Constitution modifier changed retroactively"
 * without needing to model them as separate steps. Current HP increases by
 * the same amount as max HP, matching how gaining a level works in play.
 */
export function applyHitPointGain(previousCharacter: CharacterState, nextCharacter: CharacterState, registry: RulesRegistry): CharacterState {
  const previousMax = getHitPointMaximum(previousCharacter, registry)
  const newMax = getHitPointMaximum(nextCharacter, registry)
  const gained = newMax - previousMax
  return {
    ...nextCharacter,
    maxHP: newMax,
    currentHP: (nextCharacter.currentHP ?? previousMax) + gained,
  }
}
