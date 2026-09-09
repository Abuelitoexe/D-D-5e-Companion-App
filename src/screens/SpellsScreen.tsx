import { useState } from 'react'
import { useCharacterSession } from '../app/CharacterSessionContext'
import { getSpellcastingState } from '../engine'

export function SpellsScreen() {
  const { character, registry, updateCharacter } = useCharacterSession()
  const [managingPrepared, setManagingPrepared] = useState(false)

  const state = getSpellcastingState(character, registry)
  if (!state) return <p className="text-sm text-text-secondary">Not a spellcaster.</p>

  const cantrips = state.cantripsKnown.map((id) => registry.spells[id]).filter(Boolean)
  const prepared = state.preparedSpellIds.map((id) => registry.spells[id]).filter(Boolean)
  const spellbook = state.spellbookSpellIds.map((id) => registry.spells[id]).filter(Boolean)

  function togglePrepared(spellId: string) {
    const isPrepared = character.preparedSpellIds.includes(spellId)
    if (!isPrepared && character.preparedSpellIds.length >= state!.preparedMax) return
    const preparedSpellIds = isPrepared
      ? character.preparedSpellIds.filter((id) => id !== spellId)
      : [...character.preparedSpellIds, spellId]
    updateCharacter({ ...character, preparedSpellIds, updatedAt: new Date().toISOString() })
  }

  return (
    <div>
      {state.slots.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-text-primary">Spell Slots</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {state.slots.map((slot) => (
              <div key={slot.level} className="rounded-md border border-border bg-surface px-3 py-2 text-center text-xs">
                <div className="text-text-secondary">Level {slot.level}</div>
                <div className="font-medium text-text-primary">{slot.current} / {slot.max}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-4">
        <h2 className="text-sm font-semibold text-text-primary">Cantrips ({cantrips.length}/{state.cantripsMax})</h2>
        <div className="mt-2 flex flex-col gap-1.5">
          {cantrips.map((spell) => (
            <div key={spell!.id} className="rounded-md border border-border bg-surface p-2.5 text-sm">
              <span className="font-medium text-text-primary">{spell!.name}</span>
              <span className="ml-2 text-xs text-text-secondary">{spell!.castingTime}</span>
              <p className="mt-0.5 text-xs text-text-secondary">{spell!.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Prepared Spells ({prepared.length}/{state.preparedMax})</h2>
          <button type="button" onClick={() => setManagingPrepared((v) => !v)} className="rounded-md border border-border px-2 py-1 text-xs font-medium text-text-primary">
            {managingPrepared ? 'Done' : 'Manage'}
          </button>
        </div>
        <p className="mt-1 text-xs text-text-secondary">Changeable any time you finish a Long Rest.</p>
        <div className="mt-2 flex flex-col gap-1.5">
          {(managingPrepared ? spellbook : prepared).map((spell) => (
            <label key={spell!.id} className="flex items-start gap-2 rounded-md border border-border bg-surface p-2.5 text-sm">
              {managingPrepared && (
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={character.preparedSpellIds.includes(spell!.id)}
                  disabled={!character.preparedSpellIds.includes(spell!.id) && character.preparedSpellIds.length >= state.preparedMax}
                  onChange={() => togglePrepared(spell!.id)}
                />
              )}
              <span>
                <span className="font-medium text-text-primary">{spell!.name}</span>
                <span className="ml-2 text-xs text-text-secondary">
                  Level {spell!.level} · {spell!.castingTime}
                  {spell!.concentration ? ' · Concentration' : ''}
                  {spell!.ritual ? ' · Ritual' : ''}
                </span>
                <p className="mt-0.5 text-xs text-text-secondary">{spell!.summary}</p>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <h2 className="text-sm font-semibold text-text-primary">Spellbook ({spellbook.length}/{state.spellbookMax})</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {spellbook.map((spell) => (
            <span key={spell!.id} className="rounded border border-border px-2 py-1 text-xs text-text-primary">{spell!.name}</span>
          ))}
        </div>
      </section>
    </div>
  )
}
