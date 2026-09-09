import type { ChoiceDefinition, ChoiceOptionDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition, SpellcastingDefinition } from '../../../domain/types'
import { weapons } from '../equipment'
import { FIGHTING_STYLE_FEAT_IDS, GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.108-111 — Core Paladin Traits + Paladin Features table, parsed
// cleanly under -table mode. A genuine 2024 rules change from prior
// editions: Paladin gets Spellcasting (2 prepared spells, 2 level-1 slots)
// starting at level 1, not level 2 — confirmed directly from prose, not
// assumed from memory. No cantrips at all (no Cantrips column exists).
export const paladinSpellcasting: SpellcastingDefinition = {
  ability: 'Charisma',
  slotProgression: 'half',
  preparedSource: 'classListFull',
  preparedCountFormula: {
    kind: 'levelTable',
    table: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 7, 9: 9, 10: 9, 11: 10, 12: 10, 13: 11, 14: 11, 15: 12, 16: 12, 17: 14, 18: 14, 19: 15, 20: 15 },
  },
  // Swap ONE spell per Long Rest — a third distinct swapPolicy shape
  // (Wizard/Cleric/Druid swap ALL on Long Rest; Bard/Sorcerer/Warlock swap
  // ONE per level-up; Paladin/Ranger swap ONE per Long Rest).
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
  spellListId: 'paladin',
  source: src(108),
}

export const paladinClass: ClassDefinition = {
  id: 'paladin',
  name: 'Paladin',
  source: src(108),
  primaryAbilities: ['Strength', 'Charisma'],
  hitDie: 10,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['paladin-lay-on-hands', 'paladin-spellcasting', 'paladin-weapon-mastery'],
    2: ['paladin-fighting-style', 'paladin-paladins-smite'],
    3: ['paladin-channel-divinity'],
    4: ['paladin-asi'],
    5: ['paladin-extra-attack', 'paladin-faithful-steed'],
    6: ['paladin-aura-of-protection'],
    7: [],
    8: ['paladin-asi'],
    9: ['paladin-abjure-foes'],
    10: ['paladin-aura-of-courage'],
    11: ['paladin-radiant-strikes'],
    12: ['paladin-asi'],
    13: [],
    14: ['paladin-restoring-touch'],
    15: [],
    16: ['paladin-asi'],
    17: [],
    18: ['paladin-aura-expansion'],
    19: ['paladin-epic-boon'],
    20: [],
  },
  resources: ['layOnHands', 'paladinChannelDivinity', 'paladinSmite', 'paladinFaithfulSteed'],
  spellcasting: paladinSpellcasting,
  choiceIds: ['paladin-weapon-mastery-choice', 'paladin-fighting-style-choice', 'paladin-asi-choice'],
}

const weaponMasteryOptions: ChoiceOptionDefinition[] = Object.values(weapons).map((weapon) => ({
  id: `weapon-mastery-${weapon.id}`,
  label: weapon.name,
  source: weapon.source,
}))

const blessedWarriorOption: ChoiceOptionDefinition = {
  id: 'blessedWarrior',
  label: 'Blessed Warrior — learn 2 Cleric cantrips (Wisdom-based) instead of a Fighting Style; replace one on level-up',
  source: src(109),
}

export const paladinChoiceOptions: Record<string, ChoiceOptionDefinition> = {
  ...Object.fromEntries(weaponMasteryOptions.map((o) => [o.id, o])),
  blessedWarrior: blessedWarriorOption,
}

export const paladinChoices: Record<string, ChoiceDefinition> = {
  'paladin-weapon-mastery-choice': {
    id: 'paladin-weapon-mastery-choice',
    label: 'Weapon Mastery',
    mode: 'multiple',
    minimumSelections: { kind: 'flat', value: 2 },
    maximumSelections: { kind: 'flat', value: 2 },
    required: true,
    timing: ['characterCreation', 'onLongRest'],
    optionIds: weaponMasteryOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onLongRest', maxReplacements: 'unlimited' }],
    source: src(109),
  },
  'paladin-fighting-style-choice': {
    id: 'paladin-fighting-style-choice',
    label: 'Fighting Style',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['onLevelUp'],
    optionIds: [...FIGHTING_STYLE_FEAT_IDS, 'blessedWarrior'],
    // No replacementPolicies — permanent once chosen (same as Fighter's).
    source: src(109),
  },
  'paladin-asi-choice': {
    id: 'paladin-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(110),
  },
}

export const paladinResources: Record<string, ResourceDefinition> = {
  layOnHands: {
    id: 'layOnHands',
    name: 'Lay On Hands',
    minimumLevel: 1,
    // A pool of HP (5x Paladin level), not a simple use-counter — spending a
    // variable amount per use isn't modeled; each Use click deducts a flat 1
    // from the pool's tracked current value, same simplification used for
    // other point-pool features (e.g. Warrior of the Gods' d12 pool).
    maximum: { kind: 'derived', base: 'classLevel', multiplier: 5, rounding: 'down' },
    refresh: { default: ['longRest'] },
    source: src(108),
  },
  paladinChannelDivinity: {
    id: 'paladinChannelDivinity',
    name: 'Channel Divinity',
    minimumLevel: 3,
    maximum: { kind: 'levelTable', table: { 3: 2, 11: 3 } },
    refresh: { default: ['shortRest', 'longRest'] },
    partialRefresh: { shortRest: { kind: 'flat', value: 1 } },
    source: src(109),
  },
  paladinSmite: {
    id: 'paladinSmite',
    name: "Paladin's Smite (free Divine Smite)",
    minimumLevel: 2,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(109),
  },
  paladinFaithfulSteed: {
    id: 'paladinFaithfulSteed',
    name: 'Faithful Steed (free Find Steed)',
    minimumLevel: 5,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(110),
  },
}

export const paladinFeatures: Record<string, FeatureDefinition> = {
  'paladin-lay-on-hands': {
    id: 'paladin-lay-on-hands',
    name: 'Lay On Hands',
    source: src(108),
    minimumLevel: 1,
    activation: 'bonusAction',
    resourceId: 'layOnHands',
    summary: 'A healing pool of 5 HP per Paladin level. As a Bonus Action, touch a creature (including yourself) to restore HP from the pool, up to what remains. Spend 5 HP from the pool instead to remove the Poisoned condition (no healing).',
  },
  'paladin-spellcasting': {
    id: 'paladin-spellcasting',
    name: 'Spellcasting',
    source: src(108),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Cast Paladin spells using Charisma, preparing directly from the full Paladin list (no known-list, no cantrips). Swap one prepared spell whenever you finish a Long Rest. Slots recover on a Long Rest.',
  },
  'paladin-weapon-mastery': {
    id: 'paladin-weapon-mastery',
    name: 'Weapon Mastery',
    source: src(109),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Use the mastery properties of 2 weapon kinds you have proficiency with. Change your choices whenever you finish a Long Rest.',
    choices: ['paladin-weapon-mastery-choice'],
  },
  'paladin-fighting-style': {
    id: 'paladin-fighting-style',
    name: 'Fighting Style',
    source: src(109),
    minimumLevel: 2,
    activation: 'passive',
    summary: 'Gain a Fighting Style feat, or choose Blessed Warrior (learn 2 Cleric cantrips, Wisdom-based, replaceable on level-up) instead.',
    choices: ['paladin-fighting-style-choice'],
  },
  'paladin-paladins-smite': {
    id: 'paladin-paladins-smite',
    name: "Paladin's Smite",
    source: src(109),
    minimumLevel: 2,
    activation: 'special',
    resourceId: 'paladinSmite',
    summary: 'Always have Divine Smite prepared; cast it once without a slot per Long Rest.',
  },
  'paladin-channel-divinity': {
    id: 'paladin-channel-divinity',
    name: 'Channel Divinity',
    source: src(109),
    minimumLevel: 3,
    activation: 'special',
    resourceId: 'paladinChannelDivinity',
    summary: 'Channel divine energy to fuel Divine Sense (Bonus Action: detect Celestials/Fiends/Undead and consecrated/desecrated places within 60 ft for 10 minutes) plus subclass-granted options. 2 uses, growing to 3 at level 11; regain 1 on a Short Rest, all on a Long Rest.',
  },
  'paladin-asi': {
    id: 'paladin-asi',
    name: 'Ability Score Improvement',
    source: src(110),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Paladin levels 8, 12, and 16.',
    choices: ['paladin-asi-choice'],
  },
  'paladin-extra-attack': {
    id: 'paladin-extra-attack',
    name: 'Extra Attack',
    source: src(110),
    minimumLevel: 5,
    activation: 'passive',
    summary: 'Attack twice, instead of once, whenever you take the Attack action on your turn.',
  },
  'paladin-faithful-steed': {
    id: 'paladin-faithful-steed',
    name: 'Faithful Steed',
    source: src(110),
    minimumLevel: 5,
    activation: 'special',
    resourceId: 'paladinFaithfulSteed',
    summary: 'Always have Find Steed prepared; cast it once without a slot per Long Rest.',
  },
  'paladin-aura-of-protection': {
    id: 'paladin-aura-of-protection',
    name: 'Aura of Protection',
    source: src(110),
    minimumLevel: 6,
    activation: 'passive',
    summary: "You and allies in a 10-ft Emanation gain a bonus to saving throws equal to your Charisma modifier (min +1). Inactive while Incapacitated.",
  },
  'paladin-abjure-foes': {
    id: 'paladin-abjure-foes',
    name: 'Abjure Foes',
    source: src(110),
    minimumLevel: 9,
    activation: 'special',
    resourceId: 'paladinChannelDivinity',
    summary: 'As a Magic action, expend a Channel Divinity use: chosen creatures within 60 ft make a Wisdom save or are Frightened for 1 minute (or until damaged), limited to move/action/bonus action (one only) while Frightened this way.',
  },
  'paladin-aura-of-courage': {
    id: 'paladin-aura-of-courage',
    name: 'Aura of Courage',
    source: src(110),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'You and allies in your Aura of Protection have Immunity to the Frightened condition.',
  },
  'paladin-radiant-strikes': {
    id: 'paladin-radiant-strikes',
    name: 'Radiant Strikes',
    source: src(110),
    minimumLevel: 11,
    activation: 'passive',
    summary: 'A Melee weapon or Unarmed Strike hit deals an extra 1d8 Radiant damage.',
  },
  'paladin-restoring-touch': {
    id: 'paladin-restoring-touch',
    name: 'Restoring Touch',
    source: src(110),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'Lay On Hands can also remove Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned — 5 HP from the pool per condition removed (no healing from those points).',
  },
  'paladin-aura-expansion': {
    id: 'paladin-aura-expansion',
    name: 'Aura Expansion',
    source: src(110),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'Aura of Protection becomes a 30-foot Emanation.',
  },
  'paladin-epic-boon': {
    id: 'paladin-epic-boon',
    name: 'Epic Boon',
    source: src(110),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Truesight is recommended.',
  },
}
