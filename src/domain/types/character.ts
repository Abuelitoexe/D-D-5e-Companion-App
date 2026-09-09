import type { AbilityName } from './common'
import type { ActiveEffectState, CharacterResourceState } from './resources'
import type { SourceId } from './source'

export interface CharacterState {
  id: string
  name: string
  level: number
  classId: string
  subclassId?: string
  backgroundId: string
  speciesId: string
  enabledSourceIds: SourceId[]
  abilityScores: Record<AbilityName, number>
  currentHP?: number
  maxHP?: number
  armorClass?: number
  speed?: number
  /** 0-6, cumulative; PHB 2024 Appendix C "Exhaustion [Condition]". Absent/0
   * means no Exhaustion. Reduced by 1 on finishing a Long Rest. */
  exhaustionLevel?: number
  /** choiceId -> selected optionIds */
  selections: Record<string, string[]>
  preparedSpellIds: string[]
  spellbookSpellIds?: string[]
  resourceState: CharacterResourceState[]
  activeEffects: ActiveEffectState[]
  equipmentIds: string[]
  createdAt: string
  updatedAt: string
}

export interface TurnState {
  actionUsed: boolean
  bonusActionUsed: boolean
  reactionUsed: boolean
  movementUsed: number
  onceThisTurnFlags: string[]
  /** Turn counter used by ActiveEffectState.expiresAtTurn bookkeeping. */
  turnNumber: number
}
