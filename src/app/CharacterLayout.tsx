import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { CharacterSessionProvider, useCharacterSession } from './CharacterSessionContext'
import { getHitPointMaximum } from '../engine'

function CharacterHeader() {
  const { character, registry } = useCharacterSession()
  const cls = registry.classes[character.classId]
  const subclass = character.subclassId ? registry.subclasses[character.subclassId] : undefined
  const species = registry.species[character.speciesId]
  const background = registry.backgrounds[character.backgroundId]
  const maxHP = getHitPointMaximum(character, registry)
  const currentHP = character.currentHP ?? maxHP

  return (
    <div className="mb-3 rounded-md border border-border bg-surface p-3">
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-text-primary">{character.name}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-text-secondary">HP {currentHP}/{maxHP}</span>
          <span className="text-xs text-text-secondary">Level {character.level}</span>
        </div>
      </div>
      <span className="block text-xs text-text-secondary">
        {cls?.name}{subclass ? ` (${subclass.name})` : ''} · {species?.name} · {background?.name}
      </span>
    </div>
  )
}

export function CharacterLayout() {
  return (
    <div className="min-h-screen bg-page pb-16">
      <div className="mx-auto max-w-[960px] px-4 py-4">
        <CharacterSessionProvider>
          <CharacterHeader />
          <Outlet />
        </CharacterSessionProvider>
      </div>
      <BottomNav />
    </div>
  )
}
