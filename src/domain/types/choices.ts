import type { AbilityName, NumberFormula } from './common'
import type { SourceRef } from './source'

export type SelectionTiming =
  | 'characterCreation'
  | 'onLevelUp'
  | 'onLongRest'
  | 'onShortRest'
  | 'manual'

export type Prerequisite =
  | { kind: 'minimumLevel'; level: number }
  | { kind: 'hasFeature'; featureId: string }
  /** Cross-choice dependency — e.g. a Tome-tagged invocation requiring Pact of the Tome. */
  | { kind: 'hasSelectedOption'; optionId: string }
  | { kind: 'abilityScoreAtLeast'; ability: AbilityName; score: number }

export interface ChoiceOptionDefinition {
  id: string
  label: string
  source: SourceRef
  prerequisites?: Prerequisite[]
  /** A few options (some Metamagic/Invocations) can be selected more than once. */
  repeatable?: boolean
}

export interface ReplacementPolicy {
  timing: SelectionTiming
  maxReplacements: number | 'unlimited'
}

/**
 * The single reusable selection system behind every choice in the game —
 * Fighting Style, Weapon Mastery, Expertise, Metamagic, Eldritch Invocations,
 * Subclass, Feat/ASI, spell/cantrip choices, Divine Order, etc. Differences
 * between all of those are DATA (counts, timing, replacement policy), never
 * separate engine logic.
 */
export interface ChoiceDefinition {
  id: string
  label: string
  mode: 'single' | 'multiple'
  minimumSelections: NumberFormula
  maximumSelections: NumberFormula
  required: boolean
  timing: SelectionTiming[]
  optionIds: string[]
  /** Omitted entirely = never replaceable (e.g. Cleric's Divine Order) — the
   * engine must not assume every choice is swappable. */
  replacementPolicies?: ReplacementPolicy[]
  prerequisites?: Prerequisite[]
  source: SourceRef
}
