import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import type { CharacterState } from '../domain/types'
import type { RulesRegistry } from '../data/registry'
import { buildFormulaContext } from './context'
import { getUnresolvedChoices } from './choices'
import { getResourceDefinitionsForCharacter, getResourceMaximum } from './resources'
import { getSpellDeficits } from './spells'
import { getHitPointMaximum } from './hitPoints'

export type LevelUpChangeType = 'gain' | 'choose' | 'chooseMultiple' | 'subclassUnlock'

export interface LevelUpChange {
  type: LevelUpChangeType
  label: string
  detail?: string
  featureId?: string
  choiceId?: string
}

export interface ResourceChange {
  resourceId: string
  name: string
  oldMax: number
  newMax: number
}

export interface LevelUpPreview {
  fromLevel: number
  toLevel: number
  gains: LevelUpChange[]
  requiredChoices: LevelUpChange[]
  resourceChanges: ResourceChange[]
}

function collectFeatureGains(
  registry: RulesRegistry,
  featuresByLevel: Record<number, string[]>,
  fromLevel: number,
  toLevel: number,
  gains: LevelUpChange[],
  requiredChoices: LevelUpChange[],
) {
  for (let lvl = Math.max(fromLevel, 1); lvl <= toLevel; lvl++) {
    for (const featureId of featuresByLevel[lvl] ?? []) {
      const feature = registry.features[featureId]
      if (!feature) continue
      gains.push({ type: 'gain', featureId, label: feature.name, detail: feature.summary })
      for (const choiceId of feature.choices ?? []) {
        const choice = registry.choices[choiceId]
        if (choice?.required) {
          requiredChoices.push({
            type: choice.mode === 'multiple' ? 'chooseMultiple' : 'choose',
            choiceId,
            label: choice.label,
          })
        }
      }
    }
  }
}

/** Previews what changes between the character's current level and a target
 * level, without mutating anything — safe to call for a future-level preview
 * (View Class Progression) as well as an actual pending Level Up. */
export function getLevelUpPreview(character: CharacterState, targetLevel: number, registry: RulesRegistry): LevelUpPreview {
  const gains: LevelUpChange[] = []
  const requiredChoices: LevelUpChange[] = []

  const cls = registry.classes[character.classId]
  if (cls) {
    collectFeatureGains(registry, cls.featuresByLevel, character.level + 1, targetLevel, gains, requiredChoices)
    if (targetLevel >= cls.subclassLevel && character.level < cls.subclassLevel) {
      requiredChoices.push({ type: 'subclassUnlock', label: `Choose a ${cls.name} subclass` })
    }
  }

  if (character.subclassId) {
    const sub = registry.subclasses[character.subclassId]
    if (sub) {
      collectFeatureGains(registry, sub.featuresByLevel, Math.max(character.level + 1, sub.minimumLevel), targetLevel, gains, requiredChoices)
    }
  }

  const futureCharacter = { ...character, level: targetLevel }
  const resourceChanges: ResourceChange[] = []

  // Hit Point maximum (PHB p.42, "Adjust Hit Points and Hit Point Dice") —
  // shown here using the character's current ability scores; if this
  // level-up also includes an Ability Score Improvement to Constitution,
  // the actual applied gain (computed on completion) will be larger.
  const oldHP = getHitPointMaximum(character, registry)
  const newHP = getHitPointMaximum(futureCharacter, registry)
  if (oldHP !== newHP) resourceChanges.push({ resourceId: 'hp', name: 'Hit Point Maximum', oldMax: oldHP, newMax: newHP })

  for (const def of getResourceDefinitionsForCharacter(futureCharacter, registry)) {
    const oldMax = character.level >= def.minimumLevel ? getResourceMaximum(def, character) : 0
    const newMax = getResourceMaximum(def, futureCharacter)
    if (oldMax !== newMax) resourceChanges.push({ resourceId: def.id, name: def.name, oldMax, newMax })
  }

  // Existing choices whose maximumSelections grows within this level range
  // (e.g. Weapon Mastery 3->4, Eldritch Invocations known+1) also need
  // resolving, even though they aren't a "new" choice.
  for (const choiceId of new Set([...Object.keys(character.selections), ...requiredChoices.map((c) => c.choiceId).filter((id): id is string => !!id)])) {
    const choice = registry.choices[choiceId]
    if (!choice?.required) continue
    if (requiredChoices.some((c) => c.choiceId === choiceId)) continue // already added via feature gain
    const oldMin = evaluateFormula(choice.minimumSelections, buildFormulaContext(character))
    const newMin = evaluateFormula(choice.minimumSelections, buildFormulaContext(futureCharacter))
    if (newMin > oldMin) {
      requiredChoices.push({ type: choice.mode === 'multiple' ? 'chooseMultiple' : 'choose', choiceId, label: choice.label })
    }
  }

  return { fromLevel: character.level, toLevel: targetLevel, gains, requiredChoices, resourceChanges }
}

/** Applies a level change in one transaction — bumps level and lets resource
 * maxima recompute lazily (they're always derived from character.level, never
 * stored). Only called once every required choice for the target level is
 * resolved; the caller is responsible for checking getUnresolvedChoices first. */
export function applyLevelUp(character: CharacterState, targetLevel: number): CharacterState {
  return { ...character, level: targetLevel, updatedAt: new Date().toISOString() }
}

/** True once every choice required at or before targetLevel (by 'onLevelUp'
 * timing) has enough selections AND a subclass is set if targetLevel reaches
 * the class's subclassLevel — the gate the Level Up screen uses to
 * enable/disable Complete Level Up. */
export function canCompleteLevelUp(character: CharacterState, targetLevel: number, registry: RulesRegistry): boolean {
  const futureCharacter = { ...character, level: targetLevel }
  if (getUnresolvedChoices(futureCharacter, registry, 'onLevelUp').length > 0) return false

  const cls = registry.classes[character.classId]
  if (cls && targetLevel >= cls.subclassLevel && !character.subclassId) return false

  const deficits = getSpellDeficits(futureCharacter, registry)
  if (deficits.cantrips > 0 || deficits.spellbook > 0 || deficits.prepared > 0) return false

  return true
}
