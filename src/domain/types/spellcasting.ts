import type { AbilityName, NumberFormula } from './common'
import type { SelectionTiming } from './choices'
import type { SourceRef } from './source'

/** How a class's "spells it could ever prepare" pool is built. */
export type PreparedSource = 'spellbook' | 'classListFull' | 'knownList'

/** When/how many prepared spells can be swapped. */
export interface SwapPolicy {
  timing: SelectionTiming[]
  count: 'all' | number
}

export interface SpellSlotRow {
  [spellLevel: number]: number
}

/**
 * Two orthogonal axes (preparedSource x swapPolicy) reproduce all five PHB
 * spellcasting shapes without a five-way class-name switch:
 *  - Wizard:   spellbook / swap all on long rest
 *  - Cleric:   classListFull / swap all on long rest
 *  - Bard/Sorcerer: knownList / swap 1 on level-up
 *  - Warlock:  knownList / swap 1 on level-up, plus pact slot mechanics
 */
export interface SpellcastingDefinition {
  ability: AbilityName
  slotProgression: 'full' | 'half' | 'pact' | 'custom'
  cantripProgression?: Record<number, number>
  preparedSource: PreparedSource
  preparedCountFormula?: NumberFormula
  /** For preparedSource: 'spellbook' — how many total spells the spellbook
   * holds by a given level (e.g. Wizard: 6 at level 1, +2/level after). */
  spellbookGrowthFormula?: NumberFormula
  swapPolicy: SwapPolicy
  /** Absent when slotProgression === 'pact'. */
  slotTable?: Record<number, SpellSlotRow>
  /** Warlock only: all slots are always at one level. */
  pactSlotTable?: Record<number, { slots: number; slotLevel: number }>
  /** Warlock only: prepared spells capped by current pact slot level. */
  maxPreparableSlotLevel?: NumberFormula
  ritualCasting?: { fromSpellbookOnly: boolean; requiresPreparation: boolean }
  /** Subclass domain-spell-style bonus spells. Excluded from the countable/swappable pool. */
  alwaysPreparedGrants?: { grantedByFeatureId: string; spellIds: string[] }[]
  spellListId: string
  source: SourceRef
}

export interface SpellDefinition {
  id: string
  name: string
  level: number
  school: string
  castingTime: string
  range: string
  duration: string
  concentration: boolean
  ritual: boolean
  components: string
  attackOrSave?: string
  summary: string
  source: SourceRef
  classes: string[]
}
