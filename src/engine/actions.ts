import { evaluateFormula } from '../domain/formulas/evaluateFormula'
import type { ActivationType, CharacterState, ConditionalModifierDefinition, TurnState, WeaponDefinition } from '../domain/types'
import type { RulesRegistry } from '../data/registry'
import { buildFormulaContext } from './context'
import { getCharacterFeatures, getConditionalModifiersForCharacter } from './features'
import { getResourceState } from './resources'
import { getSpellcastingState } from './spells'

export type ActionSourceKind = 'general' | 'weaponAttack' | 'feature' | 'spell'
export type UnavailableReason = 'noResourceUses' | 'alreadyUsedThisTurn' | 'noSpellSlots'

/** Maps a spell's free-text casting time to the turn-economy slot it
 * occupies. Anything that isn't Action/Bonus Action/Reaction (rituals,
 * 1-minute/1-hour casts) falls outside the normal turn economy — 'special'
 * puts it in the Play screen's Other bucket rather than hiding it. */
function spellCastingTimeToActivation(castingTime: string): ActivationType {
  if (castingTime.startsWith('Bonus Action')) return 'bonusAction'
  if (castingTime.startsWith('Reaction')) return 'reaction'
  if (castingTime.startsWith('Action')) return 'action'
  return 'special'
}

export interface AvailableAction {
  id: string
  label: string
  activation: ActivationType
  sourceKind: ActionSourceKind
  sourceId: string
  summary: string
  available: boolean
  unavailableReason?: UnavailableReason
  resourceId?: string
}

/** A weapon "qualifies" for a conditional modifier if it has ANY of the
 * modifier's required tags — Sneak Attack's rule is "a finesse or a ranged
 * weapon", not both. 'ranged' checks the weapon's rangeType since it isn't a
 * WeaponProperty, everything else checks the properties array directly. */
function weaponQualifiesForModifier(weapon: WeaponDefinition, modifier: ConditionalModifierDefinition): boolean {
  return modifier.requiresWeaponTags.some((tag) =>
    tag === 'ranged' ? weapon.rangeType === 'ranged' : weapon.properties.includes(tag),
  )
}

function turnSlotUsed(turn: TurnState, activation: ActivationType): boolean {
  if (activation === 'action') return turn.actionUsed
  if (activation === 'bonusAction') return turn.bonusActionUsed
  if (activation === 'reaction') return turn.reactionUsed
  return false
}

/**
 * Merges general actions, weapon attacks, and feature-granted options into
 * one list, filtered to a single activation type. Called once per Play Mode
 * section (Action/Bonus Action/Reaction/Movement/Other) — see engine/index.ts
 * for the per-section wrappers.
 */
export function getAvailableActions(
  character: CharacterState,
  turn: TurnState,
  registry: RulesRegistry,
  activation: ActivationType,
): AvailableAction[] {
  const results: AvailableAction[] = []
  const resourceMap = new Map(getResourceState(character, registry).map((r) => [r.resourceId, r]))
  const slotUsed = turnSlotUsed(turn, activation)

  if (activation === 'action') {
    for (const generalAction of Object.values(registry.generalActions)) {
      results.push({
        id: generalAction.id,
        label: generalAction.name,
        activation: 'action',
        sourceKind: 'general',
        sourceId: generalAction.id,
        summary: generalAction.summary,
        available: !slotUsed,
        unavailableReason: slotUsed ? 'alreadyUsedThisTurn' : undefined,
      })
    }

    const conditionalModifiers = getConditionalModifiersForCharacter(character, registry)
    const formulaCtx = buildFormulaContext(character)

    // Every class's Weapon Mastery choice follows the `${classId}-weapon-
    // mastery-choice` naming convention (Fighter, Rogue, Barbarian all use
    // it) — collecting by suffix instead of a hardcoded class id means this
    // works for any of them without a class-name branch here.
    const masterySelections = Object.entries(character.selections)
      .filter(([choiceId]) => choiceId.endsWith('-weapon-mastery-choice'))
      .flatMap(([, optionIds]) => optionIds)

    for (const equipmentId of character.equipmentIds) {
      const weapon = registry.weapons[equipmentId]
      if (!weapon) continue
      const hasMastery = masterySelections.includes(`weapon-mastery-${weapon.id}`)
      const masteryProperty = hasMastery ? registry.weaponMasteryProperties[weapon.masteryPropertyId] : undefined

      const qualifyingModifiers = conditionalModifiers.filter((m) => weaponQualifiesForModifier(weapon, m))
      const modifierSummary = qualifyingModifiers
        .map((m) => `+${evaluateFormula(m.amount, formulaCtx)}d${m.diceSize} ${m.name}${m.frequency === 'oncePerTurn' ? ' (once per turn)' : ''}`)
        .join(', ')

      results.push({
        id: `attack-${weapon.id}`,
        label: `Attack — ${weapon.name}`,
        activation: 'action',
        sourceKind: 'weaponAttack',
        sourceId: weapon.id,
        summary: [
          `${weapon.damageDice} ${weapon.damageType}`,
          masteryProperty ? `(${masteryProperty.name}: ${masteryProperty.summary})` : undefined,
          modifierSummary || undefined,
        ]
          .filter(Boolean)
          .join(' '),
        available: !slotUsed,
        unavailableReason: slotUsed ? 'alreadyUsedThisTurn' : undefined,
      })
    }
  }

  for (const feature of getCharacterFeatures(character, registry)) {
    if (feature.activation !== activation) continue

    let available = true
    let unavailableReason: UnavailableReason | undefined

    if (feature.resourceId) {
      const resource = resourceMap.get(feature.resourceId)
      if (resource && resource.current <= 0) {
        available = false
        unavailableReason = 'noResourceUses'
      }
    }
    if (slotUsed) {
      available = false
      unavailableReason = unavailableReason ?? 'alreadyUsedThisTurn'
    }

    results.push({
      id: feature.id,
      label: feature.name,
      activation,
      sourceKind: 'feature',
      sourceId: feature.id,
      summary: feature.summary,
      available,
      unavailableReason,
      resourceId: feature.resourceId,
    })

    // A feature can grant an existing general action under its own activation
    // type (Cunning Action lets Dash/Disengage/Hide be taken as a Bonus
    // Action) — surface each granted action as its own entry, sharing the
    // granting feature's availability rather than re-deriving it.
    for (const generalActionId of feature.grantsActionIds ?? []) {
      const generalAction = registry.generalActions[generalActionId]
      if (!generalAction) continue
      results.push({
        id: `granted-${feature.id}-${generalAction.id}`,
        label: generalAction.name,
        activation,
        sourceKind: 'general',
        sourceId: generalAction.id,
        summary: `${generalAction.summary} (via ${feature.name})`,
        available,
        unavailableReason,
      })
    }
  }

  const spellcasting = getSpellcastingState(character, registry)
  if (spellcasting) {
    const slotByLevel = new Map(spellcasting.slots.map((s) => [s.level, s]))
    const allPrepared = [...spellcasting.cantripsKnown, ...spellcasting.preparedSpellIds]
    for (const spellId of allPrepared) {
      const spell = registry.spells[spellId]
      if (!spell) continue
      if (spellCastingTimeToActivation(spell.castingTime) !== activation) continue

      let available = true
      let unavailableReason: UnavailableReason | undefined
      if (spell.level > 0) {
        const slot = slotByLevel.get(spell.level)
        if (!slot || slot.current <= 0) {
          available = false
          unavailableReason = 'noSpellSlots'
        }
      }
      if (slotUsed) {
        available = false
        unavailableReason = unavailableReason ?? 'alreadyUsedThisTurn'
      }

      results.push({
        id: `spell-${spell.id}`,
        label: spell.level === 0 ? spell.name : `${spell.name} (level ${spell.level})`,
        activation,
        sourceKind: 'spell',
        sourceId: spell.id,
        summary: spell.summary,
        available,
        unavailableReason,
      })
    }
  }

  return results
}

export const getAvailableBonusActions = (character: CharacterState, turn: TurnState, registry: RulesRegistry) =>
  getAvailableActions(character, turn, registry, 'bonusAction')

export const getAvailableReactions = (character: CharacterState, turn: TurnState, registry: RulesRegistry) =>
  getAvailableActions(character, turn, registry, 'reaction')

/** "Other" bucket on the Play screen — features with unusual timing that
 * don't fit Action/Bonus Action/Reaction/Movement (e.g. Action Surge, which
 * grants an extra action rather than consuming a normal one). */
export const getAvailableSpecialOptions = (character: CharacterState, turn: TurnState, registry: RulesRegistry) =>
  getAvailableActions(character, turn, registry, 'special')
