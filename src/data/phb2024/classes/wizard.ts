import type { ChoiceDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition, SpellcastingDefinition } from '../../../domain/types'
import { GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// Wizard Features table, PHB 2024 p.166 — re-verified via pdftotext -table
// mode after -layout/-raw both scrambled this table's columns.
export const wizardSpellcasting: SpellcastingDefinition = {
  ability: 'Intelligence',
  slotProgression: 'full',
  cantripProgression: { 1: 3, 4: 4, 10: 5 },
  preparedSource: 'spellbook',
  // 6 spells at level 1, +2 per level after (2xlevel+4 == 6 + 2x(level-1)).
  spellbookGrowthFormula: { kind: 'derived', base: 'classLevel', multiplier: 2, rounding: 'down', addend: 4 },
  preparedCountFormula: {
    kind: 'levelTable',
    table: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 18, 15: 19, 16: 21, 17: 22, 18: 23, 19: 24, 20: 25 },
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
  ritualCasting: { fromSpellbookOnly: true, requiresPreparation: false },
  spellListId: 'wizard',
  source: src(166),
}

export const wizardClass: ClassDefinition = {
  id: 'wizard',
  name: 'Wizard',
  source: src(164),
  primaryAbilities: ['Intelligence'],
  hitDie: 6,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['wizard-spellcasting', 'wizard-ritual-adept', 'wizard-arcane-recovery'],
    2: ['wizard-scholar'],
    3: [],
    4: ['wizard-asi'],
    5: ['wizard-memorize-spell'],
    6: [],
    7: [],
    8: ['wizard-asi'],
    9: [],
    10: [],
    11: [],
    12: ['wizard-asi'],
    13: [],
    14: [],
    15: [],
    16: ['wizard-asi'],
    17: [],
    18: ['wizard-spell-mastery'],
    19: ['wizard-epic-boon'],
    20: ['wizard-signature-spells'],
  },
  resources: ['arcaneRecovery'],
  spellcasting: wizardSpellcasting,
  choiceIds: ['wizard-scholar-choice', 'wizard-asi-choice'],
}

export const wizardResources: Record<string, ResourceDefinition> = {
  arcaneRecovery: {
    id: 'arcaneRecovery',
    name: 'Arcane Recovery',
    minimumLevel: 1,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(165),
  },
}

const SCHOLAR_SKILLS = ['Arcana', 'History', 'Investigation', 'Medicine', 'Nature', 'Religion']

export const wizardChoices: Record<string, ChoiceDefinition> = {
  'wizard-scholar-choice': {
    id: 'wizard-scholar-choice',
    label: 'Scholar: choose a skill for Expertise',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: SCHOLAR_SKILLS.map((s) => `skill-${s.toLowerCase()}`),
    source: src(166),
  },
  'wizard-asi-choice': {
    id: 'wizard-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    // Wizard gets this pick 4 times (levels 4, 8, 12, 16) — the standard
    // pattern, unlike Fighter's extra picks at 6/14.
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(166),
  },
}

export const wizardFeatures: Record<string, FeatureDefinition> = {
  'wizard-spellcasting': {
    id: 'wizard-spellcasting',
    name: 'Spellcasting',
    source: src(164),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Cast spells from your spellbook using Intelligence. Know 3 cantrips (4 at level 4, 5 at level 10). Spellbook starts with 6 level 1 spells; add 2 more Wizard spells per level gained. Prepare a growing subset from the spellbook; swap the full list on a Long Rest.',
  },
  'wizard-ritual-adept': {
    id: 'wizard-ritual-adept',
    name: 'Ritual Adept',
    source: src(165),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Cast any Ritual-tagged spell in your spellbook as a Ritual without preparing it, as long as you read from the book.',
  },
  'wizard-arcane-recovery': {
    id: 'wizard-arcane-recovery',
    name: 'Arcane Recovery',
    source: src(165),
    minimumLevel: 1,
    activation: 'special',
    summary: 'Once per Long Rest, after a Short Rest, recover expended spell slots with a combined level up to half your Wizard level (round up), none level 6+.',
    resourceId: 'arcaneRecovery',
  },
  'wizard-scholar': {
    id: 'wizard-scholar',
    name: 'Scholar',
    source: src(166),
    minimumLevel: 2,
    activation: 'passive',
    summary: 'Gain Expertise in one skill: Arcana, History, Investigation, Medicine, Nature, or Religion.',
    choices: ['wizard-scholar-choice'],
  },
  'wizard-asi': {
    id: 'wizard-asi',
    name: 'Ability Score Improvement',
    source: src(166),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Wizard levels 8, 12, and 16.',
    choices: ['wizard-asi-choice'],
  },
  'wizard-memorize-spell': {
    id: 'wizard-memorize-spell',
    name: 'Memorize Spell',
    source: src(166),
    minimumLevel: 5,
    activation: 'special',
    summary: 'Whenever you finish a Short Rest, you can replace one prepared level 1+ spell with another from your spellbook.',
  },
  'wizard-spell-mastery': {
    id: 'wizard-spell-mastery',
    name: 'Spell Mastery',
    source: src(166),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'Choose a level 1 and a level 2 spellbook spell (action casting time); always prepared, castable at their lowest level without a slot.',
  },
  'wizard-epic-boon': {
    id: 'wizard-epic-boon',
    name: 'Epic Boon',
    source: src(166),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Spell Recall is recommended.',
  },
  'wizard-signature-spells': {
    id: 'wizard-signature-spells',
    name: 'Signature Spells',
    source: src(166),
    minimumLevel: 20,
    activation: 'passive',
    summary: 'Choose two level 3 spellbook spells as signature spells; always prepared, each castable once at level 3 for free per Short/Long Rest.',
  },
}
