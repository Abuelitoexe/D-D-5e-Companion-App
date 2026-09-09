import type { ChoiceDefinition, ChoiceOptionDefinition, ClassDefinition, ConditionalModifierDefinition, FeatureDefinition, ResourceDefinition } from '../../../domain/types'
import { weapons } from '../equipment'
import { GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.128-130 — Core Rogue Traits + Rogue Features table, re-verified
// via pdftotext -table mode (raw/layout scrambled the Sneak Attack column).
export const rogueClass: ClassDefinition = {
  id: 'rogue',
  name: 'Rogue',
  source: src(128),
  primaryAbilities: ['Dexterity'],
  hitDie: 8,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['rogue-expertise', 'rogue-sneak-attack', 'rogue-thieves-cant', 'rogue-weapon-mastery'],
    2: ['rogue-cunning-action'],
    3: ['rogue-steady-aim'],
    4: ['rogue-asi'],
    5: ['rogue-cunning-strike', 'rogue-uncanny-dodge'],
    6: ['rogue-expertise'],
    7: ['rogue-evasion', 'rogue-reliable-talent'],
    8: ['rogue-asi'],
    9: [],
    10: ['rogue-asi'],
    11: ['rogue-improved-cunning-strike'],
    12: ['rogue-asi'],
    13: [],
    14: ['rogue-devious-strikes'],
    15: ['rogue-slippery-mind'],
    16: ['rogue-asi'],
    17: [],
    18: ['rogue-elusive'],
    19: ['rogue-epic-boon'],
    20: ['rogue-stroke-of-luck'],
  },
  resources: ['strokeOfLuck'],
  choiceIds: ['rogue-expertise-choice', 'rogue-weapon-mastery-choice', 'rogue-asi-choice'],
}

// Rogue doesn't have proficiency tracking wired up yet (Section 18 of the
// plan), so Expertise offers all 18 skills rather than only ones the
// character is already proficient in — a known, flagged simplification,
// same as Wizard's Scholar and Human's Skillful.
const ALL_SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
  'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
  'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival',
]
const skillOptionId = (skill: string) => `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`

const weaponMasteryOptions: ChoiceOptionDefinition[] = Object.values(weapons).map((weapon) => ({
  id: `weapon-mastery-${weapon.id}`,
  label: weapon.name,
  source: weapon.source,
}))

export const rogueChoices: Record<string, ChoiceDefinition> = {
  'rogue-expertise-choice': {
    id: 'rogue-expertise-choice',
    label: 'Expertise',
    mode: 'multiple',
    // 2 skills at level 1, +2 more (4 total) at level 6.
    minimumSelections: { kind: 'levelTable', table: { 1: 2, 6: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 1: 2, 6: 4 } },
    required: true,
    timing: ['characterCreation', 'onLevelUp'],
    optionIds: ALL_SKILLS.map(skillOptionId),
    // No replacementPolicies — Expertise picks are permanent once made.
    source: src(129),
  },
  'rogue-weapon-mastery-choice': {
    id: 'rogue-weapon-mastery-choice',
    label: 'Weapon Mastery',
    mode: 'multiple',
    // Rogue gets only 2 weapon kinds (vs Fighter's 3, Barbarian's 2) — same
    // mechanic, different count, purely a data difference.
    minimumSelections: { kind: 'flat', value: 2 },
    maximumSelections: { kind: 'flat', value: 2 },
    required: true,
    timing: ['characterCreation', 'onLongRest'],
    optionIds: weaponMasteryOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onLongRest', maxReplacements: 'unlimited' }],
    source: src(129),
  },
  'rogue-asi-choice': {
    id: 'rogue-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    // Rogue gets an extra pick at level 10 (4, 8, 10, 12, 16 = 5 total),
    // unlike Fighter's 6 (extra at 6/14) or Wizard's standard 4.
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 10: 3, 12: 4, 16: 5 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 10: 3, 12: 4, 16: 5 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(130),
  },
}

export const rogueChoiceOptions: Record<string, ChoiceOptionDefinition> = Object.fromEntries(
  weaponMasteryOptions.map((o) => [o.id, o]),
)

export const rogueResources: Record<string, ResourceDefinition> = {
  strokeOfLuck: {
    id: 'strokeOfLuck',
    name: 'Stroke of Luck',
    minimumLevel: 20,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['shortRest', 'longRest'] },
    source: src(131),
  },
}

// Cunning Strike effects (p.130-131) — modeled as tradeable riders on the
// Sneak Attack conditional modifier, not a separate resource: each costs
// Sneak Attack dice rather than a pool of its own.
const sneakAttack: ConditionalModifierDefinition = {
  id: 'sneakAttack',
  name: 'Sneak Attack',
  source: src(129),
  appliesTo: 'weaponAttack',
  requiresWeaponTags: ['finesse', 'ranged'],
  frequency: 'oncePerTurn',
  // ceil(Rogue level / 2) d6s — verified via -table extraction (1d6 at
  // levels 1-2, 2d6 at 3-4, ... 10d6 at 19-20).
  amount: { kind: 'derived', base: 'classLevel', divisor: 2, rounding: 'up' },
  diceSize: 6,
  tradeableFor: [
    { id: 'poison', name: 'Poison', diceCost: 1, effectSummary: 'Constitution save or Poisoned for 1 minute (repeats save each turn). Requires a Poisoner\'s Kit on your person.' },
    { id: 'trip', name: 'Trip', diceCost: 1, effectSummary: 'Large or smaller target makes a Dexterity save or has the Prone condition.' },
    { id: 'withdraw', name: 'Withdraw', diceCost: 1, effectSummary: 'Move up to half your Speed immediately after the attack, without provoking Opportunity Attacks.' },
    // Devious Strikes additions, level 14 (gated by requiring the feature; UI/engine treat these as always-listed but the app should only surface them once rogue-devious-strikes is active — acceptable v1 simplification, flagged).
    { id: 'daze', name: 'Daze', diceCost: 2, effectSummary: 'Constitution save or the target can only move OR take an action/Bonus Action on its next turn. (Devious Strikes, level 14+)' },
    { id: 'obscure', name: 'Obscure', diceCost: 3, effectSummary: 'Dexterity save or the target has the Blinded condition until the end of its next turn. (Devious Strikes, level 14+)' },
    { id: 'knockOut', name: 'Knock Out', diceCost: 6, effectSummary: 'Constitution save or the target has the Unconscious condition for 1 minute (repeats save each turn). (Devious Strikes, level 14+)' },
  ],
}

export const rogueConditionalModifiers: Record<string, ConditionalModifierDefinition> = { sneakAttack }

export const rogueFeatures: Record<string, FeatureDefinition> = {
  'rogue-expertise': {
    id: 'rogue-expertise',
    name: 'Expertise',
    source: src(129),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Double Proficiency Bonus on ability checks with 2 chosen skill proficiencies. 2 more at level 6.',
    choices: ['rogue-expertise-choice'],
  },
  'rogue-sneak-attack': {
    id: 'rogue-sneak-attack',
    name: 'Sneak Attack',
    source: src(129),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Once per turn, deal extra damage (scaling with level) on a hit with a Finesse or Ranged weapon if you have Advantage, or an ally is within 5 feet of the target.',
    conditionalModifierIds: ['sneakAttack'],
  },
  'rogue-thieves-cant': {
    id: 'rogue-thieves-cant',
    name: "Thieves' Cant",
    source: src(129),
    minimumLevel: 1,
    activation: 'passive',
    summary: "Know Thieves' Cant and one other language of your choice.",
  },
  'rogue-weapon-mastery': {
    id: 'rogue-weapon-mastery',
    name: 'Weapon Mastery',
    source: src(129),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Use the mastery properties of 2 weapon kinds you have proficiency with. Change your choices whenever you finish a Long Rest.',
    choices: ['rogue-weapon-mastery-choice'],
  },
  'rogue-cunning-action': {
    id: 'rogue-cunning-action',
    name: 'Cunning Action',
    source: src(130),
    minimumLevel: 2,
    activation: 'bonusAction',
    summary: 'Take Dash, Disengage, or Hide as a Bonus Action.',
    grantsActionIds: ['dash', 'disengage', 'hide'],
  },
  'rogue-steady-aim': {
    id: 'rogue-steady-aim',
    name: 'Steady Aim',
    source: src(130),
    minimumLevel: 3,
    activation: 'bonusAction',
    summary: 'Gain Advantage on your next attack roll this turn. Only if you haven\'t moved this turn; your Speed becomes 0 until the end of the turn.',
  },
  'rogue-asi': {
    id: 'rogue-asi',
    name: 'Ability Score Improvement',
    source: src(130),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Rogue levels 8, 10, 12, and 16.',
    choices: ['rogue-asi-choice'],
  },
  'rogue-cunning-strike': {
    id: 'rogue-cunning-strike',
    name: 'Cunning Strike',
    source: src(130),
    minimumLevel: 5,
    activation: 'passive',
    summary: "Forgo Sneak Attack dice to add a rider effect (Poison, Trip, or Withdraw) to a Sneak Attack hit.",
    conditionalModifierIds: ['sneakAttack'],
  },
  'rogue-uncanny-dodge': {
    id: 'rogue-uncanny-dodge',
    name: 'Uncanny Dodge',
    source: src(131),
    minimumLevel: 5,
    activation: 'reaction',
    summary: 'Halve the damage of an attack that hits you (round down).',
  },
  'rogue-evasion': {
    id: 'rogue-evasion',
    name: 'Evasion',
    source: src(131),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'A successful Dexterity save that would deal half damage instead deals none; a failed one deals only half. Not while Incapacitated.',
  },
  'rogue-reliable-talent': {
    id: 'rogue-reliable-talent',
    name: 'Reliable Talent',
    source: src(131),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'Treat a d20 roll of 9 or lower as a 10 on ability checks using a skill or tool proficiency you have.',
  },
  'rogue-improved-cunning-strike': {
    id: 'rogue-improved-cunning-strike',
    name: 'Improved Cunning Strike',
    source: src(131),
    minimumLevel: 11,
    activation: 'passive',
    summary: 'Use up to two Cunning Strike effects on the same Sneak Attack, paying the die cost for each.',
  },
  'rogue-devious-strikes': {
    id: 'rogue-devious-strikes',
    name: 'Devious Strikes',
    source: src(131),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'Adds Daze (2d6), Obscure (3d6), and Knock Out (6d6) as Cunning Strike options.',
    conditionalModifierIds: ['sneakAttack'],
  },
  'rogue-slippery-mind': {
    id: 'rogue-slippery-mind',
    name: 'Slippery Mind',
    source: src(131),
    minimumLevel: 15,
    activation: 'passive',
    summary: 'Gain proficiency in Wisdom and Charisma saving throws.',
  },
  'rogue-elusive': {
    id: 'rogue-elusive',
    name: 'Elusive',
    source: src(131),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'No attack roll can have Advantage against you unless you\'re Incapacitated.',
  },
  'rogue-epic-boon': {
    id: 'rogue-epic-boon',
    name: 'Epic Boon',
    source: src(131),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of the Night Spirit is recommended.',
  },
  'rogue-stroke-of-luck': {
    id: 'rogue-stroke-of-luck',
    name: 'Stroke of Luck',
    source: src(131),
    minimumLevel: 20,
    activation: 'special',
    summary: 'Turn a failed D20 Test into a 20. Once per Short or Long Rest.',
    resourceId: 'strokeOfLuck',
  },
}
