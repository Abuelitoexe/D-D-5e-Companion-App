import type { ChoiceDefinition, ChoiceOptionDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition, SpellcastingDefinition } from '../../../domain/types'
import { weapons } from '../equipment'
import { FIGHTING_STYLE_FEAT_IDS, GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.118-120 — Core Ranger Traits + Ranger Features table, parsed
// cleanly under -table mode. Slot table and Prepared Spells table are
// byte-for-byte identical to Paladin's — the standard half-caster shape,
// also starting at level 1 (not level 2) under 2024 rules.
export const rangerSpellcasting: SpellcastingDefinition = {
  ability: 'Wisdom',
  slotProgression: 'half',
  preparedSource: 'classListFull',
  preparedCountFormula: {
    kind: 'levelTable',
    table: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 7, 9: 9, 10: 9, 11: 10, 12: 10, 13: 11, 14: 11, 15: 12, 16: 12, 17: 14, 18: 14, 19: 15, 20: 15 },
  },
  // Swap ONE spell per Long Rest — same shape as Paladin.
  swapPolicy: { timing: ['onLongRest'], count: 1 },
  slotTable: {
    1: { 1: 2 },
    2: { 1: 2 },
    3: { 1: 3 },
    4: { 1: 3 },
    5: { 1: 4, 2: 2 },
    6: { 1: 4, 2: 2 },
    7: { 1: 4, 2: 3 },
    8: { 1: 4, 2: 3 },
    9: { 1: 4, 2: 3, 3: 2 },
    10: { 1: 4, 2: 3, 3: 2 },
    11: { 1: 4, 2: 3, 3: 3 },
    12: { 1: 4, 2: 3, 3: 3 },
    13: { 1: 4, 2: 3, 3: 3, 4: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 2 },
    16: { 1: 4, 2: 3, 3: 3, 4: 2 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  },
  spellListId: 'ranger',
  source: src(118),
}

export const rangerClass: ClassDefinition = {
  id: 'ranger',
  name: 'Ranger',
  source: src(118),
  primaryAbilities: ['Dexterity', 'Wisdom'],
  hitDie: 10,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['ranger-spellcasting', 'ranger-favored-enemy', 'ranger-weapon-mastery'],
    2: ['ranger-deft-explorer', 'ranger-fighting-style'],
    3: [],
    4: ['ranger-asi'],
    5: ['ranger-extra-attack'],
    6: ['ranger-roving'],
    7: [],
    8: ['ranger-asi'],
    9: ['ranger-expertise'],
    10: ['ranger-tireless'],
    11: [],
    12: ['ranger-asi'],
    13: ['ranger-relentless-hunter'],
    14: ['ranger-natures-veil'],
    15: [],
    16: ['ranger-asi'],
    17: ['ranger-precise-hunter'],
    18: ['ranger-feral-senses'],
    19: ['ranger-epic-boon'],
    20: ['ranger-foe-slayer'],
  },
  resources: ['favoredEnemy', 'rangerTireless', 'rangerNaturesVeil'],
  spellcasting: rangerSpellcasting,
  choiceIds: ['ranger-weapon-mastery-choice', 'ranger-fighting-style-choice', 'ranger-asi-choice', 'ranger-expertise-choice'],
}

const weaponMasteryOptions: ChoiceOptionDefinition[] = Object.values(weapons).map((weapon) => ({
  id: `weapon-mastery-${weapon.id}`,
  label: weapon.name,
  source: weapon.source,
}))

const druidicWarriorOption: ChoiceOptionDefinition = {
  id: 'druidicWarrior',
  label: 'Druidic Warrior — learn 2 Druid cantrips (Wisdom-based) instead of a Fighting Style; replace one on level-up',
  source: src(119),
}

const ALL_SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
  'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
  'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival',
]
const skillOptionId = (skill: string) => `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`

export const rangerChoiceOptions: Record<string, ChoiceOptionDefinition> = {
  ...Object.fromEntries(weaponMasteryOptions.map((o) => [o.id, o])),
  druidicWarrior: druidicWarriorOption,
}

export const rangerChoices: Record<string, ChoiceDefinition> = {
  'ranger-weapon-mastery-choice': {
    id: 'ranger-weapon-mastery-choice',
    label: 'Weapon Mastery',
    mode: 'multiple',
    minimumSelections: { kind: 'flat', value: 2 },
    maximumSelections: { kind: 'flat', value: 2 },
    required: true,
    timing: ['characterCreation', 'onLongRest'],
    optionIds: weaponMasteryOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onLongRest', maxReplacements: 'unlimited' }],
    source: src(119),
  },
  'ranger-fighting-style-choice': {
    id: 'ranger-fighting-style-choice',
    label: 'Fighting Style',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['onLevelUp'],
    optionIds: [...FIGHTING_STYLE_FEAT_IDS, 'druidicWarrior'],
    // No replacementPolicies — permanent once chosen.
    source: src(119),
  },
  // Deft Explorer (level 2, 1 skill) and Expertise (level 9, +2 more) are two
  // different named features that grant the SAME growing choice — the exact
  // pattern already proven by Rogue/Bard Expertise, just split across two
  // feature ids instead of one reused id.
  'ranger-expertise-choice': {
    id: 'ranger-expertise-choice',
    label: 'Expertise',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 2: 1, 9: 3 } },
    maximumSelections: { kind: 'levelTable', table: { 2: 1, 9: 3 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: ALL_SKILLS.map(skillOptionId),
    // No replacementPolicies — Expertise picks are permanent once made.
    source: src(119),
  },
  'ranger-asi-choice': {
    id: 'ranger-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(120),
  },
}

export const rangerResources: Record<string, ResourceDefinition> = {
  favoredEnemy: {
    id: 'favoredEnemy',
    name: 'Favored Enemy (free Hunter\'s Mark)',
    minimumLevel: 1,
    maximum: { kind: 'levelTable', table: { 1: 2, 5: 3, 9: 4, 13: 5, 17: 6 } },
    refresh: { default: ['longRest'] },
    source: src(118),
  },
  rangerTireless: {
    id: 'rangerTireless',
    name: 'Tireless (Temporary HP)',
    minimumLevel: 10,
    maximum: { kind: 'abilityModifier', ability: 'Wisdom', minimum: 1 },
    refresh: { default: ['longRest'] },
    source: src(120),
  },
  rangerNaturesVeil: {
    id: 'rangerNaturesVeil',
    name: "Nature's Veil",
    minimumLevel: 14,
    maximum: { kind: 'abilityModifier', ability: 'Wisdom', minimum: 1 },
    refresh: { default: ['longRest'] },
    source: src(120),
  },
}

export const rangerFeatures: Record<string, FeatureDefinition> = {
  'ranger-spellcasting': {
    id: 'ranger-spellcasting',
    name: 'Spellcasting',
    source: src(118),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Cast Ranger spells using Wisdom, preparing directly from the full Ranger list (no known-list, no cantrips). Swap one prepared spell whenever you finish a Long Rest. Slots recover on a Long Rest.',
  },
  'ranger-favored-enemy': {
    id: 'ranger-favored-enemy',
    name: 'Favored Enemy',
    source: src(118),
    minimumLevel: 1,
    activation: 'special',
    resourceId: 'favoredEnemy',
    summary: "Always have Hunter's Mark prepared; cast it without a slot 2 times (growing to 3/4/5/6 at levels 5/9/13/17). All uses return on a Long Rest.",
  },
  'ranger-weapon-mastery': {
    id: 'ranger-weapon-mastery',
    name: 'Weapon Mastery',
    source: src(119),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Use the mastery properties of 2 weapon kinds you have proficiency with. Change your choices whenever you finish a Long Rest.',
    choices: ['ranger-weapon-mastery-choice'],
  },
  'ranger-deft-explorer': {
    id: 'ranger-deft-explorer',
    name: 'Deft Explorer',
    source: src(119),
    minimumLevel: 2,
    activation: 'passive',
    summary: 'Gain Expertise in 1 skill proficiency you lack it in. Also learn 2 languages of your choice (not tracked — this app has no language system).',
    choices: ['ranger-expertise-choice'],
  },
  'ranger-fighting-style': {
    id: 'ranger-fighting-style',
    name: 'Fighting Style',
    source: src(119),
    minimumLevel: 2,
    activation: 'passive',
    summary: 'Gain a Fighting Style feat, or choose Druidic Warrior (learn 2 Druid cantrips, Wisdom-based, replaceable on level-up) instead.',
    choices: ['ranger-fighting-style-choice'],
  },
  'ranger-asi': {
    id: 'ranger-asi',
    name: 'Ability Score Improvement',
    source: src(120),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Ranger levels 8, 12, and 16.',
    choices: ['ranger-asi-choice'],
  },
  'ranger-extra-attack': {
    id: 'ranger-extra-attack',
    name: 'Extra Attack',
    source: src(119),
    minimumLevel: 5,
    activation: 'passive',
    summary: 'Attack twice, instead of once, whenever you take the Attack action on your turn.',
  },
  'ranger-roving': {
    id: 'ranger-roving',
    name: 'Roving',
    source: src(120),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Speed +10 ft while not wearing Heavy armor; gain a Climb Speed and Swim Speed equal to your Speed.',
  },
  'ranger-expertise': {
    id: 'ranger-expertise',
    name: 'Expertise',
    source: src(120),
    minimumLevel: 9,
    activation: 'passive',
    summary: 'Gain Expertise in 2 more skill proficiencies you lack it in (3 total, counting Deft Explorer\'s pick).',
    choices: ['ranger-expertise-choice'],
  },
  'ranger-tireless': {
    id: 'ranger-tireless',
    name: 'Tireless',
    source: src(120),
    minimumLevel: 10,
    activation: 'special',
    resourceId: 'rangerTireless',
    summary: 'As a Magic action, gain 1d8 + Wisdom modifier (min 1) Temporary HP. Uses = Wisdom modifier (min 1), refilling on a Long Rest. Also: on finishing a Short Rest, reduce your Exhaustion level by 1 (not tracked — this app has no Exhaustion system).',
  },
  'ranger-relentless-hunter': {
    id: 'ranger-relentless-hunter',
    name: 'Relentless Hunter',
    source: src(120),
    minimumLevel: 13,
    activation: 'passive',
    summary: "Taking damage can't break your Concentration on Hunter's Mark.",
  },
  'ranger-natures-veil': {
    id: 'ranger-natures-veil',
    name: "Nature's Veil",
    source: src(120),
    minimumLevel: 14,
    activation: 'bonusAction',
    resourceId: 'rangerNaturesVeil',
    summary: 'Gain the Invisible condition until the end of your next turn. Uses = Wisdom modifier (min 1), refilling on a Long Rest.',
  },
  'ranger-precise-hunter': {
    id: 'ranger-precise-hunter',
    name: 'Precise Hunter',
    source: src(120),
    minimumLevel: 17,
    activation: 'passive',
    summary: "Advantage on attack rolls against the creature currently marked by your Hunter's Mark.",
  },
  'ranger-feral-senses': {
    id: 'ranger-feral-senses',
    name: 'Feral Senses',
    source: src(120),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'Gain Blindsight with a range of 30 feet.',
  },
  'ranger-epic-boon': {
    id: 'ranger-epic-boon',
    name: 'Epic Boon',
    source: src(120),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Dimensional Travel is recommended.',
  },
  'ranger-foe-slayer': {
    id: 'ranger-foe-slayer',
    name: 'Foe Slayer',
    source: src(120),
    minimumLevel: 20,
    activation: 'passive',
    summary: "Hunter's Mark's damage die becomes a d10 instead of a d6 (not auto-applied — the spell's own die size isn't tracked mechanically).",
  },
}
