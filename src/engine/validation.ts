import type { CharacterState } from '../domain/types'
import type { RulesRegistry } from '../data/registry'
import { getUnresolvedChoices } from './choices'
import { getSpellcastingDefinition, getSpellDeficits } from './spells'

export interface ValidationIssue {
  code: 'unresolvedChoice' | 'missingSubclass' | 'subclassSourceDisabled' | 'unknownClass' | 'incompleteSpellSelections' | 'preparedSpellNotInSpellbook'
  message: string
}

export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
}

/** A full-character check — run on load and before saving, not just at
 * selection time, since a change elsewhere (enabled sources, ability scores)
 * can retroactively invalidate something that was fine when first chosen. */
export function validateCharacter(character: CharacterState, registry: RulesRegistry): ValidationResult {
  const issues: ValidationIssue[] = []

  const cls = registry.classes[character.classId]
  if (!cls) {
    issues.push({ code: 'unknownClass', message: `Class "${character.classId}" was not found in the enabled rules data.` })
    return { valid: false, issues }
  }

  if (character.level >= cls.subclassLevel && !character.subclassId) {
    issues.push({ code: 'missingSubclass', message: `${cls.name} requires a subclass at level ${cls.subclassLevel}.` })
  }

  if (character.subclassId) {
    const sub = registry.subclasses[character.subclassId]
    if (sub && !character.enabledSourceIds.includes(sub.source.sourceId)) {
      issues.push({
        code: 'subclassSourceDisabled',
        message: `${sub.name} comes from a disabled source (${sub.source.sourceLabel}). The character is preserved, but this subclass won't appear for new selections.`,
      })
    }
  }

  for (const unresolved of getUnresolvedChoices(character, registry)) {
    issues.push({
      code: 'unresolvedChoice',
      message: `${unresolved.label}: ${unresolved.missingSelections} selection(s) still needed.`,
    })
  }

  const spellDeficits = getSpellDeficits(character, registry)
  if (spellDeficits.cantrips > 0) issues.push({ code: 'incompleteSpellSelections', message: `${spellDeficits.cantrips} more cantrip(s) need to be chosen.` })
  if (spellDeficits.spellbook > 0) issues.push({ code: 'incompleteSpellSelections', message: `${spellDeficits.spellbook} more spellbook spell(s) need to be chosen.` })
  if (spellDeficits.prepared > 0) issues.push({ code: 'incompleteSpellSelections', message: `${spellDeficits.prepared} more prepared spell(s) need to be chosen.` })

  // Only the spellbook model (Wizard) has a spellbook to be a subset of —
  // every other preparedSource picks prepared spells directly, so there's
  // no separate list for "prepared" to drift out of sync with.
  const casting = getSpellcastingDefinition(character, registry)
  if (casting?.preparedSource === 'spellbook') {
    const spellbook = new Set(character.spellbookSpellIds ?? [])
    const strays = character.preparedSpellIds.filter((id) => !spellbook.has(id))
    for (const id of strays) {
      issues.push({ code: 'preparedSpellNotInSpellbook', message: `"${registry.spells[id]?.name ?? id}" is prepared but not in the spellbook.` })
    }
  }

  return { valid: issues.every((i) => i.code === 'subclassSourceDisabled'), issues }
}
