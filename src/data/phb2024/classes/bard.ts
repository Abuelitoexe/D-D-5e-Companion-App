import type { ChoiceDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition, SpellcastingDefinition } from '../../../domain/types'
import { GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.58-60 — Core Bard Traits + Bard Features table. Unlike Cleric's
// table, this one parsed cleanly under -table mode; all values below are
// read directly off it. Prepared Spells (4/5/6/7/9/10/11/12/14/15/16/16/
// 17/17/18/18/19/20/21/22) is byte-for-byte identical to Wizard's and
// Cleric's table — a third independent confirmation that this is one shared
// "prepare from the full list" progression, not a per-class coincidence.
export const bardSpellcasting: SpellcastingDefinition = {
  ability: 'Charisma',
  slotProgression: 'full',
  cantripProgression: { 1: 2, 4: 3, 10: 4 },
  preparedSource: 'knownList',
  preparedCountFormula: {
    kind: 'levelTable',
    table: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
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
  spellListId: 'bard',
  source: src(58),
}

export const bardClass: ClassDefinition = {
  id: 'bard',
  name: 'Bard',
  source: src(58),
  primaryAbilities: ['Charisma'],
  hitDie: 8,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['bard-bardic-inspiration', 'bard-spellcasting'],
    2: ['bard-expertise', 'bard-jack-of-all-trades'],
    3: [],
    4: ['bard-asi'],
    5: ['bard-font-of-inspiration'],
    6: [],
    7: ['bard-countercharm'],
    8: ['bard-asi'],
    9: ['bard-expertise'],
    10: ['bard-magical-secrets'],
    11: [],
    12: ['bard-asi'],
    13: [],
    14: [],
    15: [],
    16: ['bard-asi'],
    17: [],
    18: ['bard-superior-inspiration'],
    19: ['bard-epic-boon'],
    20: ['bard-words-of-creation'],
  },
  resources: ['bardicInspiration'],
  spellcasting: bardSpellcasting,
  choiceIds: ['bard-expertise-choice', 'bard-asi-choice'],
}

const ALL_SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
  'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
  'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival',
]
const skillOptionId = (skill: string) => `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`

export const bardChoices: Record<string, ChoiceDefinition> = {
  'bard-expertise-choice': {
    id: 'bard-expertise-choice',
    label: 'Expertise',
    mode: 'multiple',
    // 2 skills at level 2, +2 more (4 total) at level 9 — same mechanic as
    // Rogue's Expertise, different levels/counts (purely data, no engine branch).
    minimumSelections: { kind: 'levelTable', table: { 2: 2, 9: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 2: 2, 9: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: ALL_SKILLS.map(skillOptionId),
    // No replacementPolicies — Expertise picks are permanent once made.
    source: src(59),
  },
  'bard-asi-choice': {
    id: 'bard-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(60),
  },
}

export const bardResources: Record<string, ResourceDefinition> = {
  bardicInspiration: {
    id: 'bardicInspiration',
    name: 'Bardic Inspiration',
    minimumLevel: 1,
    maximum: { kind: 'abilityModifier', ability: 'Charisma', minimum: 1 },
    // Long Rest only until level 5 (Font of Inspiration), then either rest —
    // the exact LeveledValue<RefreshRule[]> shape this field was designed for.
    refresh: { default: ['longRest'], overridesFromLevel: [{ level: 5, value: ['shortRest', 'longRest'] }] },
    source: src(58),
  },
}

export const bardFeatures: Record<string, FeatureDefinition> = {
  'bard-bardic-inspiration': {
    id: 'bard-bardic-inspiration',
    name: 'Bardic Inspiration',
    source: src(58),
    minimumLevel: 1,
    activation: 'bonusAction',
    resourceId: 'bardicInspiration',
    summary:
      "Give a creature within 60 feet who can see/hear you a Bardic Inspiration die (d6, growing to d8 at 5, d10 at 10, d12 at 15). Within the next hour, on a failed D20 Test it can roll the die and add the result, potentially turning failure into success. Uses = Charisma modifier (min 1); refills on a Long Rest (Short or Long Rest once you have Font of Inspiration at level 5).",
  },
  'bard-spellcasting': {
    id: 'bard-spellcasting',
    name: 'Spellcasting',
    source: src(58),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Cast Bard spells using Charisma from a known list you prepare directly (no spellbook). Swap one spell whenever you gain a Bard level. Cantrips need no slot; slots recover on a Long Rest.',
  },
  'bard-expertise': {
    id: 'bard-expertise',
    name: 'Expertise',
    source: src(59),
    minimumLevel: 2,
    activation: 'passive',
    summary: 'Double Proficiency Bonus on ability checks with 2 chosen skill proficiencies. 2 more at level 9.',
    choices: ['bard-expertise-choice'],
  },
  'bard-jack-of-all-trades': {
    id: 'bard-jack-of-all-trades',
    name: 'Jack of All Trades',
    source: src(59),
    minimumLevel: 2,
    activation: 'passive',
    summary: "Add half your Proficiency Bonus (round down) to any ability check using a skill proficiency you lack, as long as it wouldn't otherwise use your Proficiency Bonus.",
  },
  'bard-asi': {
    id: 'bard-asi',
    name: 'Ability Score Improvement',
    source: src(60),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Bard levels 8, 12, and 16.',
    choices: ['bard-asi-choice'],
  },
  'bard-font-of-inspiration': {
    id: 'bard-font-of-inspiration',
    name: 'Font of Inspiration',
    source: src(60),
    minimumLevel: 5,
    activation: 'passive',
    summary: 'Bardic Inspiration now fully refills on a Short or Long Rest (already reflected in the resource). You can also expend a spell slot (no action) to regain one use of Bardic Inspiration.',
  },
  'bard-countercharm': {
    id: 'bard-countercharm',
    name: 'Countercharm',
    source: src(60),
    minimumLevel: 7,
    activation: 'reaction',
    summary: 'If you or a creature within 30 ft fails a save against a Charmed- or Frightened-inflicting effect, force a reroll of that save with Advantage.',
  },
  'bard-magical-secrets': {
    id: 'bard-magical-secrets',
    name: 'Magical Secrets',
    source: src(60),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'Whenever your Prepared Spells count increases (including this level), you may choose new prepared spells from the Bard, Cleric, Druid, and Wizard spell lists instead of just Bard\'s; replacements can also draw from those lists thereafter.',
  },
  'bard-superior-inspiration': {
    id: 'bard-superior-inspiration',
    name: 'Superior Inspiration',
    source: src(60),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'When you roll Initiative, regain Bardic Inspiration uses until you have 2 if you have fewer.',
  },
  'bard-epic-boon': {
    id: 'bard-epic-boon',
    name: 'Epic Boon',
    source: src(60),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Spell Recall is recommended.',
  },
  'bard-words-of-creation': {
    id: 'bard-words-of-creation',
    name: 'Words of Creation',
    source: src(60),
    minimumLevel: 20,
    activation: 'passive',
    summary: 'Always have Power Word Heal and Power Word Kill prepared; casting either can target a second creature within 10 ft of the first. (Neither spell is yet in the registry — description only.)',
  },
}
