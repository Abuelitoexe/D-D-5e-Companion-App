import type { ChoiceDefinition, ChoiceOptionDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition, SpellcastingDefinition } from '../../../domain/types'
import { GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.138-143 — Core Sorcerer Traits + Sorcerer Features table.
// The spell-slot column reuses the exact standard full-caster progression
// already verified for Wizard (identical values, cross-checked digit by
// digit against this table's OCR pass).
export const sorcererSpellcasting: SpellcastingDefinition = {
  ability: 'Charisma',
  slotProgression: 'full',
  cantripProgression: { 1: 4, 4: 5, 10: 6 },
  preparedSource: 'knownList',
  preparedCountFormula: {
    kind: 'levelTable',
    table: { 1: 2, 2: 4, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
  },
  swapPolicy: { timing: ['onLevelUp'], count: 1 },
  slotTable: {
    1: { 1: 2 },
    2: { 1: 3 },
    3: { 1: 4, 2: 2 },
    4: { 1: 4, 2: 3 },
    5: { 1: 4, 2: 3, 3: 2 },
    6: { 1: 4, 2: 3, 3: 3 },
    7: { 1: 4, 2: 3, 3: 3, 4: 1 },
    8: { 1: 4, 2: 3, 3: 3, 4: 2 },
    9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
  },
  spellListId: 'sorcerer',
  source: src(139),
}

export const sorcererClass: ClassDefinition = {
  id: 'sorcerer',
  name: 'Sorcerer',
  source: src(138),
  primaryAbilities: ['Charisma'],
  hitDie: 6,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['sorcerer-spellcasting', 'sorcerer-innate-sorcery'],
    2: ['sorcerer-font-of-magic', 'sorcerer-metamagic'],
    3: [],
    4: ['sorcerer-asi'],
    5: ['sorcerer-sorcerous-restoration'],
    6: [],
    7: ['sorcerer-sorcery-incarnate'],
    8: ['sorcerer-asi'],
    9: [],
    10: ['sorcerer-metamagic'],
    11: [],
    12: ['sorcerer-asi'],
    13: [],
    14: [],
    15: [],
    16: ['sorcerer-asi'],
    17: ['sorcerer-metamagic'],
    18: [],
    19: ['sorcerer-epic-boon'],
    20: ['sorcerer-arcane-apotheosis'],
  },
  resources: ['sorceryPoints', 'innateSorcery', 'sorcerousRestoration'],
  spellcasting: sorcererSpellcasting,
  choiceIds: ['sorcerer-metamagic-choice', 'sorcerer-asi-choice'],
}

// PHB 2024 p.141-142 — all 10 Metamagic options, alphabetical, each with its
// Sorcery Point cost folded into the label (no dedicated "cost" field exists
// on ChoiceOptionDefinition).
const metamagicOptions: ChoiceOptionDefinition[] = [
  { id: 'carefulSpell', label: 'Careful Spell (1 SP) — protect chosen creatures (up to Charisma modifier) from your save-forcing spell', source: src(141) },
  { id: 'distantSpell', label: 'Distant Spell (1 SP) — double a spell\'s range, or make a Touch spell\'s range 30 ft', source: src(141) },
  { id: 'empoweredSpell', label: 'Empowered Spell (1 SP) — reroll a number of damage dice up to your Charisma modifier', source: src(141) },
  { id: 'extendedSpell', label: 'Extended Spell (1 SP) — double a 1-minute+ spell\'s duration, up to 24 hours', source: src(141) },
  { id: 'heightenedSpell', label: 'Heightened Spell (2 SP) — give one target Disadvantage on its save against your spell', source: src(142) },
  { id: 'quickenedSpell', label: 'Quickened Spell (2 SP) — cast an Action-cost spell as a Bonus Action instead', source: src(142) },
  { id: 'seekingSpell', label: 'Seeking Spell (1 SP) — reroll a missed spell attack roll', source: src(142) },
  { id: 'subtleSpell', label: 'Subtle Spell (1 SP) — cast without Verbal or Somatic components', source: src(142) },
  { id: 'transmutedSpell', label: 'Transmuted Spell (1 SP) — change a spell\'s damage type among Acid/Cold/Fire/Lightning/Poison/Thunder', source: src(142) },
  { id: 'twinnedSpell', label: 'Twinned Spell (1 SP) — increase a multi-target-scaling spell\'s effective level by 1', source: src(142) },
]

export const sorcererChoiceOptions: Record<string, ChoiceOptionDefinition> = Object.fromEntries(
  metamagicOptions.map((o) => [o.id, o]),
)

export const sorcererChoices: Record<string, ChoiceDefinition> = {
  'sorcerer-metamagic-choice': {
    id: 'sorcerer-metamagic-choice',
    label: 'Metamagic',
    mode: 'multiple',
    // 2 options at level 2, 2 more (4 total) at level 10, 2 more (6 total) at 17.
    minimumSelections: { kind: 'levelTable', table: { 2: 2, 10: 4, 17: 6 } },
    maximumSelections: { kind: 'levelTable', table: { 2: 2, 10: 4, 17: 6 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: metamagicOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onLevelUp', maxReplacements: 'unlimited' }],
    source: src(140),
  },
  'sorcerer-asi-choice': {
    id: 'sorcerer-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(140),
  },
}

export const sorcererResources: Record<string, ResourceDefinition> = {
  sorceryPoints: {
    id: 'sorceryPoints',
    name: 'Sorcery Points',
    minimumLevel: 2,
    // Equals your Sorcerer level exactly, for levels 2-20 (never evaluated
    // below level 2, since that's this resource's minimumLevel).
    maximum: { kind: 'derived', base: 'classLevel', multiplier: 1, rounding: 'down' },
    refresh: { default: ['longRest'] },
    source: src(140),
  },
  innateSorcery: {
    id: 'innateSorcery',
    name: 'Innate Sorcery',
    minimumLevel: 1,
    maximum: { kind: 'flat', value: 2 },
    refresh: { default: ['longRest'] },
    source: src(139),
  },
  sorcerousRestoration: {
    id: 'sorcerousRestoration',
    name: 'Sorcerous Restoration',
    minimumLevel: 5,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(140),
  },
}

export const sorcererFeatures: Record<string, FeatureDefinition> = {
  'sorcerer-spellcasting': {
    id: 'sorcerer-spellcasting',
    name: 'Spellcasting',
    source: src(139),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Cast Sorcerer spells using Charisma. Know a growing list of prepared spells (swap one whenever you gain a level) and spend spell slots (Long Rest to recover) to cast them; cantrips need no slot.',
  },
  'sorcerer-innate-sorcery': {
    id: 'sorcerer-innate-sorcery',
    name: 'Innate Sorcery',
    source: src(139),
    minimumLevel: 1,
    activation: 'bonusAction',
    resourceId: 'innateSorcery',
    summary: 'For 1 minute, your Sorcerer spell save DC increases by 1 and you have Advantage on Sorcerer spell attack rolls. Usable twice; regain both uses on a Long Rest.',
  },
  'sorcerer-font-of-magic': {
    id: 'sorcerer-font-of-magic',
    name: 'Font of Magic',
    source: src(140),
    minimumLevel: 2,
    activation: 'passive',
    summary:
      'Gain Sorcery Points (see the Sorcery Points resource), refilling on a Long Rest. Convert a spell slot into Sorcery Points equal to its level (no action) or, as a Bonus Action, spend Sorcery Points to create a spell slot of level 1-5 (costs 2/3/5/6/7 SP, requiring Sorcerer level 2/3/5/7/9). Created slots vanish on a Long Rest. Not mechanically tracked as an action in this app — apply the point/slot math manually.',
  },
  'sorcerer-metamagic': {
    id: 'sorcerer-metamagic',
    name: 'Metamagic',
    source: src(140),
    minimumLevel: 2,
    activation: 'passive',
    summary: 'Choose Metamagic options (2 at level 2, 2 more at level 10, 2 more at level 17) to modify spells you cast for a Sorcery Point cost. Replace one option whenever you gain a Sorcerer level.',
    choices: ['sorcerer-metamagic-choice'],
  },
  'sorcerer-asi': {
    id: 'sorcerer-asi',
    name: 'Ability Score Improvement',
    source: src(140),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Sorcerer levels 8, 12, and 16.',
    choices: ['sorcerer-asi-choice'],
  },
  'sorcerer-sorcerous-restoration': {
    id: 'sorcerer-sorcerous-restoration',
    name: 'Sorcerous Restoration',
    source: src(140),
    minimumLevel: 5,
    activation: 'special',
    resourceId: 'sorcerousRestoration',
    summary: 'On finishing a Short Rest, regain expended Sorcery Points up to half your Sorcerer level (round down). Once per Long Rest.',
  },
  'sorcerer-sorcery-incarnate': {
    id: 'sorcerer-sorcery-incarnate',
    name: 'Sorcery Incarnate',
    source: src(140),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'If out of Innate Sorcery uses, spend 2 Sorcery Points to activate it anyway. While Innate Sorcery is active, you can use up to two Metamagic options on each spell you cast.',
  },
  'sorcerer-epic-boon': {
    id: 'sorcerer-epic-boon',
    name: 'Epic Boon',
    source: src(140),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Dimensional Travel is recommended.',
  },
  'sorcerer-arcane-apotheosis': {
    id: 'sorcerer-arcane-apotheosis',
    name: 'Arcane Apotheosis',
    source: src(140),
    minimumLevel: 20,
    activation: 'passive',
    summary: 'While Innate Sorcery is active, use one Metamagic option on each of your turns without spending Sorcery Points on it.',
  },
}
