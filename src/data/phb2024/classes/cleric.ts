import type { ChoiceDefinition, ChoiceOptionDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition, SpellcastingDefinition } from '../../../domain/types'
import { GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.68-70 — Core Cleric Traits + Cleric Features table. The dense
// multi-column table scrambled badly under both -table and -layout (numeric
// columns bled across adjacent rows); Cantrips (3/4/5 at 1/4/10) and Prepared
// Spells (4 at level 1, 6 at level 3) were instead confirmed directly from
// prose worked examples on p.68, and — since those two confirmed values are
// an exact match — the Prepared Spells table reuses Wizard's already-verified
// levelTable (both are the same "prepare from the full list" full-caster
// shape). Channel Divinity's growth (2/3/4 at 2/6/18) was cross-checked
// between two independent extraction passes (-table and -layout) that
// disagreed on every other column but agreed on where the Channel Divinity
// column's own value transitions fell.
export const clericSpellcasting: SpellcastingDefinition = {
  ability: 'Wisdom',
  slotProgression: 'full',
  cantripProgression: { 1: 3, 4: 4, 10: 5 },
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
  spellListId: 'cleric',
  source: src(69),
}

export const clericClass: ClassDefinition = {
  id: 'cleric',
  name: 'Cleric',
  source: src(68),
  primaryAbilities: ['Wisdom'],
  hitDie: 8,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['cleric-spellcasting', 'cleric-divine-order'],
    2: ['cleric-channel-divinity'],
    3: [],
    4: ['cleric-asi'],
    5: ['cleric-sear-undead'],
    6: [],
    7: ['cleric-blessed-strikes'],
    8: ['cleric-asi'],
    9: [],
    10: ['cleric-divine-intervention'],
    11: [],
    12: ['cleric-asi'],
    13: [],
    14: ['cleric-improved-blessed-strikes'],
    15: [],
    16: ['cleric-asi'],
    17: [],
    18: [],
    19: ['cleric-epic-boon'],
    20: ['cleric-greater-divine-intervention'],
  },
  resources: ['channelDivinity'],
  spellcasting: clericSpellcasting,
  choiceIds: ['cleric-divine-order-choice', 'cleric-asi-choice'],
}

const divineOrderOptions: ChoiceOptionDefinition[] = [
  { id: 'divineOrder-protector', label: 'Protector — Martial weapon proficiency and Heavy armor training', source: src(69) },
  { id: 'divineOrder-thaumaturge', label: 'Thaumaturge — 1 extra cantrip, and a Wisdom-modifier bonus to Intelligence (Arcana or Religion) checks', source: src(69) },
]

export const clericChoiceOptions: Record<string, ChoiceOptionDefinition> = Object.fromEntries(
  divineOrderOptions.map((o) => [o.id, o]),
)

export const clericChoices: Record<string, ChoiceDefinition> = {
  'cleric-divine-order-choice': {
    id: 'cleric-divine-order-choice',
    label: 'Divine Order',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: divineOrderOptions.map((o) => o.id),
    // No replacementPolicies — permanent once chosen.
    source: src(69),
  },
  'cleric-asi-choice': {
    id: 'cleric-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(70),
  },
}

export const clericResources: Record<string, ResourceDefinition> = {
  channelDivinity: {
    id: 'channelDivinity',
    name: 'Channel Divinity',
    minimumLevel: 2,
    maximum: { kind: 'levelTable', table: { 2: 2, 6: 3, 18: 4 } },
    refresh: { default: ['shortRest', 'longRest'] },
    partialRefresh: { shortRest: { kind: 'flat', value: 1 } },
    source: src(69),
  },
}

export const clericFeatures: Record<string, FeatureDefinition> = {
  'cleric-spellcasting': {
    id: 'cleric-spellcasting',
    name: 'Spellcasting',
    source: src(68),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Cast Cleric spells using Wisdom, preparing directly from the full Cleric spell list (no discrete known-list). Change your entire prepared list whenever you finish a Long Rest. Cantrips need no slot; slots recover on a Long Rest.',
  },
  'cleric-divine-order': {
    id: 'cleric-divine-order',
    name: 'Divine Order',
    source: src(69),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Choose Protector (Martial weapon proficiency + Heavy armor training) or Thaumaturge (1 extra cantrip + Wisdom-modifier bonus to Intelligence (Arcana or Religion) checks).',
    choices: ['cleric-divine-order-choice'],
  },
  'cleric-channel-divinity': {
    id: 'cleric-channel-divinity',
    name: 'Channel Divinity',
    source: src(69),
    minimumLevel: 2,
    activation: 'special',
    resourceId: 'channelDivinity',
    summary:
      'Channel divine energy to fuel Divine Spark (Magic action: 1d8 + Wisdom modifier Radiant/Necrotic damage or healing, extra d8s at Cleric levels 7/13/18) or Turn Undead (Magic action: Undead within 30 ft Wisdom save or Frightened+Incapacitated for 1 minute). Uses grow to 3 at level 6, 4 at level 18; regain 1 on a Short Rest, all on a Long Rest.',
  },
  'cleric-asi': {
    id: 'cleric-asi',
    name: 'Ability Score Improvement',
    source: src(70),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Cleric levels 8, 12, and 16.',
    choices: ['cleric-asi-choice'],
  },
  'cleric-sear-undead': {
    id: 'cleric-sear-undead',
    name: 'Sear Undead',
    source: src(70),
    minimumLevel: 5,
    activation: 'passive',
    summary: 'Whenever you use Turn Undead, Undead that fail their save also take Radiant damage equal to a number of d8s equal to your Wisdom modifier (minimum 1d8).',
  },
  'cleric-blessed-strikes': {
    id: 'cleric-blessed-strikes',
    name: 'Blessed Strikes',
    source: src(70),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'Choose Divine Strike (once per turn, a weapon hit deals an extra 1d8 Necrotic or Radiant damage) or Potent Spellcasting (add Wisdom modifier to Cleric cantrip damage).',
  },
  'cleric-divine-intervention': {
    id: 'cleric-divine-intervention',
    name: 'Divine Intervention',
    source: src(70),
    minimumLevel: 10,
    activation: 'special',
    summary: 'As a Magic action, cast any Cleric spell of level 5 or lower (no Reaction casting time) without a slot or Material components. Once per Long Rest.',
  },
  'cleric-improved-blessed-strikes': {
    id: 'cleric-improved-blessed-strikes',
    name: 'Improved Blessed Strikes',
    source: src(70),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'Divine Strike\'s extra damage increases to 2d8; Potent Spellcasting also grants Temporary HP (twice your Wisdom modifier) to yourself or a creature within 60 ft when a Cleric cantrip damages a target.',
  },
  'cleric-epic-boon': {
    id: 'cleric-epic-boon',
    name: 'Epic Boon',
    source: src(70),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Fate is recommended.',
  },
  'cleric-greater-divine-intervention': {
    id: 'cleric-greater-divine-intervention',
    name: 'Greater Divine Intervention',
    source: src(70),
    minimumLevel: 20,
    activation: 'passive',
    summary: 'Divine Intervention can now choose Wish; doing so locks out Divine Intervention until you finish 2d4 Long Rests.',
  },
}
