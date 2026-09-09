import type { AbilityName, ActivationType, NumberFormula } from './common'
import type { Prerequisite } from './choices'
import type { SpellcastingDefinition } from './spellcasting'
import type { SourceRef } from './source'

export interface ClassDefinition {
  id: string
  name: string
  source: SourceRef
  primaryAbilities: AbilityName[]
  hitDie: number
  subclassLevel: number
  /** The canonical map of what a class gains at each level — every other
   * "what happens at level N" question (ASI levels, subclass unlock, etc.)
   * is derived by scanning this, never hardcoded. */
  featuresByLevel: Record<number, string[]>
  resources?: string[]
  spellcasting?: SpellcastingDefinition
  choiceIds?: string[]
}

export interface SubclassDefinition {
  id: string
  name: string
  parentClassId: string
  minimumLevel: number
  source: SourceRef
  featuresByLevel: Record<number, string[]>
  /** For subclasses that grant their own spellcasting (e.g. Eldritch Knight,
   * Arcane Trickster) rather than inheriting the parent class's. */
  spellcasting?: SpellcastingDefinition
  resources?: string[]
  choiceIds?: string[]
}

export interface FeatureDefinition {
  id: string
  name: string
  source: SourceRef
  minimumLevel?: number
  activation: ActivationType
  summary: string
  prerequisites?: Prerequisite[]
  resourceId?: string
  conditionalModifierIds?: string[]
  choices?: string[]
  grantsActionIds?: string[]
  /** References to rules this feature overrides (specific-beats-general, per
   * PHB Ch.1 "Exceptions Supersede General Rules"). */
  modifiesRuleIds?: string[]
  scaling?: NumberFormula
}

export interface BackgroundDefinition {
  id: string
  name: string
  source: SourceRef
  abilityScoreOptions: AbilityName[]
  originFeatId: string
  skillProficiencies: string[]
  toolProficiency: string
  equipmentChoiceIds: string[]
}

export interface SpeciesDefinition {
  id: string
  name: string
  source: SourceRef
  creatureType: string
  sizeOptions: string[]
  speed: number
  traitIds: string[]
}

export interface FeatDefinition {
  id: string
  name: string
  source: SourceRef
  category: 'origin' | 'general' | 'fightingStyle' | 'epicBoon'
  prerequisites?: Prerequisite[]
  grantsChoiceIds?: string[]
  passiveSummary?: string
  /** Some feats (e.g. Ability Score Improvement) can be selected more than once. */
  repeatable?: boolean
}

/** The static PHB general action list (Attack, Dash, Disengage, ...) — data,
 * not a hardcoded list inside the engine, so a future source could add to it. */
export interface GeneralActionDefinition {
  id: string
  name: string
  activation: ActivationType
  summary: string
  source: SourceRef
}

/** Beginner-friendly, non-mechanical guidance. Deliberately a separate
 * registry from ClassDefinition — never consulted by the rule engine. */
export interface ClassGuidance {
  classId: string
  classIdentity: string
  thingsToWatch: string[]
  goodFitFor: string
  source: SourceRef
  mechanicsVerifiedFor2024: boolean
}
