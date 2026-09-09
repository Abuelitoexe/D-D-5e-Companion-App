import type { LeveledValue, NumberFormula } from './common'
import type { SourceRef } from './source'

export type RefreshRule = 'turn' | 'shortRest' | 'longRest' | 'manual'

/**
 * A pure use-counter (Rage uses, Second Wind, Sorcery Points, Focus Points,
 * Channel Divinity, ...). Resources with additional multi-turn state (Rage's
 * duration/extension) attach a DurationRule via durationRuleId rather than
 * growing this type — most resources never touch that field.
 */
export interface ResourceDefinition {
  id: string
  name: string
  minimumLevel: number
  maximum: NumberFormula
  /** Which rests recharge this resource. Uses LeveledValue because a few resources
   * (Bardic Inspiration) change their refresh rule at a later level. */
  refresh: LeveledValue<RefreshRule[]>
  /** Uses restored on a short rest before a long rest fully refills (e.g. Rage: 1 use per short rest). Absent = refresh grants full max. */
  partialRefresh?: Partial<Record<RefreshRule, NumberFormula>>
  durationRuleId?: string
  source: SourceRef
}

export interface CharacterResourceState {
  resourceId: string
  current: number
}

/**
 * Generic multi-turn duration/extension state machine. Rage is the only PHB
 * resource that needs this today, but it's deliberately not named "RageRule"
 * — any future stateful buff (from any source) reuses it without engine changes.
 */
export interface DurationRule {
  id: string
  activatesResourceId: string
  baseDuration: {
    unit: 'turn' | 'round' | 'minute'
    amount: number
    anchoredTo: 'endOfNextTurn' | 'start' | 'end'
  }
  extensionTriggers: string[] // e.g. "dealDamageWithWeaponOrSpell", "forceASavingThrow", "spendBonusActionOnFeature"
  extensionExtendsTo: 'endOfCurrentTurn' | 'endOfNextTurn'
  hardCap?: { unit: 'minute'; amount: number }
  endsOn?: string[] // e.g. "dropToZeroHP", "choosesToEnd", "noQualifyingActionOnTurn"
}

export interface ActiveEffectState {
  effectId: string
  resourceId: string
  startedAtTurn: number
  expiresAtTurn: number
  extensionCount: number
}

/**
 * Conditional damage/effect bonuses that are NOT a depletable resource —
 * Sneak Attack has no pool, only a once-per-turn eligibility check.
 */
export interface ConditionalModifierDefinition {
  id: string
  name: string
  source: SourceRef
  appliesTo: 'weaponAttack'
  requiresWeaponTags: ('finesse' | 'ranged')[]
  frequency: 'oncePerTurn' | 'unlimited'
  /** Number of dice, evaluated by amount/diceSize (e.g. Sneak Attack: amount=3, diceSize=6 -> "3d6"). */
  amount: NumberFormula
  diceSize: number
  damageType?: string
  tradeableFor?: { id: string; name: string; diceCost: number; effectSummary: string }[]
}
