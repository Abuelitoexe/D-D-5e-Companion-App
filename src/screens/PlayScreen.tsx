import { useCharacterSession } from '../app/CharacterSessionContext'
import { getAvailableActions, getAvailableBonusActions, getAvailableReactions, getAvailableSpecialOptions } from '../engine'
import type { AvailableAction } from '../engine'

const SLOT_FOR_ACTIVATION = {
  action: 'action',
  bonusAction: 'bonusAction',
  reaction: 'reaction',
  special: 'special',
} as const

const UNAVAILABLE_LABEL: Record<string, string> = {
  noResourceUses: 'No uses remaining',
  noSpellSlots: 'No spell slots remaining at this level',
  alreadyUsedThisTurn: 'Already used this turn',
}

function ActionSection({ title, actions, onUse }: { title: string; actions: AvailableAction[]; onUse: (a: AvailableAction) => void }) {
  if (actions.length === 0) return null
  return (
    <section className="mt-4 rounded-md border border-border bg-surface p-3">
      <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      <div className="mt-2 flex flex-col gap-1.5">
        {actions.map((a) => (
          <div key={a.id} className={`rounded-md border border-border bg-surface p-2.5 text-sm ${a.available ? '' : 'opacity-50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-text-primary">{a.label}</span>
              {a.available && (
                <button type="button" onClick={() => onUse(a)} className="shrink-0 rounded-md bg-accent px-2 py-1 text-xs font-medium text-white">
                  {a.sourceKind === 'spell' ? 'Cast' : a.sourceKind === 'weaponAttack' ? 'Attack' : 'Use'}
                </button>
              )}
            </div>
            <p className="mt-0.5 text-xs text-text-secondary">{a.summary}</p>
            {!a.available && a.unavailableReason && (
              <p className="mt-0.5 text-xs text-danger">{UNAVAILABLE_LABEL[a.unavailableReason]}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function PlayScreen() {
  const { character, registry, turn, activateFeature, castSpell, newTurn, shortRest, longRest } = useCharacterSession()

  const actions = getAvailableActions(character, turn, registry, 'action')
  const bonusActions = getAvailableBonusActions(character, turn, registry)
  const reactions = getAvailableReactions(character, turn, registry)
  const special = getAvailableSpecialOptions(character, turn, registry)

  function handleUse(a: AvailableAction) {
    const slot = SLOT_FOR_ACTIVATION[a.activation as keyof typeof SLOT_FOR_ACTIVATION] ?? 'special'
    if (a.sourceKind === 'spell') {
      const spell = registry.spells[a.sourceId]
      castSpell(spell?.level ?? 0, slot)
    } else {
      activateFeature(a.id, a.resourceId, slot)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between rounded-md border border-border bg-surface p-2.5 text-xs">
        <span className={turn.actionUsed ? 'text-text-secondary line-through' : 'font-medium text-text-primary'}>Action</span>
        <span className={turn.bonusActionUsed ? 'text-text-secondary line-through' : 'font-medium text-text-primary'}>Bonus Action</span>
        <span className={turn.reactionUsed ? 'text-text-secondary line-through' : 'font-medium text-text-primary'}>Reaction</span>
        <button type="button" onClick={newTurn} className="rounded-md border border-border px-2 py-1 font-medium text-text-primary">
          New Turn
        </button>
      </div>

      <div className="mt-2 flex gap-2">
        <button type="button" onClick={shortRest} className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-text-primary">
          Short Rest
        </button>
        <button type="button" onClick={longRest} className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-text-primary">
          Long Rest
        </button>
      </div>

      <ActionSection title="Action" actions={actions} onUse={handleUse} />
      <ActionSection title="Bonus Action" actions={bonusActions} onUse={handleUse} />
      <ActionSection title="Reaction" actions={reactions} onUse={handleUse} />
      <ActionSection title="Other" actions={special} onUse={handleUse} />
    </div>
  )
}
