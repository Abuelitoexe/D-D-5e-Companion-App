import type { ChoiceDefinition, ChoiceOptionDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition, SpellcastingDefinition } from '../../../domain/types'
import { GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.78-81 — Core Druid Traits + Druid Features table. Prepared
// Spells reuses the same shared full-caster table confirmed for Wizard,
// Cleric, and Bard (level 1 = 4, level 3 = 6 confirmed directly from prose
// worked examples on p.78, a fourth independent match).
export const druidSpellcasting: SpellcastingDefinition = {
  ability: 'Wisdom',
  slotProgression: 'full',
  cantripProgression: { 1: 2, 4: 3, 10: 4 },
  preparedSource: 'classListFull',
  preparedCountFormula: {
    kind: 'levelTable',
    table: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
  },
  swapPolicy: { timing: ['onLongRest'], count: 'all' },
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
  spellListId: 'druid',
  source: src(79),
}

export const druidClass: ClassDefinition = {
  id: 'druid',
  name: 'Druid',
  source: src(78),
  primaryAbilities: ['Wisdom'],
  hitDie: 8,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['druid-druidic', 'druid-primal-order', 'druid-spellcasting'],
    2: ['druid-wild-shape', 'druid-wild-companion'],
    3: [],
    4: ['druid-asi'],
    5: ['druid-wild-resurgence'],
    6: [],
    7: ['druid-elemental-fury'],
    8: ['druid-asi'],
    9: [],
    10: [],
    11: [],
    12: ['druid-asi'],
    13: [],
    14: [],
    15: ['druid-improved-elemental-fury'],
    16: ['druid-asi'],
    17: [],
    18: ['druid-beast-spells'],
    19: ['druid-epic-boon'],
    20: ['druid-archdruid'],
  },
  resources: ['wildShape'],
  spellcasting: druidSpellcasting,
  choiceIds: ['druid-primal-order-choice', 'druid-asi-choice'],
}

const primalOrderOptions: ChoiceOptionDefinition[] = [
  { id: 'primalOrder-magician', label: 'Magician — 1 extra cantrip, and a Wisdom-modifier bonus to Intelligence (Arcana or Nature) checks', source: src(79) },
  { id: 'primalOrder-warden', label: 'Warden — Martial weapon proficiency and Medium armor training', source: src(79) },
]

export const druidChoiceOptions: Record<string, ChoiceOptionDefinition> = Object.fromEntries(
  primalOrderOptions.map((o) => [o.id, o]),
)

export const druidChoices: Record<string, ChoiceDefinition> = {
  'druid-primal-order-choice': {
    id: 'druid-primal-order-choice',
    label: 'Primal Order',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: primalOrderOptions.map((o) => o.id),
    // No replacementPolicies — permanent once chosen.
    source: src(79),
  },
  'druid-asi-choice': {
    id: 'druid-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(80),
  },
}

export const druidResources: Record<string, ResourceDefinition> = {
  wildShape: {
    id: 'wildShape',
    name: 'Wild Shape',
    minimumLevel: 2,
    maximum: { kind: 'levelTable', table: { 2: 2, 6: 3, 17: 4 } },
    refresh: { default: ['shortRest', 'longRest'] },
    partialRefresh: { shortRest: { kind: 'flat', value: 1 } },
    source: src(79),
  },
}

export const druidFeatures: Record<string, FeatureDefinition> = {
  'druid-druidic': {
    id: 'druid-druidic',
    name: 'Druidic',
    source: src(79),
    minimumLevel: 1,
    activation: 'passive',
    summary: "Know Druidic (the secret Druid language) and always have Speak with Animals prepared. Use Druidic to hide messages other Druids can spot. (Speak with Animals is not yet in the spell registry — description only.)",
  },
  'druid-primal-order': {
    id: 'druid-primal-order',
    name: 'Primal Order',
    source: src(79),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Choose Magician (1 extra cantrip + Wisdom-modifier bonus to Intelligence (Arcana or Nature) checks) or Warden (Martial weapon proficiency + Medium armor training).',
    choices: ['druid-primal-order-choice'],
  },
  'druid-spellcasting': {
    id: 'druid-spellcasting',
    name: 'Spellcasting',
    source: src(78),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Cast Druid spells using Wisdom, preparing directly from the full Druid spell list (no discrete known-list). Change your entire prepared list whenever you finish a Long Rest. Cantrips need no slot; slots recover on a Long Rest.',
  },
  'druid-wild-shape': {
    id: 'druid-wild-shape',
    name: 'Wild Shape',
    source: src(79),
    minimumLevel: 2,
    activation: 'bonusAction',
    resourceId: 'wildShape',
    summary:
      "Shape-shift into a Beast form you know for hours equal to half your Druid level (or until you leave it, are Incapacitated, or die); leaving early is also a Bonus Action. You know 4 Beast forms (CR ≤1/4, no Fly Speed), growing to 6 forms/CR 1/2 at level 4 and 8 forms/Fly Speed allowed at level 8 — replace one known form on any Long Rest. Regain 1 use per Short Rest, all uses per Long Rest. (Beast stat blocks aren't modeled — track the transformation narratively.)",
  },
  'druid-wild-companion': {
    id: 'druid-wild-companion',
    name: 'Wild Companion',
    source: src(80),
    minimumLevel: 2,
    activation: 'special',
    summary: 'As a Magic action, expend a spell slot or a Wild Shape use to cast Find Familiar without Material components; the familiar is Fey and vanishes on your next Long Rest.',
  },
  'druid-asi': {
    id: 'druid-asi',
    name: 'Ability Score Improvement',
    source: src(80),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Druid levels 8, 12, and 16.',
    choices: ['druid-asi-choice'],
  },
  'druid-wild-resurgence': {
    id: 'druid-wild-resurgence',
    name: 'Wild Resurgence',
    source: src(80),
    minimumLevel: 5,
    activation: 'passive',
    summary: "Once per turn, if you have no Wild Shape uses left, expend a spell slot (no action) to gain one. Once per Long Rest, you can also expend a Wild Shape use (no action) to gain a level 1 spell slot.",
  },
  'druid-elemental-fury': {
    id: 'druid-elemental-fury',
    name: 'Elemental Fury',
    source: src(80),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'Choose Potent Spellcasting (add Wisdom modifier to Druid cantrip damage) or Primal Strike (once per turn, a weapon or Wild Shape attack hit deals an extra 1d8 Cold/Fire/Lightning/Thunder damage, your choice).',
  },
  'druid-improved-elemental-fury': {
    id: 'druid-improved-elemental-fury',
    name: 'Improved Elemental Fury',
    source: src(80),
    minimumLevel: 15,
    activation: 'passive',
    summary: 'Potent Spellcasting: a Druid cantrip with range 10+ ft gets +300 ft range. Primal Strike: extra damage increases to 2d8.',
  },
  'druid-beast-spells': {
    id: 'druid-beast-spells',
    name: 'Beast Spells',
    source: src(81),
    minimumLevel: 18,
    activation: 'passive',
    summary: "Cast spells while in Wild Shape, except those with a costly or consumed Material component.",
  },
  'druid-epic-boon': {
    id: 'druid-epic-boon',
    name: 'Epic Boon',
    source: src(80),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Dimensional Travel is recommended.',
  },
  'druid-archdruid': {
    id: 'druid-archdruid',
    name: 'Archdruid',
    source: src(81),
    minimumLevel: 20,
    activation: 'passive',
    summary: 'Evergreen Wild Shape: regain 1 Wild Shape use when you roll Initiative with none left. Nature Magician: once per Long Rest, convert unexpended Wild Shape uses into one spell slot (2 spell levels per use, no action required).',
  },
}
