import { useCharacterSession } from '../app/CharacterSessionContext'
import { getCharacterFeatures, getResourceState, getUnresolvedChoices } from '../engine'

export function AbilitiesScreen() {
  const { character, registry } = useCharacterSession()

  const resources = getResourceState(character, registry)
  const features = getCharacterFeatures(character, registry)
  const unresolved = getUnresolvedChoices(character, registry)

  const activeFeatures = features.filter((f) => f.activation !== 'passive')
  const passiveFeatures = features.filter((f) => f.activation === 'passive')

  return (
    <div>
      {unresolved.length > 0 && (
        <section className="rounded-md border border-warning bg-surface p-3">
          <h2 className="text-sm font-semibold text-warning">Choices Available</h2>
          <ul className="mt-1 flex flex-col gap-1">
            {unresolved.map((u) => (
              <li key={u.choiceId} className="text-xs text-text-secondary">
                {u.label} — {u.missingSelections} selection(s) needed
              </li>
            ))}
          </ul>
        </section>
      )}

      {resources.length > 0 && (
        <section className="mt-4">
          <h2 className="text-sm font-semibold text-text-primary">Resources</h2>
          <div className="mt-2 flex flex-col gap-1.5">
            {resources.map((r) => (
              <div key={r.resourceId} className="flex items-center justify-between rounded-md border border-border bg-surface p-2.5 text-sm">
                <span className="text-text-primary">{r.name}</span>
                <span className="font-medium text-text-primary">{r.current} / {r.max}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-4">
        <h2 className="text-sm font-semibold text-text-primary">Activated Features</h2>
        <div className="mt-2 flex flex-col gap-1.5">
          {activeFeatures.map((f) => (
            <div key={f.id} className="rounded-md border border-border bg-surface p-2.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">{f.name}</span>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase text-text-secondary">{f.activation}</span>
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">{f.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <h2 className="text-sm font-semibold text-text-primary">Passive Features</h2>
        <div className="mt-2 flex flex-col gap-1.5">
          {passiveFeatures.map((f) => (
            <div key={f.id} className="rounded-md border border-border bg-surface p-2.5 text-sm">
              <span className="font-medium text-text-primary">{f.name}</span>
              <p className="mt-0.5 text-xs text-text-secondary">{f.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
