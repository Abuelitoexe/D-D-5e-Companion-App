import { useNavigate } from 'react-router-dom'
import { useCharacterSession } from '../app/CharacterSessionContext'
import { useCharacterStore } from '../app/CharacterStoreProvider'
import { getCharacterFeats, getExhaustionD20Penalty, getExhaustionLevel, getExhaustionSpeedReduction, getHitPointMaximum, setExhaustionLevel } from '../engine'
import { getAbilityModifier } from '../domain/formulas/evaluateFormula'

export function CharacterScreen() {
  const { character, registry, updateCharacter } = useCharacterSession()
  const { removeCharacter } = useCharacterStore()
  const navigate = useNavigate()

  const cls = registry.classes[character.classId]
  const subclass = character.subclassId ? registry.subclasses[character.subclassId] : undefined
  const species = registry.species[character.speciesId]
  const background = registry.backgrounds[character.backgroundId]

  const maxHP = getHitPointMaximum(character, registry)
  const currentHP = character.currentHP ?? maxHP
  const feats = getCharacterFeats(character, registry)
  const guidance = registry.guidance[character.classId]

  function adjustHP(delta: number) {
    const next = Math.max(0, Math.min(maxHP, currentHP + delta))
    updateCharacter({ ...character, currentHP: next, maxHP, updatedAt: new Date().toISOString() })
  }

  const exhaustionLevel = getExhaustionLevel(character)

  function adjustExhaustion(delta: number) {
    updateCharacter(setExhaustionLevel(character, exhaustionLevel + delta))
  }

  function setAbilityScore(ability: string, value: number) {
    const clamped = Math.max(1, Math.min(30, value))
    updateCharacter({
      ...character,
      abilityScores: { ...character.abilityScores, [ability]: clamped },
      updatedAt: new Date().toISOString(),
    })
  }

  function handleDelete() {
    removeCharacter(character.id)
    navigate('/')
  }

  return (
    <div>
      <section className="rounded-md border border-border bg-surface p-3">
        <h2 className="text-sm font-semibold text-text-primary">Identity</h2>
        <dl className="mt-2 grid grid-cols-2 gap-y-1 text-xs">
          <dt className="text-text-secondary">Name</dt><dd className="text-text-primary">{character.name}</dd>
          <dt className="text-text-secondary">Class</dt><dd className="text-text-primary">{cls?.name}{subclass ? ` (${subclass.name})` : ''}</dd>
          <dt className="text-text-secondary">Level</dt><dd className="text-text-primary">{character.level}</dd>
          <dt className="text-text-secondary">Species</dt><dd className="text-text-primary">{species?.name}</dd>
          <dt className="text-text-secondary">Background</dt><dd className="text-text-primary">{background?.name}</dd>
        </dl>
      </section>

      {guidance && (
        <section className="mt-3 rounded-md border border-border bg-surface p-3">
          <h2 className="text-sm font-semibold text-text-primary">How This Class Plays</h2>
          <p className="mt-2 text-xs text-text-secondary">{guidance.classIdentity}</p>
          <p className="mt-2 text-xs font-medium text-text-primary">Good fit for</p>
          <p className="mt-0.5 text-xs text-text-secondary">{guidance.goodFitFor}</p>
          <p className="mt-2 text-xs font-medium text-text-primary">Things to watch</p>
          <ul className="mt-0.5 list-inside list-disc text-xs text-text-secondary">
            {guidance.thingsToWatch.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] text-text-secondary">
            Playstyle guidance from a pre-2024 source — flavor and identity only, not mechanics. {guidance.source.sourceLabel}
          </p>
        </section>
      )}

      <section className="mt-3 rounded-md border border-border bg-surface p-3">
        <h2 className="text-sm font-semibold text-text-primary">Hit Points</h2>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-2">
            <button type="button" onClick={() => adjustHP(-1)} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-primary">−</button>
            <button type="button" onClick={() => adjustHP(1)} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-primary">+</button>
          </div>
          <span className="text-sm font-medium text-text-primary">{currentHP} / {maxHP}</span>
        </div>
      </section>

      <section className="mt-3 rounded-md border border-border bg-surface p-3">
        <h2 className="text-sm font-semibold text-text-primary">Exhaustion</h2>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-2">
            <button type="button" onClick={() => adjustExhaustion(-1)} disabled={exhaustionLevel <= 0} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-primary disabled:opacity-40">−</button>
            <button type="button" onClick={() => adjustExhaustion(1)} disabled={exhaustionLevel >= 6} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-primary disabled:opacity-40">+</button>
          </div>
          <span className="text-sm font-medium text-text-primary">{exhaustionLevel} / 6</span>
        </div>
        {exhaustionLevel > 0 && (
          <p className="mt-2 text-xs text-text-secondary">
            −{getExhaustionD20Penalty(character)} to every D20 Test, Speed reduced by {getExhaustionSpeedReduction(character)} feet.
            {exhaustionLevel >= 6 && ' Level 6 is lethal.'}
          </p>
        )}
        <p className="mt-1 text-xs text-text-secondary">Finishing a Long Rest removes 1 level automatically.</p>
      </section>

      <section className="mt-3 rounded-md border border-border bg-surface p-3">
        <h2 className="text-sm font-semibold text-text-primary">Ability Scores</h2>
        <p className="mt-0.5 text-xs text-text-secondary">Directly editable — useful for correcting an Ability Score Improvement or applying a magic item bonus.</p>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-6">
          {Object.entries(character.abilityScores).map(([ability, score]) => {
            const modifier = getAbilityModifier(score)
            return (
              <div key={ability}>
                <div className="text-text-secondary">{ability.slice(0, 3).toUpperCase()}</div>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setAbilityScore(ability, Number(e.target.value))}
                  min={1}
                  max={30}
                  className="mt-0.5 w-full rounded-md border border-border bg-page px-1 py-1 text-center text-sm font-medium text-text-primary"
                />
                <div className="mt-0.5 text-text-secondary">{modifier >= 0 ? '+' : ''}{modifier}</div>
              </div>
            )
          })}
        </div>
      </section>

      {feats.length > 0 && (
        <section className="mt-3 rounded-md border border-border bg-surface p-3">
          <h2 className="text-sm font-semibold text-text-primary">Feats</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs">
            {feats.map((feat) => (
              <li key={feat.id}>
                <span className="font-medium text-text-primary">{feat.name}</span>
                {feat.passiveSummary && <span className="block text-text-secondary">{feat.passiveSummary}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-3 rounded-md border border-border bg-surface p-3">
        <h2 className="text-sm font-semibold text-text-primary">Sources</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {character.enabledSourceIds.map((id) => (
            <span key={id} className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-secondary">{id}</span>
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-md border border-border bg-surface p-3">
        <h2 className="text-sm font-semibold text-text-primary">Equipment</h2>
        <ul className="mt-2 flex flex-col gap-0.5 text-xs text-text-primary">
          {character.equipmentIds.map((id) => (
            <li key={id}>{registry.weapons[id]?.name ?? registry.armor[id]?.name ?? id}</li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={handleDelete}
        className="mt-6 w-full rounded-md border border-danger px-4 py-2 text-sm font-medium text-danger"
      >
        Delete Character
      </button>
    </div>
  )
}
