import type { ChoiceDefinition, ChoiceOptionDefinition, FeatureDefinition, ResourceDefinition, SubclassDefinition } from '../../../domain/types'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.53-56 — all 4 Barbarian subclasses, extracted via pdftotext -raw.
export const barbarianSubclasses: Record<string, SubclassDefinition> = {
  berserker: {
    id: 'berserker',
    name: 'Path of the Berserker',
    parentClassId: 'barbarian',
    minimumLevel: 3,
    source: src(53),
    featuresByLevel: {
      3: ['berserker-frenzy'],
      6: ['berserker-mindless-rage'],
      10: ['berserker-retaliation'],
      14: ['berserker-intimidating-presence'],
    },
    resources: ['berserkerIntimidatingPresence'],
  },
  wildHeart: {
    id: 'wildHeart',
    name: 'Path of the Wild Heart',
    parentClassId: 'barbarian',
    minimumLevel: 3,
    source: src(54),
    featuresByLevel: {
      3: ['wildHeart-animal-speaker', 'wildHeart-rage-of-the-wilds'],
      6: ['wildHeart-aspect-of-the-wilds'],
      10: ['wildHeart-nature-speaker'],
      14: ['wildHeart-power-of-the-wilds'],
    },
    choiceIds: ['wildHeart-aspect-choice'],
  },
  worldTree: {
    id: 'worldTree',
    name: 'Path of the World Tree',
    parentClassId: 'barbarian',
    minimumLevel: 3,
    source: src(55),
    featuresByLevel: {
      3: ['worldTree-vitality-of-the-tree'],
      6: ['worldTree-branches-of-the-tree'],
      10: ['worldTree-battering-roots'],
      14: ['worldTree-travel-along-the-tree'],
    },
  },
  zealot: {
    id: 'zealot',
    name: 'Path of the Zealot',
    parentClassId: 'barbarian',
    minimumLevel: 3,
    source: src(56),
    featuresByLevel: {
      3: ['zealot-divine-fury', 'zealot-warrior-of-the-gods'],
      6: ['zealot-fanatical-focus'],
      10: ['zealot-zealous-presence'],
      14: ['zealot-rage-of-the-gods'],
    },
    resources: ['zealotHealingDice', 'zealotZealousPresence', 'zealotRageOfTheGods'],
  },
}

export const barbarianSubclassChoices: Record<string, ChoiceDefinition> = {
  'wildHeart-aspect-choice': {
    id: 'wildHeart-aspect-choice',
    label: 'Aspect of the Wilds',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['onLevelUp', 'onLongRest'],
    optionIds: ['wildHeart-aspect-owl', 'wildHeart-aspect-panther', 'wildHeart-aspect-salmon'],
    replacementPolicies: [{ timing: 'onLongRest', maxReplacements: 'unlimited' }],
    source: src(54),
  },
}

export const barbarianSubclassChoiceOptions: Record<string, ChoiceOptionDefinition> = {
  'wildHeart-aspect-owl': { id: 'wildHeart-aspect-owl', label: 'Owl — Darkvision 60 ft (or +60 ft if you already have it)', source: src(54) },
  'wildHeart-aspect-panther': { id: 'wildHeart-aspect-panther', label: 'Panther — Climb Speed equal to your Speed', source: src(54) },
  'wildHeart-aspect-salmon': { id: 'wildHeart-aspect-salmon', label: 'Salmon — Swim Speed equal to your Speed', source: src(54) },
}

export const barbarianSubclassResources: Record<string, ResourceDefinition> = {
  berserkerIntimidatingPresence: {
    id: 'berserkerIntimidatingPresence',
    name: 'Intimidating Presence',
    minimumLevel: 14,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(53),
  },
  zealotHealingDice: {
    id: 'zealotHealingDice',
    name: "Warrior of the Gods (healing d12 pool)",
    minimumLevel: 3,
    maximum: { kind: 'levelTable', table: { 3: 4, 6: 5, 12: 6, 17: 7 } },
    refresh: { default: ['longRest'] },
    source: src(56),
  },
  zealotZealousPresence: {
    id: 'zealotZealousPresence',
    name: 'Zealous Presence',
    minimumLevel: 10,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(56),
  },
  zealotRageOfTheGods: {
    id: 'zealotRageOfTheGods',
    name: 'Rage of the Gods',
    minimumLevel: 14,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(56),
  },
}

export const barbarianSubclassFeatures: Record<string, FeatureDefinition> = {
  // ---- Berserker ----
  'berserker-frenzy': {
    id: 'berserker-frenzy',
    name: 'Frenzy',
    source: src(53),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'While Reckless Attack is active during your Rage, the first Strength-based hit each turn deals extra damage equal to a number of d6s equal to your Rage Damage bonus, of the weapon/Unarmed Strike\'s damage type.',
  },
  'berserker-mindless-rage': {
    id: 'berserker-mindless-rage',
    name: 'Mindless Rage',
    source: src(53),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Immunity to the Charmed and Frightened conditions while your Rage is active; entering Rage ends an existing Charmed or Frightened condition on you.',
  },
  'berserker-retaliation': {
    id: 'berserker-retaliation',
    name: 'Retaliation',
    source: src(53),
    minimumLevel: 10,
    activation: 'reaction',
    summary: 'When a creature within 5 feet damages you, make one melee weapon or Unarmed Strike attack against it.',
  },
  'berserker-intimidating-presence': {
    id: 'berserker-intimidating-presence',
    name: 'Intimidating Presence',
    source: src(53),
    minimumLevel: 14,
    activation: 'bonusAction',
    resourceId: 'berserkerIntimidatingPresence',
    summary: 'Each creature you choose in a 30-ft Emanation makes a Wisdom save (DC 8 + Strength modifier + Proficiency Bonus) or is Frightened for 1 minute (repeats the save each turn). Once per Long Rest, though you can restore this use early by expending a Rage.',
  },
  // ---- Wild Heart ----
  'wildHeart-animal-speaker': {
    id: 'wildHeart-animal-speaker',
    name: 'Animal Speaker',
    source: src(54),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Cast Beast Sense and Speak with Animals, but only as Rituals, using Wisdom. (Not yet in the spell registry — description only.)',
  },
  'wildHeart-rage-of-the-wilds': {
    id: 'wildHeart-rage-of-the-wilds',
    name: 'Rage of the Wilds',
    source: src(54),
    minimumLevel: 3,
    activation: 'passive',
    summary:
      'Each time you activate your Rage, choose one: Bear (Resistance to every damage type but Force/Necrotic/Psychic/Radiant while raging), Eagle (Disengage+Dash as part of the Rage Bonus Action, and again as a single Bonus Action while raging), or Wolf (allies have Advantage attacking any enemy within 5 ft of you while you rage). Chosen fresh each Rage — not a permanent pick, so it is not modeled as a Choice.',
  },
  'wildHeart-aspect-of-the-wilds': {
    id: 'wildHeart-aspect-of-the-wilds',
    name: 'Aspect of the Wilds',
    source: src(54),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Choose Owl, Panther, or Salmon; change your choice whenever you finish a Long Rest.',
    choices: ['wildHeart-aspect-choice'],
  },
  'wildHeart-nature-speaker': {
    id: 'wildHeart-nature-speaker',
    name: 'Nature Speaker',
    source: src(54),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'Cast Commune with Nature, but only as a Ritual, using Wisdom. (Not yet in the spell registry — description only.)',
  },
  'wildHeart-power-of-the-wilds': {
    id: 'wildHeart-power-of-the-wilds',
    name: 'Power of the Wilds',
    source: src(54),
    minimumLevel: 14,
    activation: 'passive',
    summary:
      'Each time you activate your Rage, choose one: Falcon (Fly Speed = Speed while raging and unarmored), Lion (enemies within 5 ft have Disadvantage attacking anyone but you or another Barbarian with this option active), or Ram (melee hits can give a Large-or-smaller target the Prone condition). Chosen fresh each Rage, like Rage of the Wilds.',
  },
  // ---- World Tree ----
  'worldTree-vitality-of-the-tree': {
    id: 'worldTree-vitality-of-the-tree',
    name: 'Vitality of the Tree',
    source: src(55),
    minimumLevel: 3,
    activation: 'passive',
    summary:
      'Vitality Surge: gain Temporary HP equal to your Barbarian level when you activate your Rage. Life-Giving Force: at the start of each of your turns while raging, you can grant another creature within 10 ft Temporary HP equal to a number of d6s (equal to your Rage Damage bonus) added together; unused Temp HP vanishes when your Rage ends.',
  },
  'worldTree-branches-of-the-tree': {
    id: 'worldTree-branches-of-the-tree',
    name: 'Branches of the Tree',
    source: src(55),
    minimumLevel: 6,
    activation: 'reaction',
    summary: 'While raging, react to a creature within 30 ft starting its turn: it makes a Strength save (DC 8 + Strength modifier + Proficiency Bonus) or teleports to a space near you and its Speed becomes 0 until the end of the current turn.',
  },
  'worldTree-battering-roots': {
    id: 'worldTree-battering-roots',
    name: 'Battering Roots',
    source: src(55),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'On your turn, your reach with Heavy or Versatile Melee weapons is +10 ft; hitting with one lets you also activate the Push or Topple mastery property alongside another mastery property.',
  },
  'worldTree-travel-along-the-tree': {
    id: 'worldTree-travel-along-the-tree',
    name: 'Travel Along the Tree',
    source: src(55),
    minimumLevel: 14,
    activation: 'passive',
    summary:
      'When you activate your Rage, and again as a Bonus Action while it lasts, teleport up to 60 ft to a space you can see. Once per Rage, extend that teleport to 150 ft and bring up to 6 willing creatures within 10 ft of you.',
  },
  // ---- Zealot ----
  'zealot-divine-fury': {
    id: 'zealot-divine-fury',
    name: 'Divine Fury',
    source: src(56),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'While raging, the first creature you hit each turn with a weapon or Unarmed Strike takes extra Necrotic or Radiant damage (your choice each time) equal to 1d6 + half your Barbarian level (round down).',
  },
  'zealot-warrior-of-the-gods': {
    id: 'zealot-warrior-of-the-gods',
    name: 'Warrior of the Gods',
    source: src(56),
    minimumLevel: 3,
    activation: 'bonusAction',
    resourceId: 'zealotHealingDice',
    summary:
      'Spend a d12 from your healing pool (4 dice, growing to 5/6/7 at levels 6/12/17) as a Bonus Action to regain HP equal to the roll. Pool refills on a Long Rest. (Modeled as 1 die spent per Use; spending multiple dice at once is a manual judgment call.)',
  },
  'zealot-fanatical-focus': {
    id: 'zealot-fanatical-focus',
    name: 'Fanatical Focus',
    source: src(56),
    minimumLevel: 6,
    activation: 'special',
    summary: 'Once per active Rage, reroll a failed saving throw with a bonus equal to your Rage Damage bonus, and use the new roll.',
  },
  'zealot-zealous-presence': {
    id: 'zealot-zealous-presence',
    name: 'Zealous Presence',
    source: src(56),
    minimumLevel: 10,
    activation: 'bonusAction',
    resourceId: 'zealotZealousPresence',
    summary: 'Up to 10 other creatures within 60 ft gain Advantage on attack rolls and saving throws until the start of your next turn. Once per Long Rest, though you can restore this use early by expending a Rage.',
  },
  'zealot-rage-of-the-gods': {
    id: 'zealot-rage-of-the-gods',
    name: 'Rage of the Gods',
    source: src(56),
    minimumLevel: 14,
    activation: 'special',
    resourceId: 'zealotRageOfTheGods',
    summary:
      'When you activate your Rage, assume a divine warrior form for 1 minute or until you drop to 0 HP: Fly Speed = Speed (with hover), Resistance to Necrotic/Psychic/Radiant, and a Reaction to spend a Rage use to save a creature within 30 ft from dropping to 0 HP (it drops to HP equal to your Barbarian level instead). Once per Long Rest.',
  },
}
