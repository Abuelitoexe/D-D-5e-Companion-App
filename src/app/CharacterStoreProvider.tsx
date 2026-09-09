import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createLocalStorageAdapter } from '../storage/localStorageAdapter'
import type { CharacterState } from '../domain/types'

interface CharacterStoreValue {
  characters: CharacterState[]
  getCharacter: (id: string) => CharacterState | null
  saveCharacter: (character: CharacterState) => void
  removeCharacter: (id: string) => void
}

const CharacterStoreContext = createContext<CharacterStoreValue | null>(null)

/** Wraps the localStorage-backed CharacterStorage in React state so screens
 * re-render on save/remove. The underlying storage interface is swappable
 * (see storage/characterStorage.ts) without touching this provider's API. */
export function CharacterStoreProvider({ children }: { children: ReactNode }) {
  const storage = useMemo(() => createLocalStorageAdapter(), [])
  const [characters, setCharacters] = useState<CharacterState[]>(() => storage.list())

  const getCharacter = useCallback((id: string) => storage.get(id), [storage])

  const saveCharacter = useCallback(
    (character: CharacterState) => {
      storage.save(character)
      setCharacters(storage.list())
    },
    [storage],
  )

  const removeCharacter = useCallback(
    (id: string) => {
      storage.remove(id)
      setCharacters(storage.list())
    },
    [storage],
  )

  const value = useMemo(() => ({ characters, getCharacter, saveCharacter, removeCharacter }), [characters, getCharacter, saveCharacter, removeCharacter])

  return <CharacterStoreContext.Provider value={value}>{children}</CharacterStoreContext.Provider>
}

export function useCharacterStore(): CharacterStoreValue {
  const store = useContext(CharacterStoreContext)
  if (!store) throw new Error('useCharacterStore must be used within a CharacterStoreProvider')
  return store
}
