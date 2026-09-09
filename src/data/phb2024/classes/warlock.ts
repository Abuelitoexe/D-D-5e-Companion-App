import type { ChoiceDefinition, ChoiceOptionDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition, SpellcastingDefinition } from '../../../domain/types'
import { GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// Warlock Features table, PHB 2024 p.153 — re-verified via pdftotext -table
// AND -raw mode (both agree), cross-checked against confirmed prose anchors
// (cantrips at 4/10, "level 5 Warlock has two level 3 slots" at level 5,
// "level 6 spells of levels 1-3" at level 6).
export const warlockSpellcasting: SpellcastingDefinition = {
  ability: 'Charisma',
  slotProgression: 'pact',
  cantripProgression: { 1: 2, 4: 3, 10: 4 },
  preparedSource: 'knownList',
  preparedCountFormula: {
    kind: 'levelTable',
    table: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 11: 11, 13: 12, 15: 13, 17: 14, 19: 15 },
  },
  swapPolicy: { timing: ['onLevelUp'], count: 1 },
  pactSlotTable: {
    1: { slots: 1, slotLevel: 1 },
    2: { slots: 2, slotLevel: 1 },
    3: { slots: 2, slotLevel: 2 },
    5: { slots: 2, slotLevel: 3 },
    7: { slots: 2, slotLevel: 4 },
    9: { slots: 2, slotLevel: 5 },
    11: { slots: 3, slotLevel: 5 },
    17: { slots: 4, slotLevel: 5 },
  },
  maxPreparableSlotLevel: { kind: 'levelTable', table: { 1: 1, 3: 2, 5: 3, 7: 4, 9: 5 } },
  spellListId: 'warlock',
  source: src(153),
}

export const warlockClass: ClassDefinition = {
  id: 'warlock',
  name: 'Warlock',
  source: src(152),
  primaryAbilities: ['Charisma'],
  hitDie: 8,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['warlock-eldritch-invocations', 'warlock-pact-magic'],
    2: ['warlock-magical-cunning'],
    3: [],
    4: ['warlock-asi'],
    5: [],
    6: [],
    7: [],
    8: ['warlock-asi'],
    9: ['warlock-contact-patron'],
    10: [],
    11: ['warlock-mystic-arcanum-6'],
    12: ['warlock-asi'],
    13: ['warlock-mystic-arcanum-7'],
    14: [],
    15: ['warlock-mystic-arcanum-8'],
    16: ['warlock-asi'],
    17: ['warlock-mystic-arcanum-9'],
    18: [],
    19: ['warlock-epic-boon'],
    20: ['warlock-eldritch-master'],
  },
  resources: ['magicalCunning', 'mysticArcanum6', 'mysticArcanum7', 'mysticArcanum8', 'mysticArcanum9'],
  spellcasting: warlockSpellcasting,
  choiceIds: ['warlock-invocations-choice', 'warlock-asi-choice'],
}

export const warlockResources: Record<string, ResourceDefinition> = {
  magicalCunning: {
    id: 'magicalCunning',
    name: 'Magical Cunning',
    minimumLevel: 2,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(153),
  },
  mysticArcanum6: { id: 'mysticArcanum6', name: 'Mystic Arcanum (6th level)', minimumLevel: 11, maximum: { kind: 'flat', value: 1 }, refresh: { default: ['longRest'] }, source: src(153) },
  mysticArcanum7: { id: 'mysticArcanum7', name: 'Mystic Arcanum (7th level)', minimumLevel: 13, maximum: { kind: 'flat', value: 1 }, refresh: { default: ['longRest'] }, source: src(153) },
  mysticArcanum8: { id: 'mysticArcanum8', name: 'Mystic Arcanum (8th level)', minimumLevel: 15, maximum: { kind: 'flat', value: 1 }, refresh: { default: ['longRest'] }, source: src(153) },
  mysticArcanum9: { id: 'mysticArcanum9', name: 'Mystic Arcanum (9th level)', minimumLevel: 17, maximum: { kind: 'flat', value: 1 }, refresh: { default: ['longRest'] }, source: src(153) },
}

// Eldritch Invocation Options, PHB 2024 p.154-156 — all 28 (alphabetical in
// the book). Prerequisites use the generic Prerequisite union; several
// reference another invocation by id via hasSelectedOption, including a
// two-deep chain (Devouring Blade -> Thirsting Blade -> Pact of the Blade)
// that exercises canRemoveOption's reverse-dependency check.
export const warlockInvocationOptions: ChoiceOptionDefinition[] = [
  { id: 'agonizingBlast', label: 'Agonizing Blast — add Charisma modifier to a damage cantrip\'s damage rolls', source: src(154), prerequisites: [{ kind: 'minimumLevel', level: 2 }], repeatable: true },
  { id: 'armorOfShadows', label: 'Armor of Shadows — cast Mage Armor on yourself at will', source: src(154) },
  { id: 'ascendantStep', label: 'Ascendant Step — cast Levitate on yourself at will', source: src(154), prerequisites: [{ kind: 'minimumLevel', level: 5 }] },
  { id: 'devilsSight', label: "Devil's Sight — see normally in Dim Light and Darkness within 120 feet", source: src(154), prerequisites: [{ kind: 'minimumLevel', level: 2 }] },
  { id: 'devouringBlade', label: 'Devouring Blade — Thirsting Blade grants two extra attacks instead of one', source: src(154), prerequisites: [{ kind: 'minimumLevel', level: 12 }, { kind: 'hasSelectedOption', optionId: 'thirstingBlade' }] },
  { id: 'eldritchMind', label: 'Eldritch Mind — Advantage on Constitution saves to maintain Concentration', source: src(154) },
  { id: 'eldritchSmite', label: 'Eldritch Smite — expend a Pact Magic slot on a pact weapon hit for extra Force damage + Prone', source: src(154), prerequisites: [{ kind: 'minimumLevel', level: 5 }, { kind: 'hasSelectedOption', optionId: 'pactOfTheBlade' }] },
  { id: 'eldritchSpear', label: 'Eldritch Spear — a damage cantrip\'s range increases by 30 ft x your level', source: src(154), prerequisites: [{ kind: 'minimumLevel', level: 2 }], repeatable: true },
  { id: 'fiendishVigor', label: 'Fiendish Vigor — cast False Life on yourself at will, max Temp HP', source: src(154), prerequisites: [{ kind: 'minimumLevel', level: 2 }] },
  { id: 'gazeOfTwoMinds', label: 'Gaze of Two Minds — Bonus Action: perceive through a willing creature\'s senses', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 5 }] },
  { id: 'giftOfTheDepths', label: 'Gift of the Depths — breathe water, Swim Speed, cast Water Breathing 1/Long Rest', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 5 }] },
  { id: 'giftOfTheProtectors', label: 'Gift of the Protectors — named allies drop to 1 HP instead of 0, once per Long Rest', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 9 }, { kind: 'hasSelectedOption', optionId: 'pactOfTheTome' }] },
  { id: 'investmentOfTheChainMaster', label: "Investment of the Chain Master — your familiar gets Fly/Swim, Bonus Action attack, and more", source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 5 }, { kind: 'hasSelectedOption', optionId: 'pactOfTheChain' }] },
  { id: 'lessonsOfTheFirstOnes', label: 'Lessons of the First Ones — gain an Origin feat of your choice', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 2 }], repeatable: true },
  { id: 'lifedrinker', label: 'Lifedrinker — pact weapon hit deals extra Necrotic/Psychic/Radiant damage + self-heal', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 9 }, { kind: 'hasSelectedOption', optionId: 'pactOfTheBlade' }] },
  { id: 'maskOfManyFaces', label: 'Mask of Many Faces — cast Disguise Self at will', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 2 }] },
  { id: 'masterOfMyriadForms', label: 'Master of Myriad Forms — cast Alter Self at will', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 5 }] },
  { id: 'mistyVisions', label: 'Misty Visions — cast Silent Image at will', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 2 }] },
  { id: 'oneWithShadows', label: 'One with Shadows — cast Invisibility on yourself at will in Dim Light/Darkness', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 5 }] },
  { id: 'otherworldlyLeap', label: 'Otherworldly Leap — cast Jump on yourself at will', source: src(155), prerequisites: [{ kind: 'minimumLevel', level: 2 }] },
  { id: 'pactOfTheBlade', label: 'Pact of the Blade — conjure/bond a pact weapon, use Charisma for its attacks', source: src(155) },
  { id: 'pactOfTheChain', label: 'Pact of the Chain — learn Find Familiar (cast at will), special familiar forms', source: src(155) },
  { id: 'pactOfTheTome', label: 'Pact of the Tome — a Book of Shadows grants 3 cantrips + 2 ritual spells always prepared', source: src(155) },
  { id: 'repellingBlast', label: 'Repelling Blast — push a Large or smaller target 10 ft on a damage cantrip hit', source: src(156), prerequisites: [{ kind: 'minimumLevel', level: 2 }], repeatable: true },
  { id: 'thirstingBlade', label: 'Thirsting Blade — Extra Attack with your pact weapon', source: src(156), prerequisites: [{ kind: 'minimumLevel', level: 5 }, { kind: 'hasSelectedOption', optionId: 'pactOfTheBlade' }] },
  { id: 'visionsOfDistantRealms', label: 'Visions of Distant Realms — cast Arcane Eye at will', source: src(156), prerequisites: [{ kind: 'minimumLevel', level: 9 }] },
  { id: 'whispersOfTheGrave', label: 'Whispers of the Grave — cast Speak with Dead at will', source: src(156), prerequisites: [{ kind: 'minimumLevel', level: 7 }] },
  { id: 'witchSight', label: 'Witch Sight — Truesight with a range of 30 feet', source: src(156), prerequisites: [{ kind: 'minimumLevel', level: 15 }] },
]

export const warlockChoiceOptions: Record<string, ChoiceOptionDefinition> = Object.fromEntries(
  warlockInvocationOptions.map((o) => [o.id, o]),
)

export const warlockChoices: Record<string, ChoiceDefinition> = {
  'warlock-invocations-choice': {
    id: 'warlock-invocations-choice',
    label: 'Eldritch Invocations',
    mode: 'multiple',
    // Verified via -table/-raw cross-check: 1(L1), 3(L2), 5(L5), 6(L7), 7(L9), 8(L12), 9(L15), 10(L18).
    minimumSelections: { kind: 'levelTable', table: { 1: 1, 2: 3, 5: 5, 7: 6, 9: 7, 12: 8, 15: 9, 18: 10 } },
    maximumSelections: { kind: 'levelTable', table: { 1: 1, 2: 3, 5: 5, 7: 6, 9: 7, 12: 8, 15: 9, 18: 10 } },
    required: true,
    timing: ['characterCreation', 'onLevelUp'],
    optionIds: warlockInvocationOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onLevelUp', maxReplacements: 'unlimited' }],
    source: src(154),
  },
  'warlock-asi-choice': {
    id: 'warlock-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(153),
  },
}

export const warlockFeatures: Record<string, FeatureDefinition> = {
  'warlock-eldritch-invocations': {
    id: 'warlock-eldritch-invocations',
    name: 'Eldritch Invocations',
    source: src(153),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Gain 1 Eldritch Invocation of your choice, growing with level. Replace one whenever you gain a level, except one that\'s a prerequisite for another invocation you have.',
    choices: ['warlock-invocations-choice'],
  },
  'warlock-pact-magic': {
    id: 'warlock-pact-magic',
    name: 'Pact Magic',
    source: src(153),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Cast spells using Charisma. Know 2 cantrips (3 at level 4, 4 at level 10). Very few spell slots, but all are always at your highest available level; slots recover on a Short or Long Rest.',
  },
  'warlock-magical-cunning': {
    id: 'warlock-magical-cunning',
    name: 'Magical Cunning',
    source: src(153),
    minimumLevel: 2,
    activation: 'special',
    summary: 'A 1-minute rite regains expended Pact Magic slots, up to half your maximum (round up). Once per Long Rest.',
    resourceId: 'magicalCunning',
  },
  'warlock-asi': {
    id: 'warlock-asi',
    name: 'Ability Score Improvement',
    source: src(153),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Warlock levels 8, 12, and 16.',
    choices: ['warlock-asi-choice'],
  },
  'warlock-contact-patron': {
    id: 'warlock-contact-patron',
    name: 'Contact Patron',
    source: src(153),
    minimumLevel: 9,
    activation: 'special',
    summary: 'Always have Contact Other Plane prepared; cast it without a slot and automatically succeed its save. Once per Long Rest.',
  },
  'warlock-mystic-arcanum-6': {
    id: 'warlock-mystic-arcanum-6',
    name: 'Mystic Arcanum (6th level)',
    source: src(153),
    minimumLevel: 11,
    activation: 'special',
    summary: 'Choose a level 6 Warlock spell; cast it once without a slot. Once per Long Rest. Replace it whenever you gain a Warlock level.',
    resourceId: 'mysticArcanum6',
  },
  'warlock-mystic-arcanum-7': {
    id: 'warlock-mystic-arcanum-7',
    name: 'Mystic Arcanum (7th level)',
    source: src(153),
    minimumLevel: 13,
    activation: 'special',
    summary: 'Choose a level 7 Warlock spell; cast it once without a slot. Once per Long Rest.',
    resourceId: 'mysticArcanum7',
  },
  'warlock-mystic-arcanum-8': {
    id: 'warlock-mystic-arcanum-8',
    name: 'Mystic Arcanum (8th level)',
    source: src(153),
    minimumLevel: 15,
    activation: 'special',
    summary: 'Choose a level 8 Warlock spell; cast it once without a slot. Once per Long Rest.',
    resourceId: 'mysticArcanum8',
  },
  'warlock-mystic-arcanum-9': {
    id: 'warlock-mystic-arcanum-9',
    name: 'Mystic Arcanum (9th level)',
    source: src(153),
    minimumLevel: 17,
    activation: 'special',
    summary: 'Choose a level 9 Warlock spell; cast it once without a slot. Once per Long Rest.',
    resourceId: 'mysticArcanum9',
  },
  'warlock-epic-boon': {
    id: 'warlock-epic-boon',
    name: 'Epic Boon',
    source: src(153),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Fate is recommended.',
  },
  'warlock-eldritch-master': {
    id: 'warlock-eldritch-master',
    name: 'Eldritch Master',
    source: src(153),
    minimumLevel: 20,
    activation: 'passive',
    summary: 'Using Magical Cunning regains ALL expended Pact Magic slots, not just half.',
  },
}
