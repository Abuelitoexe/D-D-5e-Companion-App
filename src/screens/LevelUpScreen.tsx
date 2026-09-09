import { useState } from 'react'
import { useCharacterSession } from '../app/CharacterSessionContext'
import { buildFormulaContext } from '../engine/context'
import { resolveChoiceOptionLabel, resolveChoiceOptionPrerequisites } from '../engine/features'
import {
  applyAbilityScoreIncreases,
  applyHitPointGain,
  applyLevelUp,
  canCompleteLevelUp,
  canRemoveOption,
  getLevelUpPreview,
  getSpellDeficits,
  getSpellcastingDefinition,
} from '../engine'
import type { AsiAllocation } from '../engine'
import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import type { AbilityName, CharacterState, ChoiceDefinition, Prerequisite } from '../domain/types'

const ABILITIES: AbilityName[] = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma']
const ASI_FEAT_ID = 'abilityScoreImprovement'

/** While being edited, an allocation slot may have empty (unselected)
 * entries; it only becomes a real AsiAllocation once every slot is filled. */
type DraftAsiSlot = ('' | AbilityName)[]

function isSlotComplete(slot: DraftAsiSlot): slot is AsiAllocation {
  return (slot.length === 1 && slot[0] !== '') || (slot.length === 2 && slot[0] !== '' && slot[1] !== '' && slot[0] !== slot[1])
}

function SpellPicker({
  title,
  count,
  eligibleSpellIds,
  draft,
  onChange,
}: {
  title: string
  count: number
  eligibleSpellIds: string[]
  draft: string[]
  onChange: (next: string[]) => void
}) {
  const { registry } = useCharacterSession()
  if (count <= 0) return null
  return (
    <div className="rounded-md border border-warning bg-surface p-3">
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 text-xs text-text-secondary">{draft.length} / {count} selected</p>
      <div className="mt-2 grid max-h-56 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
        {eligibleSpellIds.map((spellId) => {
          const spell = registry.spells[spellId]
          if (!spell) return null
          const checked = draft.includes(spellId)
          return (
            <label key={spellId} className="flex items-start gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={checked}
                disabled={!checked && draft.length >= count}
                onChange={() => onChange(checked ? draft.filter((id) => id !== spellId) : [...draft, spellId])}
                className="mt-0.5"
              />
              <span><span className="font-medium text-text-primary">{spell.name}</span> — {spell.summary}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

/**
 * PHB 2024 p.202: Ability Score Improvement lets a player increase one
 * ability score by 2, or two different ability scores by 1 each, capped at
 * 20. Each pending pick (usually just one per level-up) gets its own mode
 * toggle + ability selector(s), with the running total (base scores plus
 * every allocation made so far, including earlier picks this same level-up)
 * used to disable any ability that would exceed 20.
 */
function AbilityScoreImprovementPicker({
  count,
  baseScores,
  slots,
  onChange,
}: {
  count: number
  baseScores: Record<AbilityName, number>
  slots: DraftAsiSlot[]
  onChange: (next: DraftAsiSlot[]) => void
}) {
  if (count <= 0) return null

  // Ensure exactly `count` allocation slots exist.
  const paddedSlots: DraftAsiSlot[] = Array.from({ length: count }, (_, i) => slots[i] ?? [])

  function runningScoreBefore(slotIndex: number): Record<AbilityName, number> {
    let scores = { ...baseScores }
    for (let i = 0; i < slotIndex; i++) {
      if (isSlotComplete(paddedSlots[i])) scores = applyAbilityScoreIncreases(scores, [paddedSlots[i] as AsiAllocation])
    }
    return scores
  }

  function updateSlot(index: number, next: DraftAsiSlot) {
    const nextSlots = [...paddedSlots]
    nextSlots[index] = next
    onChange(nextSlots)
  }

  const completedCount = paddedSlots.filter(isSlotComplete).length

  return (
    <div className="rounded-md border border-warning bg-surface p-3">
      <p className="text-sm font-medium text-text-primary">Ability Score Improvement</p>
      <p className="mt-1 text-xs text-text-secondary">{completedCount} / {count} allocated</p>
      <div className="mt-2 flex flex-col gap-3">
        {paddedSlots.map((allocation, index) => {
          const mode = allocation.length === 2 ? 'double' : 'single'
          const scoresBefore = runningScoreBefore(index)
          return (
            <div key={index} className="rounded border border-border p-2">
              <p className="text-xs font-medium text-text-primary">Pick {index + 1}</p>
              <div className="mt-1 flex gap-3 text-xs">
                <label className="flex items-center gap-1">
                  <input type="radio" checked={mode === 'single'} onChange={() => updateSlot(index, [])} />
                  +2 to one score
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" checked={mode === 'double'} onChange={() => updateSlot(index, ['', ''])} />
                  +1 to two scores
                </label>
              </div>
              {mode === 'single' ? (
                <select
                  value={allocation[0] ?? ''}
                  onChange={(e) => updateSlot(index, e.target.value ? [e.target.value as AbilityName] : [])}
                  className="mt-1.5 w-full rounded-md border border-border bg-page px-2 py-1 text-xs"
                >
                  <option value="">Select an ability…</option>
                  {ABILITIES.filter((a) => scoresBefore[a] < 20).map((a) => (
                    <option key={a} value={a}>{a} ({scoresBefore[a]} → {Math.min(20, scoresBefore[a] + 2)})</option>
                  ))}
                </select>
              ) : (
                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                  {[0, 1].map((slotIndex) => (
                    <select
                      key={slotIndex}
                      value={allocation[slotIndex] ?? ''}
                      onChange={(e) => {
                        const next: DraftAsiSlot = [...allocation]
                        next[slotIndex] = e.target.value as AbilityName
                        updateSlot(index, next)
                      }}
                      className="rounded-md border border-border bg-page px-2 py-1 text-xs"
                    >
                      <option value="">Select…</option>
                      {ABILITIES.filter((a) => scoresBefore[a] < 20 && a !== allocation[1 - slotIndex]).map((a) => (
                        <option key={a} value={a}>{a} ({scoresBefore[a]} → {Math.min(20, scoresBefore[a] + 1)})</option>
                      ))}
                    </select>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Whether an option's forward prerequisites are satisfiable right now.
 * hasFeature is not checked here (no reliable way to preview a not-yet-taken
 * feature's grant) — an acceptable simplification, matching this app's role
 * as a companion rather than a strict rules enforcer. */
function prerequisiteSatisfied(prerequisite: Prerequisite, targetLevel: number, draft: string[], character: CharacterState): boolean {
  switch (prerequisite.kind) {
    case 'minimumLevel':
      return targetLevel >= prerequisite.level
    case 'hasSelectedOption':
      return draft.includes(prerequisite.optionId)
    case 'abilityScoreAtLeast':
      return character.abilityScores[prerequisite.ability] >= prerequisite.score
    case 'hasFeature':
      return true
  }
}

function ChoiceResolver({
  choice,
  targetLevel,
  draft,
  onChange,
}: {
  choice: ChoiceDefinition
  targetLevel: number
  draft: string[]
  onChange: (next: string[]) => void
}) {
  const { character, registry } = useCharacterSession()
  const max = evaluateFormula(choice.maximumSelections, buildFormulaContext({ ...character, level: targetLevel }))
  const [blockedMessage, setBlockedMessage] = useState('')

  const selectableOptionIds = choice.optionIds.filter(
    (id) => draft.includes(id) || resolveChoiceOptionPrerequisites(id, registry).every((p) => prerequisiteSatisfied(p, targetLevel, draft, character)),
  )

  function handleToggle(optionId: string, checked: boolean) {
    setBlockedMessage('')
    if (!checked) {
      onChange([...draft, optionId])
      return
    }
    // Removing a selection already held before this level-up must respect
    // the reverse-dependency check (e.g. can't drop Pact of the Blade while
    // Thirsting Blade, which requires it, is still held) — canRemoveOption
    // reads character.selections, so check it against a temp character with
    // this choice's draft substituted in.
    const tempCharacter = { ...character, selections: { ...character.selections, [choice.id]: draft } }
    const result = canRemoveOption(tempCharacter, registry, optionId)
    if (!result.ok) {
      const blockers = (result.blockedByOptionIds ?? []).map((id) => resolveChoiceOptionLabel(id, registry)).join(', ')
      setBlockedMessage(`Can't remove ${resolveChoiceOptionLabel(optionId, registry)} — still required by: ${blockers}`)
      return
    }
    onChange(draft.filter((id) => id !== optionId))
  }

  return (
    <div className="rounded-md border border-warning bg-surface p-3">
      <p className="text-sm font-medium text-text-primary">{choice.label}</p>
      <p className="mt-1 text-xs text-text-secondary">{draft.length} / {max} selected</p>
      {blockedMessage && <p className="mt-1 text-xs text-danger">{blockedMessage}</p>}
      <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
        {selectableOptionIds.map((optionId) => {
          const checked = draft.includes(optionId)
          return (
            <label key={optionId} className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={checked}
                disabled={!checked && draft.length >= max}
                onChange={() => handleToggle(optionId, checked)}
              />
              {resolveChoiceOptionLabel(optionId, registry)}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export function LevelUpScreen() {
  const { character, registry, updateCharacter } = useCharacterSession()
  const targetLevel = character.level + 1
  const atMaxLevel = character.level >= 20

  const [subclassChoice, setSubclassChoice] = useState('')
  const [draftSelections, setDraftSelections] = useState<Record<string, string[]>>({})
  const [draftCantrips, setDraftCantrips] = useState<string[]>([])
  const [draftSpellbook, setDraftSpellbook] = useState<string[]>([])
  const [draftPrepared, setDraftPrepared] = useState<string[]>([])
  const [draftAsiSlots, setDraftAsiSlots] = useState<DraftAsiSlot[]>([])

  // Once a subclass is tentatively picked (for a character reaching
  // subclassLevel this level-up), preview against a character that already
  // has it set — otherwise subclass-granted choices due THIS level (e.g.
  // Battle Master's Maneuvers at level 3) would never appear as required.
  // (Not memoized: previewCharacter's identity already changes whenever
  // character or subclassChoice does, so a useMemo here bought nothing.)
  const previewCharacter = subclassChoice ? { ...character, subclassId: subclassChoice } : character
  const preview = atMaxLevel ? null : getLevelUpPreview(previewCharacter, targetLevel, registry)

  if (atMaxLevel) {
    return <p className="text-sm text-text-secondary">This character is already at level 20.</p>
  }
  if (!preview) return null

  const cls = registry.classes[character.classId]
  const needsSubclass = preview.requiredChoices.some((c) => c.type === 'subclassUnlock')
  const availableSubclasses = cls ? Object.values(registry.subclasses).filter((s) => s.parentClassId === cls.id) : []

  // Identify (at most one) required choice this level-up that's the generic
  // ASI-or-feat pick, so it gets the dedicated allocation UI instead of the
  // generic option-list ChoiceResolver.
  const asiChoiceId = preview.requiredChoices.find((c) => {
    if (!c.choiceId) return false
    const choice = registry.choices[c.choiceId]
    return choice?.optionIds.length === 1 && choice.optionIds[0] === ASI_FEAT_ID
  })?.choiceId
  const asiDeficitCount = asiChoiceId
    ? evaluateFormula(registry.choices[asiChoiceId]!.minimumSelections, buildFormulaContext({ ...character, level: targetLevel })) -
      (character.selections[asiChoiceId]?.length ?? 0)
    : 0
  const completedAsiAllocations: AsiAllocation[] = draftAsiSlots.filter(isSlotComplete)
  const asiAllocationsValid = completedAsiAllocations.length === asiDeficitCount && draftAsiSlots.length === asiDeficitCount

  const spellcasting = getSpellcastingDefinition({ ...character, level: targetLevel, subclassId: subclassChoice || character.subclassId }, registry)
  const cantripsKnown = character.selections['cantripsKnown'] ?? []
  const spellbookIds = character.spellbookSpellIds ?? []
  const preparedIds = character.preparedSpellIds

  const pendingCharacter = {
    ...character,
    level: targetLevel,
    subclassId: subclassChoice || character.subclassId,
    selections: {
      ...character.selections,
      ...draftSelections,
      ...(asiChoiceId ? { [asiChoiceId]: completedAsiAllocations.map(() => ASI_FEAT_ID) } : {}),
      ...(spellcasting ? { cantripsKnown: [...cantripsKnown, ...draftCantrips] } : {}),
    },
    spellbookSpellIds: [...spellbookIds, ...draftSpellbook],
    preparedSpellIds: [...preparedIds, ...draftPrepared],
  }
  const readyToComplete =
    (!needsSubclass || subclassChoice) &&
    (asiDeficitCount === 0 || asiAllocationsValid) &&
    canCompleteLevelUp(pendingCharacter, targetLevel, registry)

  const currentDeficits = spellcasting ? getSpellDeficits({ ...character, level: targetLevel }, registry) : { cantrips: 0, spellbook: 0, prepared: 0 }

  // The class whose spell list this character draws from — read from the
  // registry rather than hardcoded, so this works for any caster class, not
  // just the one this screen was first built against (Wizard).
  const casterClassName = registry.classes[character.classId]?.name ?? ''
  const eligibleNewCantrips = Object.values(registry.spells)
    .filter((s) => s.level === 0 && s.classes.includes(casterClassName) && !cantripsKnown.includes(s.id))
    .map((s) => s.id)
  const maxPreparableLevel = spellcasting?.maxPreparableSlotLevel
    ? evaluateFormula(spellcasting.maxPreparableSlotLevel, buildFormulaContext({ ...character, level: targetLevel }))
    : spellcasting?.slotTable?.[targetLevel]
      ? Math.max(...Object.keys(spellcasting.slotTable[targetLevel]).map(Number))
      : 0
  const eligibleNewSpellbookSpells = Object.values(registry.spells)
    .filter((s) => s.level >= 1 && s.level <= maxPreparableLevel && s.classes.includes(casterClassName) && !spellbookIds.includes(s.id))
    .map((s) => s.id)
  // A spellbook caster (Wizard) can only prepare from spells already copied
  // into the spellbook. Any other preparedSource (knownList — Warlock,
  // Sorcerer; classListFull — Cleric) has no spellbook step at all — its
  // "prepared" spells are picked directly from the whole class list, whether
  // or not there's a separate persistent "known" subset (this app doesn't
  // model that distinction beyond what's currently prepared).
  const eligibleNewPrepared =
    spellcasting?.preparedSource !== 'spellbook'
      ? Object.values(registry.spells)
          .filter((s) => s.level >= 1 && s.level <= maxPreparableLevel && s.classes.includes(casterClassName) && !preparedIds.includes(s.id) && !draftPrepared.includes(s.id))
          .map((s) => s.id)
      : [...spellbookIds, ...draftSpellbook].filter((id) => !preparedIds.includes(id))

  function getDraft(choiceId: string) {
    return draftSelections[choiceId] ?? character.selections[choiceId] ?? []
  }

  function handleComplete() {
    if (!readyToComplete) return
    let next = applyLevelUp(character, targetLevel)
    next = {
      ...next,
      selections: {
        ...next.selections,
        ...draftSelections,
        ...(asiChoiceId ? { [asiChoiceId]: completedAsiAllocations.map(() => ASI_FEAT_ID) } : {}),
        ...(spellcasting ? { cantripsKnown: [...cantripsKnown, ...draftCantrips] } : {}),
      },
      spellbookSpellIds: [...spellbookIds, ...draftSpellbook],
      preparedSpellIds: [...preparedIds, ...draftPrepared],
    }
    if (subclassChoice) next = { ...next, subclassId: subclassChoice }
    if (completedAsiAllocations.length > 0) {
      next = { ...next, abilityScores: applyAbilityScoreIncreases(next.abilityScores, completedAsiAllocations) }
    }
    // Hit Point maximum/current always update on level-up (new Hit Die, plus
    // any retroactive Constitution change from an ASI pick above) — PHB
    // p.42, "Adjust Hit Points and Hit Point Dice" + "Adjust Ability Modifiers".
    next = applyHitPointGain(character, next, registry)

    updateCharacter(next)
    setSubclassChoice('')
    setDraftSelections({})
    setDraftCantrips([])
    setDraftSpellbook([])
    setDraftPrepared([])
    setDraftAsiSlots([])
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-text-primary">Level {character.level} → {targetLevel}</h1>

      {preview.gains.length > 0 && (
        <section className="mt-4">
          <h2 className="text-sm font-semibold text-text-primary">You Gain</h2>
          <div className="mt-2 flex flex-col gap-1.5">
            {preview.gains.map((g, i) => (
              <div key={`${g.featureId}-${i}`} className="rounded-md border border-border bg-surface p-2.5 text-sm">
                <span className="font-medium text-text-primary">{g.label}</span>
                {g.detail && <p className="mt-0.5 text-xs text-text-secondary">{g.detail}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {preview.resourceChanges.length > 0 && (
        <section className="mt-4">
          <h2 className="text-sm font-semibold text-text-primary">Resource Increase</h2>
          <div className="mt-2 flex flex-col gap-1.5">
            {preview.resourceChanges.map((r) => (
              <div key={r.resourceId} className="flex items-center justify-between rounded-md border border-border bg-surface p-2.5 text-sm">
                <span className="text-text-primary">{r.name}</span>
                <span className="text-text-secondary">{r.oldMax} → {r.newMax}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(needsSubclass || preview.requiredChoices.length > 0 || currentDeficits.cantrips > 0 || currentDeficits.spellbook > 0 || currentDeficits.prepared > 0) && (
        <section className="mt-4">
          <h2 className="text-sm font-semibold text-text-primary">You Need to Choose</h2>
          <div className="mt-2 flex flex-col gap-2">
            <SpellPicker title="New Cantrips" count={currentDeficits.cantrips} eligibleSpellIds={eligibleNewCantrips} draft={draftCantrips} onChange={setDraftCantrips} />
            <SpellPicker title="New Spellbook Spells" count={currentDeficits.spellbook} eligibleSpellIds={eligibleNewSpellbookSpells} draft={draftSpellbook} onChange={setDraftSpellbook} />
            <SpellPicker title="New Prepared Spells" count={currentDeficits.prepared} eligibleSpellIds={eligibleNewPrepared} draft={draftPrepared} onChange={setDraftPrepared} />
            {needsSubclass && (
              <div className="rounded-md border border-warning bg-surface p-3">
                <p className="text-sm font-medium text-text-primary">Choose a {cls?.name} subclass</p>
                <select
                  value={subclassChoice}
                  onChange={(e) => setSubclassChoice(e.target.value)}
                  className="mt-2 w-full rounded-md border border-border bg-page px-2 py-1.5 text-sm"
                >
                  <option value="">Select…</option>
                  {availableSubclasses.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}
            {asiChoiceId && (
              <AbilityScoreImprovementPicker
                count={asiDeficitCount}
                baseScores={character.abilityScores}
                slots={draftAsiSlots}
                onChange={setDraftAsiSlots}
              />
            )}
            {preview.requiredChoices
              .filter((c) => c.choiceId && c.choiceId !== asiChoiceId)
              .map((c) => {
                const choice = registry.choices[c.choiceId as string]
                if (!choice) return null
                return (
                  <ChoiceResolver
                    key={choice.id}
                    choice={choice}
                    targetLevel={targetLevel}
                    draft={getDraft(choice.id)}
                    onChange={(next) => setDraftSelections((prev) => ({ ...prev, [choice.id]: next }))}
                  />
                )
              })}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={handleComplete}
        disabled={!readyToComplete}
        className="mt-6 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
      >
        Complete Level Up
      </button>
    </div>
  )
}
