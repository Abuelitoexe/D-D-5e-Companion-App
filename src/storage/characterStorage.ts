import type { CharacterState } from '../domain/types'

/**
 * The only surface the app talks to for persistence. localStorage is the v1
 * implementation; swapping in a REST/DB-backed adapter behind a future login
 * requires no changes to screens or the rule engine — they only ever see
 * this interface.
 */
export interface CharacterStorage {
  list(): CharacterState[]
  get(id: string): CharacterState | null
  save(character: CharacterState): void
  remove(id: string): void
}
