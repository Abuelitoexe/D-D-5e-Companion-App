import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { useCharacterStore } from './CharacterStoreProvider'
import { useRules } from './RulesProvider'
import { applyLongRest, applyShortRest, createInitialTurnState, markActionUsed, markBonusActionUsed, markReactionUsed, spendResourceUse, spendSpellSlot, startNewTurn } from '../engine'
import type { CharacterState, TurnState } from '../domain/types'
import type { RulesRegistry } from '../data/registry'

interface CharacterSessionValue {
  character: CharacterState
  registry: RulesRegistry
  turn: TurnState
  updateCharacter: (next: CharacterState) => void
  activateFeature: (featureId: string, resourceId: string | undefined, slot: 'action' | 'bonusAction' | 'reaction' | 'special') => void
  castSpell: (spellLevel: number, slot: 'action' | 'bonusAction' | 'reaction' | 'special') => void
  newTurn: () => void
  shortRest: () => void
  longRest: () => void
}

const CharacterSessionContext = createContext<CharacterSessionValue | null>(null)

export function CharacterSessionProvider({ children }: { children: ReactNode }) {
  const { characterId } = useParams<{ characterId: string }>()
  const { getCharacter, saveCharacter } = useCharacterStore()
  const registry = useRules()
  const [turn, setTurn] = useState<TurnState>(createInitialTurnState())

  const character = characterId ? getCharacter(characterId) : null

  const value = useMemo<CharacterSessionValue | null>(() => {
    if (!character) return null
    const updateCharacter = (next: CharacterState) => saveCharacter(next)

    return {
      character,
      registry,
      turn,
      updateCharacter,
      activateFeature: (featureId, resourceId, slot) => {
        let next = character
        if (resourceId) next = spendResourceUse(next, registry, resourceId)
        if (next !== character) updateCharacter(next)
        let nextTurn = { ...turn, onceThisTurnFlags: [...turn.onceThisTurnFlags, featureId] }
        if (slot === 'action') nextTurn = markActionUsed(nextTurn)
        if (slot === 'bonusAction') nextTurn = markBonusActionUsed(nextTurn)
        if (slot === 'reaction') nextTurn = markReactionUsed(nextTurn)
        // 'special' (e.g. Action Surge) doesn't consume a normal turn slot.
        setTurn(nextTurn)
      },
      castSpell: (spellLevel, slot) => {
        // Cantrips (level 0) don't expend a slot.
        const next = spellLevel > 0 ? spendSpellSlot(character, registry, spellLevel) : character
        if (next !== character) updateCharacter(next)
        let nextTurn = turn
        if (slot === 'action') nextTurn = markActionUsed(nextTurn)
        if (slot === 'bonusAction') nextTurn = markBonusActionUsed(nextTurn)
        if (slot === 'reaction') nextTurn = markReactionUsed(nextTurn)
        setTurn(nextTurn)
      },
      newTurn: () => setTurn(startNewTurn(turn)),
      shortRest: () => updateCharacter(applyShortRest(character, registry)),
      longRest: () => updateCharacter(applyLongRest(character, registry)),
    }
  }, [character, registry, turn, saveCharacter])

  if (!value) {
    return <div className="p-4 text-sm text-text-secondary">Character not found.</div>
  }

  return <CharacterSessionContext.Provider value={value}>{children}</CharacterSessionContext.Provider>
}

export function useCharacterSession(): CharacterSessionValue {
  const session = useContext(CharacterSessionContext)
  if (!session) throw new Error('useCharacterSession must be used within a CharacterSessionProvider')
  return session
}
