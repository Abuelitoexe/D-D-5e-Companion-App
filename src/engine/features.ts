import type { CharacterState, ConditionalModifierDefinition, FeatDefinition, FeatureDefinition } from '../domain/types'
import type { RulesRegistry } from '../data/registry'

/** Every class, subclass, and species feature the character currently has,
 * gated by level. This is the foundation every other engine query builds on. */
export function getCharacterFeatures(character: CharacterState, registry: RulesRegistry): FeatureDefinition[] {
  const ids = new Set<string>()

  const cls = registry.classes[character.classId]
  if (cls) {
    for (let lvl = 1; lvl <= character.level; lvl++) {
      for (const id of cls.featuresByLevel[lvl] ?? []) ids.add(id)
    }
  }

  if (character.subclassId) {
    const sub = registry.subclasses[character.subclassId]
    if (sub && character.level >= sub.minimumLevel) {
      for (let lvl = sub.minimumLevel; lvl <= character.level; lvl++) {
        for (const id of sub.featuresByLevel[lvl] ?? []) ids.add(id)
      }
    }
  }

  const species = registry.species[character.speciesId]
  if (species) {
    for (const id of species.traitIds) ids.add(id)
  }

  const features: FeatureDefinition[] = []
  for (const id of ids) {
    const feature = registry.features[id]
    if (feature) features.push(feature)
  }
  return features
}

/** Every conditional (non-resource) damage/effect modifier the character's
 * active features grant — e.g. Sneak Attack, which has no pool to deplete,
 * only a once-per-turn eligibility check. Multiple features can point at
 * the same modifier id (Rogue's Cunning Strike and Devious Strikes both
 * extend the base Sneak Attack modifier), so this dedupes by id. */
export function getConditionalModifiersForCharacter(character: CharacterState, registry: RulesRegistry): ConditionalModifierDefinition[] {
  const ids = new Set<string>()
  for (const feature of getCharacterFeatures(character, registry)) {
    for (const id of feature.conditionalModifierIds ?? []) ids.add(id)
  }
  const modifiers: ConditionalModifierDefinition[] = []
  for (const id of ids) {
    const modifier = registry.conditionalModifiers[id]
    if (modifier) modifiers.push(modifier)
  }
  return modifiers
}

/** Every feat the character has — the background's originFeatId (always
 * granted automatically, never a choice) plus any feat id a resolved choice
 * selection points at (e.g. Human's Versatile trait, or a future ASI/Feat
 * slot picking a General feat). Deliberately not folded into
 * getCharacterFeatures: FeatDefinition and FeatureDefinition are different
 * shapes (passiveSummary vs. summary+activation), matching the domain
 * model's existing split between the two registries. */
export function getCharacterFeats(character: CharacterState, registry: RulesRegistry): FeatDefinition[] {
  const ids = new Set<string>()

  const background = registry.backgrounds[character.backgroundId]
  if (background) ids.add(background.originFeatId)

  for (const optionIds of Object.values(character.selections)) {
    for (const id of optionIds) {
      if (registry.feats[id]) ids.add(id)
    }
  }

  const feats: FeatDefinition[] = []
  for (const id of ids) {
    const feat = registry.feats[id]
    if (feat) feats.push(feat)
  }
  return feats
}

/** Resolves the label + repeatable/prerequisite info for a choice option id,
 * which may live in either registry.choiceOptions or registry.feats
 * (choices reuse feat records directly, e.g. Fighting Style). */
export function resolveChoiceOptionLabel(id: string, registry: RulesRegistry): string {
  return registry.choiceOptions[id]?.label ?? registry.feats[id]?.name ?? id
}

export function resolveChoiceOptionPrerequisites(id: string, registry: RulesRegistry) {
  return registry.choiceOptions[id]?.prerequisites ?? registry.feats[id]?.prerequisites ?? []
}
