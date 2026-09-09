import { beforeEach, describe, expect, it } from 'vitest'
import { createLocalStorageAdapter } from '../storage/localStorageAdapter'
import type { CharacterState } from '../domain/types'

function fakeCharacter(overrides: Partial<CharacterState> = {}): CharacterState {
  return {
    id: 'char-1',
    name: 'Test Character',
    level: 1,
    classId: 'test-phb-class',
    backgroundId: 'test-background',
    speciesId: 'test-species',
    enabledSourceIds: ['PHB2024'],
    abilityScores: { Strength: 10, Dexterity: 10, Constitution: 10, Intelligence: 10, Wisdom: 10, Charisma: 10 },
    selections: {},
    preparedSpellIds: [],
    resourceState: [],
    activeEffects: [],
    equipmentIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('localStorageAdapter', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('saves and retrieves a character by id', () => {
    const storage = createLocalStorageAdapter()
    storage.save(fakeCharacter())
    expect(storage.get('char-1')?.name).toBe('Test Character')
  })

  it('returns null for an unknown id instead of throwing', () => {
    const storage = createLocalStorageAdapter()
    expect(storage.get('does-not-exist')).toBeNull()
  })

  it('lists saved characters, most recently updated first', () => {
    const storage = createLocalStorageAdapter()
    storage.save(fakeCharacter({ id: 'char-1', updatedAt: '2026-01-01T00:00:00.000Z' }))
    storage.save(fakeCharacter({ id: 'char-2', updatedAt: '2026-01-02T00:00:00.000Z' }))
    expect(storage.list().map((c) => c.id)).toEqual(['char-2', 'char-1'])
  })

  it('removes a character', () => {
    const storage = createLocalStorageAdapter()
    storage.save(fakeCharacter())
    storage.remove('char-1')
    expect(storage.get('char-1')).toBeNull()
  })

  it('tolerates corrupt localStorage content instead of crashing', () => {
    window.localStorage.setItem('dnd-companion:characters', '{not valid json')
    const storage = createLocalStorageAdapter()
    expect(storage.list()).toEqual([])
  })
})
