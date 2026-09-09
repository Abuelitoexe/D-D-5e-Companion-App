import type { CharacterState } from '../domain/types'
import type { CharacterStorage } from './characterStorage'

const STORAGE_KEY = 'dnd-companion:characters'

function readAll(): Record<string, CharacterState> {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, CharacterState>
  } catch {
    // Corrupt/foreign data under our key — treat as empty rather than throwing,
    // so a bad localStorage value can never hard-crash the app on load.
    return {}
  }
}

function writeAll(characters: Record<string, CharacterState>): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
}

export function createLocalStorageAdapter(): CharacterStorage {
  return {
    list() {
      return Object.values(readAll()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
    get(id) {
      return readAll()[id] ?? null
    },
    save(character) {
      const all = readAll()
      all[character.id] = character
      writeAll(all)
    },
    remove(id) {
      const all = readAll()
      delete all[id]
      writeAll(all)
    },
  }
}
