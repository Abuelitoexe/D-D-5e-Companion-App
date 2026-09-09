import { Link } from 'react-router-dom'
import { useCharacterStore } from '../app/CharacterStoreProvider'
import { useRules } from '../app/RulesProvider'

export function CharacterSelectScreen() {
  const { characters, removeCharacter } = useCharacterStore()
  const registry = useRules()

  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto max-w-[960px] px-4 py-6">
        <h1 className="text-xl font-semibold text-text-primary">Your Characters</h1>

        {characters.length === 0 ? (
          <p className="mt-2 text-sm text-text-secondary">No characters yet. Create one to get started.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {characters.map((character) => {
              const cls = registry.classes[character.classId]
              const subclass = character.subclassId ? registry.subclasses[character.subclassId] : undefined
              return (
                <li key={character.id} className="flex items-center justify-between rounded-md border border-border bg-surface p-3">
                  <Link to={`/character/${character.id}/play`} className="flex-1">
                    <span className="block font-medium text-text-primary">{character.name}</span>
                    <span className="block text-xs text-text-secondary">
                      Level {character.level} {cls?.name}
                      {subclass ? ` (${subclass.name})` : ''}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeCharacter(character.id)}
                    className="ml-3 rounded-md border border-border px-2 py-1 text-xs text-danger"
                  >
                    Delete
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <Link
          to="/character/new/setup"
          className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          Create Character
        </Link>
      </div>
    </div>
  )
}
