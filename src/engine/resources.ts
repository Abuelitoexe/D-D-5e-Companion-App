import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import type { CharacterState, RefreshRule, ResourceDefinition } from '../domain/types'
import type { RulesRegistry } from '../data/registry'
import { buildFormulaContext } from './context'
import { applySpellSlotsRest } from './spells'
import { reduceExhaustionOnLongRest } from './exhaustion'

/** Every resource the character's class/subclass grants, gated by level. */
export function getResourceDefinitionsForCharacter(character: CharacterState, registry: RulesRegistry): ResourceDefinition[] {
  const ids = new Set<string>()
  const cls = registry.classes[character.classId]
  for (const id of cls?.resources ?? []) ids.add(id)
  if (character.subclassId) {
    const sub = registry.subclasses[character.subclassId]
    for (const id of sub?.resources ?? []) ids.add(id)
  }

  const resources: ResourceDefinition[] = []
  for (const id of ids) {
    const def = registry.resources[id]
    if (def && character.level >= def.minimumLevel) resources.push(def)
  }
  return resources
}

export function getResourceMaximum(resource: ResourceDefinition, character: CharacterState): number {
  return evaluateFormula(resource.maximum, buildFormulaContext(character))
}

export function getResourceRefreshRules(resource: ResourceDefinition, character: CharacterState): RefreshRule[] {
  let value = resource.refresh.default
  for (const override of resource.refresh.overridesFromLevel ?? []) {
    if (override.level <= character.level) value = override.value
  }
  return value
}

export interface ResourceStateView {
  resourceId: string
  name: string
  current: number
  max: number
}

export function getResourceState(character: CharacterState, registry: RulesRegistry): ResourceStateView[] {
  return getResourceDefinitionsForCharacter(character, registry).map((def) => {
    const max = getResourceMaximum(def, character)
    const state = character.resourceState.find((s) => s.resourceId === def.id)
    const current = state ? Math.min(state.current, max) : max
    return { resourceId: def.id, name: def.name, current, max }
  })
}

/** Spends one use of a resource, initializing it at its current maximum if
 * the character has no tracked state for it yet. Returns a new character
 * state — never mutates in place. */
export function spendResourceUse(character: CharacterState, registry: RulesRegistry, resourceId: string): CharacterState {
  const def = registry.resources[resourceId]
  if (!def) return character
  const max = getResourceMaximum(def, character)
  const existing = character.resourceState.find((s) => s.resourceId === resourceId)
  const current = existing ? existing.current : max
  const next = Math.max(0, current - 1)
  const resourceState = existing
    ? character.resourceState.map((s) => (s.resourceId === resourceId ? { ...s, current: next } : s))
    : [...character.resourceState, { resourceId, current: next }]
  return { ...character, resourceState, updatedAt: new Date().toISOString() }
}

function applyRest(character: CharacterState, registry: RulesRegistry, rest: 'shortRest' | 'longRest'): CharacterState {
  const ctx = buildFormulaContext(character)
  const resourceState = character.resourceState.map((s) => ({ ...s }))

  for (const def of getResourceDefinitionsForCharacter(character, registry)) {
    if (!getResourceRefreshRules(def, character).includes(rest)) continue
    const max = evaluateFormula(def.maximum, ctx)
    const partialFormula = def.partialRefresh?.[rest]
    const existing = resourceState.find((s) => s.resourceId === def.id)
    const current = existing ? existing.current : max

    const next = partialFormula ? Math.min(max, current + evaluateFormula(partialFormula, ctx)) : max
    if (existing) existing.current = next
    else resourceState.push({ resourceId: def.id, current: next })
  }

  return { ...character, resourceState, updatedAt: new Date().toISOString() }
}

export const applyShortRest = (character: CharacterState, registry: RulesRegistry): CharacterState =>
  applySpellSlotsRest(applyRest(character, registry, 'shortRest'), registry, 'shortRest')

export const applyLongRest = (character: CharacterState, registry: RulesRegistry): CharacterState =>
  reduceExhaustionOnLongRest(applySpellSlotsRest(applyRest(character, registry, 'longRest'), registry, 'longRest'))
