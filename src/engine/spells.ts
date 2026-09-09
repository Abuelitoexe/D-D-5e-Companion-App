import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import type { CharacterState, SpellcastingDefinition } from '../domain/types'
import type { RulesRegistry } from '../data/registry'
import { buildFormulaContext } from './context'

/** A subclass's own spellcasting (e.g. Eldritch Knight, Arcane Trickster)
 * takes precedence over the base class's, since a character has at most one
 * active caster progression at a time in v1 (no multiclassing). */
export function getSpellcastingDefinition(character: CharacterState, registry: RulesRegistry): SpellcastingDefinition | undefined {
  if (character.subclassId) {
    const sub = registry.subclasses[character.subclassId]
    if (sub?.spellcasting) return sub.spellcasting
  }
  return registry.classes[character.classId]?.spellcasting
}

function leveledLookup(table: Record<number, number> | undefined, level: number): number {
  if (!table) return 0
  let value = 0
  for (const key of Object.keys(table).map(Number).sort((a, b) => a - b)) {
    if (key <= level) value = table[key]
    else break
  }
  return value
}

/** Pact Magic (Warlock) is keyed by classLevel in its own sparse table, same
 * lookup shape as a NumberFormula levelTable but for a {slots, slotLevel}
 * pair rather than a single number. */
function pactRow(table: Record<number, { slots: number; slotLevel: number }> | undefined, level: number) {
  if (!table) return undefined
  let row: { slots: number; slotLevel: number } | undefined
  for (const key of Object.keys(table).map(Number).sort((a, b) => a - b)) {
    if (key <= level) row = table[key]
    else break
  }
  return row
}

export interface SpellSlotState {
  level: number
  current: number
  max: number
}

/** Slots are always modeled as one row per spell level (level -> {current,
 * max}), whether they come from a standard per-level slotTable (Wizard) or
 * from Pact Magic's single always-highest-level pool (Warlock) — Pact Magic
 * just happens to produce exactly one row. */
export function getSpellSlotState(character: CharacterState, registry: RulesRegistry): SpellSlotState[] {
  const casting = getSpellcastingDefinition(character, registry)
  if (!casting) return []

  if (casting.slotProgression === 'pact') {
    const row = pactRow(casting.pactSlotTable, character.level)
    if (!row) return []
    const resourceId = `spellSlot-${row.slotLevel}`
    const state = character.resourceState.find((s) => s.resourceId === resourceId)
    const current = state ? Math.min(state.current, row.slots) : row.slots
    return [{ level: row.slotLevel, current, max: row.slots }]
  }

  const slotRow = casting.slotTable?.[character.level]
  if (!slotRow) return []
  return Object.entries(slotRow)
    .map(([lvl, max]) => {
      const resourceId = `spellSlot-${lvl}`
      const state = character.resourceState.find((s) => s.resourceId === resourceId)
      const current = state ? Math.min(state.current, max) : max
      return { level: Number(lvl), current, max }
    })
    .sort((a, b) => a.level - b.level)
}

export function spendSpellSlot(character: CharacterState, registry: RulesRegistry, slotLevel: number): CharacterState {
  const slots = getSpellSlotState(character, registry)
  const slot = slots.find((s) => s.level === slotLevel)
  if (!slot) return character
  const resourceId = `spellSlot-${slotLevel}`
  const next = Math.max(0, slot.current - 1)
  const existing = character.resourceState.find((s) => s.resourceId === resourceId)
  const resourceState = existing
    ? character.resourceState.map((s) => (s.resourceId === resourceId ? { ...s, current: next } : s))
    : [...character.resourceState, { resourceId, current: next }]
  return { ...character, resourceState, updatedAt: new Date().toISOString() }
}

/** Refreshes spell slots for the given rest. Standard slot progressions
 * (full/half/custom — Wizard, Eldritch Knight, Arcane Trickster) only
 * recover on a Long Rest; Pact Magic (Warlock) recovers on a Short OR Long
 * Rest, per PHB p.153 ("You regain all expended Pact Magic spell slots when
 * you finish a Short or Long Rest"). */
export function applySpellSlotsRest(character: CharacterState, registry: RulesRegistry, rest: 'shortRest' | 'longRest'): CharacterState {
  const casting = getSpellcastingDefinition(character, registry)
  if (!casting) return character
  if (casting.slotProgression !== 'pact' && rest === 'shortRest') return character

  const currentSlots = getSpellSlotState(character, registry)
  if (currentSlots.length === 0) return character

  const activeLevels = new Set(currentSlots.map((s) => s.level))
  const resourceState = character.resourceState.filter((s) => {
    const match = /^spellSlot-(\d+)$/.exec(s.resourceId)
    return !(match && activeLevels.has(Number(match[1])))
  })
  for (const slot of currentSlots) {
    resourceState.push({ resourceId: `spellSlot-${slot.level}`, current: slot.max })
  }
  return { ...character, resourceState, updatedAt: new Date().toISOString() }
}

export interface SpellcastingStateView {
  definition: SpellcastingDefinition
  cantripsMax: number
  cantripsKnown: string[]
  spellbookMax: number
  spellbookSpellIds: string[]
  preparedMax: number
  preparedSpellIds: string[]
  slots: SpellSlotState[]
  maxPreparableSpellLevel?: number
}

/** The single read model the Spells screen and Play screen's spell
 * collector both consume — combines cantrip/spellbook/prepared capacity
 * with current selections and slot state. */
export function getSpellcastingState(character: CharacterState, registry: RulesRegistry): SpellcastingStateView | undefined {
  const casting = getSpellcastingDefinition(character, registry)
  if (!casting) return undefined
  const ctx = buildFormulaContext(character)

  return {
    definition: casting,
    cantripsMax: leveledLookup(casting.cantripProgression, character.level),
    cantripsKnown: character.selections['cantripsKnown'] ?? [],
    spellbookMax: casting.spellbookGrowthFormula ? evaluateFormula(casting.spellbookGrowthFormula, ctx) : 0,
    spellbookSpellIds: character.spellbookSpellIds ?? [],
    preparedMax: casting.preparedCountFormula ? evaluateFormula(casting.preparedCountFormula, ctx) : 0,
    preparedSpellIds: character.preparedSpellIds,
    slots: getSpellSlotState(character, registry),
    maxPreparableSpellLevel: casting.maxPreparableSlotLevel ? evaluateFormula(casting.maxPreparableSlotLevel, ctx) : undefined,
  }
}

/** How many more spellbook/cantrip/prepared selections are still needed at
 * the character's CURRENT level — used to gate Level Up the same way
 * getUnresolvedChoices gates ordinary choices. */
export function getSpellDeficits(character: CharacterState, registry: RulesRegistry) {
  const state = getSpellcastingState(character, registry)
  if (!state) return { cantrips: 0, spellbook: 0, prepared: 0 }
  return {
    cantrips: Math.max(0, state.cantripsMax - state.cantripsKnown.length),
    spellbook: Math.max(0, state.spellbookMax - state.spellbookSpellIds.length),
    prepared: Math.max(0, state.preparedMax - state.preparedSpellIds.length),
  }
}
