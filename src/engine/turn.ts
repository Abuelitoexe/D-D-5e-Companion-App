import type { TurnState } from '../domain/types'

export function createInitialTurnState(): TurnState {
  return { actionUsed: false, bonusActionUsed: false, reactionUsed: false, movementUsed: 0, onceThisTurnFlags: [], turnNumber: 1 }
}

/** Resets Action/Bonus Action/Reaction/movement and once-per-turn flags. */
export function startNewTurn(turn: TurnState): TurnState {
  return { ...createInitialTurnState(), turnNumber: turn.turnNumber + 1 }
}

export const markActionUsed = (turn: TurnState): TurnState => ({ ...turn, actionUsed: true })
export const markBonusActionUsed = (turn: TurnState): TurnState => ({ ...turn, bonusActionUsed: true })
export const markReactionUsed = (turn: TurnState): TurnState => ({ ...turn, reactionUsed: true })
