import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import type { CharacterState, ChoiceDefinition, SelectionTiming } from '../domain/types'
import type { RulesRegistry } from '../data/registry'
import { buildFormulaContext } from './context'
import { getCharacterFeatures, resolveChoiceOptionPrerequisites } from './features'

/** Every choice unlocked by the character's current features. */
export function getChoiceDefinitionsForCharacter(character: CharacterState, registry: RulesRegistry): ChoiceDefinition[] {
  const ids = new Set<string>()
  for (const feature of getCharacterFeatures(character, registry)) {
    for (const choiceId of feature.choices ?? []) ids.add(choiceId)
  }
  const choices: ChoiceDefinition[] = []
  for (const id of ids) {
    const choice = registry.choices[id]
    if (choice) choices.push(choice)
  }
  return choices
}

export interface UnresolvedChoice {
  choiceId: string
  label: string
  missingSelections: number
}

/** Required choices the character hasn't fully resolved yet. Pass a timing
 * to scope the check (e.g. only 'onLevelUp' choices during the Level Up
 * flow); omit it to check everything currently unlocked. */
export function getUnresolvedChoices(
  character: CharacterState,
  registry: RulesRegistry,
  timing?: SelectionTiming,
): UnresolvedChoice[] {
  const ctx = buildFormulaContext(character)
  const result: UnresolvedChoice[] = []

  for (const choice of getChoiceDefinitionsForCharacter(character, registry)) {
    if (!choice.required) continue
    if (timing && !choice.timing.includes(timing)) continue

    const minimum = evaluateFormula(choice.minimumSelections, ctx)
    const current = character.selections[choice.id]?.length ?? 0
    if (current < minimum) {
      result.push({ choiceId: choice.id, label: choice.label, missingSelections: minimum - current })
    }
  }

  return result
}

export interface RemoveOptionResult {
  ok: boolean
  blockedByOptionIds?: string[]
}

/** Checks whether an already-selected option can be removed — refused if
 * another currently-selected option declares it as a hasSelectedOption
 * prerequisite (e.g. Warlock-style invocation dependencies). */
export function canRemoveOption(character: CharacterState, registry: RulesRegistry, optionId: string): RemoveOptionResult {
  const blockers = new Set<string>()
  for (const selectedIds of Object.values(character.selections)) {
    for (const selectedId of selectedIds) {
      if (selectedId === optionId) continue
      const prerequisites = resolveChoiceOptionPrerequisites(selectedId, registry)
      for (const prerequisite of prerequisites) {
        if (prerequisite.kind === 'hasSelectedOption' && prerequisite.optionId === optionId) {
          blockers.add(selectedId)
        }
      }
    }
  }
  return blockers.size > 0 ? { ok: false, blockedByOptionIds: [...blockers] } : { ok: true }
}

/** Sets the full selection list for a choice (replacing whatever was there).
 * Callers are responsible for consulting canRemoveOption before dropping an
 * option that other selections depend on. */
export function setChoiceSelections(character: CharacterState, choiceId: string, optionIds: string[]): CharacterState {
  return {
    ...character,
    selections: { ...character.selections, [choiceId]: optionIds },
    updatedAt: new Date().toISOString(),
  }
}
