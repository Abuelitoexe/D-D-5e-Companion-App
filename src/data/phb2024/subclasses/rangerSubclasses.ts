import type { ChoiceDefinition, ChoiceOptionDefinition, FeatureDefinition, ResourceDefinition, SubclassDefinition } from '../../../domain/types'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.121-127 — all 4 Ranger subclasses, extracted via pdftotext -raw.
// All 4 share the standard 3/7/11/15 feature-level pattern.
export const rangerSubclasses: Record<string, SubclassDefinition> = {
  beastMaster: {
    id: 'beastMaster',
    name: 'Beast Master',
    parentClassId: 'ranger',
    minimumLevel: 3,
    source: src(121),
    featuresByLevel: {
      3: ['beastMaster-primal-companion'],
      7: ['beastMaster-exceptional-training'],
      11: ['beastMaster-bestial-fury'],
      15: ['beastMaster-share-spells'],
    },
  },
  feyWanderer: {
    id: 'feyWanderer',
    name: 'Fey Wanderer',
    parentClassId: 'ranger',
    minimumLevel: 3,
    source: src(123),
    featuresByLevel: {
      3: ['feyWanderer-dreadful-strikes', 'feyWanderer-fey-wanderer-spells', 'feyWanderer-otherworldly-clamour'],
      6: ['feyWanderer-beguiling-twist'],
      11: ['feyWanderer-fey-reinforcements'],
      15: ['feyWanderer-misty-wanderer'],
    },
    resources: ['feyWandererFeyReinforcements', 'feyWandererMistyWanderer'],
  },
  gloomStalker: {
    id: 'gloomStalker',
    name: 'Gloom Stalker',
    parentClassId: 'ranger',
    minimumLevel: 3,
    source: src(124),
    featuresByLevel: {
      3: ['gloomStalker-dread-ambusher', 'gloomStalker-gloom-stalker-spells', 'gloomStalker-umbral-sight'],
      7: ['gloomStalker-iron-mind'],
      11: ['gloomStalker-stalkers-flurry'],
      15: ['gloomStalker-shadowy-dodge'],
    },
    resources: ['gloomStalkerDreadfulStrike'],
  },
  hunter: {
    id: 'hunter',
    name: 'Hunter',
    parentClassId: 'ranger',
    minimumLevel: 3,
    source: src(126),
    featuresByLevel: {
      3: ["hunter-hunters-lore", "hunter-hunters-prey"],
      7: ['hunter-defensive-tactics'],
      11: ["hunter-superior-hunters-prey"],
      15: ["hunter-superior-hunters-defense"],
    },
    choiceIds: ['hunter-hunters-prey-choice', 'hunter-defensive-tactics-choice'],
  },
}

const huntersPreyOptions: ChoiceOptionDefinition[] = [
  { id: 'huntersPrey-colossusSlayer', label: 'Colossus Slayer — once per turn, a hit deals an extra 1d8 damage if the target is missing any HP', source: src(126) },
  { id: 'huntersPrey-hordeBreaker', label: "Horde Breaker — once per turn on an attack, also attack a different creature within 5 ft of the original target", source: src(126) },
]
const defensiveTacticsOptions: ChoiceOptionDefinition[] = [
  { id: 'defensiveTactics-escapeTheHorde', label: 'Escape the Horde — Opportunity Attacks against you have Disadvantage', source: src(126) },
  { id: 'defensiveTactics-multiattackDefense', label: 'Multiattack Defense — a creature that hits you has Disadvantage on other attack rolls against you this turn', source: src(126) },
]

export const rangerSubclassChoiceOptions: Record<string, ChoiceOptionDefinition> = {
  ...Object.fromEntries(huntersPreyOptions.map((o) => [o.id, o])),
  ...Object.fromEntries(defensiveTacticsOptions.map((o) => [o.id, o])),
}

export const rangerSubclassChoices: Record<string, ChoiceDefinition> = {
  'hunter-hunters-prey-choice': {
    id: 'hunter-hunters-prey-choice',
    label: "Hunter's Prey",
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['onLevelUp', 'onShortRest', 'onLongRest'],
    optionIds: huntersPreyOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onShortRest', maxReplacements: 'unlimited' }, { timing: 'onLongRest', maxReplacements: 'unlimited' }],
    source: src(126),
  },
  'hunter-defensive-tactics-choice': {
    id: 'hunter-defensive-tactics-choice',
    label: 'Defensive Tactics',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['onLevelUp', 'onShortRest', 'onLongRest'],
    optionIds: defensiveTacticsOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onShortRest', maxReplacements: 'unlimited' }, { timing: 'onLongRest', maxReplacements: 'unlimited' }],
    source: src(126),
  },
}

export const rangerSubclassResources: Record<string, ResourceDefinition> = {
  feyWandererFeyReinforcements: {
    id: 'feyWandererFeyReinforcements',
    name: 'Fey Reinforcements (free Summon Fey)',
    minimumLevel: 11,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(124),
  },
  feyWandererMistyWanderer: {
    id: 'feyWandererMistyWanderer',
    name: 'Misty Wanderer (free Misty Step)',
    minimumLevel: 15,
    maximum: { kind: 'abilityModifier', ability: 'Wisdom', minimum: 1 },
    refresh: { default: ['longRest'] },
    source: src(124),
  },
  gloomStalkerDreadfulStrike: {
    id: 'gloomStalkerDreadfulStrike',
    name: 'Dreadful Strike',
    minimumLevel: 3,
    maximum: { kind: 'abilityModifier', ability: 'Wisdom', minimum: 1 },
    refresh: { default: ['longRest'] },
    source: src(124),
  },
}

export const rangerSubclassFeatures: Record<string, FeatureDefinition> = {
  // ---- Beast Master ----
  'beastMaster-primal-companion': {
    id: 'beastMaster-primal-companion',
    name: 'Primal Companion',
    source: src(121),
    minimumLevel: 3,
    activation: 'passive',
    summary:
      'Summon a primal Beast companion (Beast of the Land/Sea/Sky stat block, your choice) that fights alongside you and obeys your commands; command it via a Bonus Action or sacrifice one Attack-action attack for its Beast\'s Strike. Restore a dead companion (within the last hour) with a Magic action + a spell slot, or summon a fresh one on any Long Rest. (Beast stat blocks are not modeled — track the companion narratively.)',
  },
  'beastMaster-exceptional-training': {
    id: 'beastMaster-exceptional-training',
    name: 'Exceptional Training',
    source: src(122),
    minimumLevel: 7,
    activation: 'passive',
    summary: "Command your Beast to also take Dash, Disengage, Dodge, or Help as its Bonus Action; its attacks can deal Force damage instead of their normal type.",
  },
  'beastMaster-bestial-fury': {
    id: 'beastMaster-bestial-fury',
    name: 'Bestial Fury',
    source: src(122),
    minimumLevel: 11,
    activation: 'passive',
    summary: "Your Beast's Strike can be used twice when commanded; the first time each turn it hits a creature marked by your Hunter's Mark, it deals that spell's extra Force damage too.",
  },
  'beastMaster-share-spells': {
    id: 'beastMaster-share-spells',
    name: 'Share Spells',
    source: src(122),
    minimumLevel: 15,
    activation: 'passive',
    summary: 'A self-targeted spell can also affect your Beast companion if it is within 30 ft of you.',
  },
  // ---- Fey Wanderer ----
  'feyWanderer-dreadful-strikes': {
    id: 'feyWanderer-dreadful-strikes',
    name: 'Dreadful Strikes',
    source: src(123),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Once per turn on a weapon hit, deal an extra 1d4 Psychic damage (1d6 at level 11).',
  },
  'feyWanderer-fey-wanderer-spells': {
    id: 'feyWanderer-fey-wanderer-spells',
    name: 'Fey Wanderer Spells',
    source: src(123),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Always-prepared spells by level: 3 — Charm Person; 5 — Misty Step; 9 — Summon Fey; 13 — Dimension Door; 17 — Mislead. (Charm Person is in the registry; the rest are not yet — description only for those.)',
  },
  'feyWanderer-otherworldly-clamour': {
    id: 'feyWanderer-otherworldly-clamour',
    name: 'Otherworldly Clamour',
    source: src(123),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Add your Wisdom modifier (min +1) to Charisma checks; gain proficiency in Deception, Performance, or Persuasion (your choice).',
  },
  'feyWanderer-beguiling-twist': {
    id: 'feyWanderer-beguiling-twist',
    name: 'Beguiling Twist',
    source: src(124),
    minimumLevel: 6,
    activation: 'reaction',
    summary: 'Advantage on saves to avoid/end Charmed or Frightened. When you or a creature within 120 ft succeeds on such a save, you can force a different creature within 120 ft to make a Wisdom save or be Charmed/Frightened (your choice) for 1 minute.',
  },
  'feyWanderer-fey-reinforcements': {
    id: 'feyWanderer-fey-reinforcements',
    name: 'Fey Reinforcements',
    source: src(124),
    minimumLevel: 11,
    activation: 'special',
    resourceId: 'feyWandererFeyReinforcements',
    summary: "Cast Summon Fey without a Material component, and once without a slot per Long Rest (optionally trading Concentration for a fixed 1-minute duration).",
  },
  'feyWanderer-misty-wanderer': {
    id: 'feyWanderer-misty-wanderer',
    name: 'Misty Wanderer',
    source: src(124),
    minimumLevel: 15,
    activation: 'special',
    resourceId: 'feyWandererMistyWanderer',
    summary: 'Cast Misty Step without a slot, optionally bringing a willing creature within 5 ft along. Uses = Wisdom modifier (min 1), refilling on a Long Rest.',
  },
  // ---- Gloom Stalker ----
  'gloomStalker-dread-ambusher': {
    id: 'gloomStalker-dread-ambusher',
    name: 'Dread Ambusher',
    source: src(124),
    minimumLevel: 3,
    activation: 'passive',
    resourceId: 'gloomStalkerDreadfulStrike',
    summary: "Ambusher's Leap: +10 ft Speed on your first turn of combat. Dreadful Strike: once per turn on a weapon hit, expend a use for an extra 2d6 Psychic damage (uses = Wisdom modifier, min 1, refilling on a Long Rest). Initiative Bonus: add your Wisdom modifier to Initiative rolls.",
  },
  'gloomStalker-gloom-stalker-spells': {
    id: 'gloomStalker-gloom-stalker-spells',
    name: 'Gloom Stalker Spells',
    source: src(125),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Always-prepared spells by level: 3 — Disguise Self; 5 — Rope Trick; 9 — Fear; 13 — Greater Invisibility; 17 — Seeming. (Not yet in the spell registry — description only.)',
  },
  'gloomStalker-umbral-sight': {
    id: 'gloomStalker-umbral-sight',
    name: 'Umbral Sight',
    source: src(125),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Darkvision 60 ft (or +60 ft if you already have it). While entirely in Darkness, Invisible to creatures relying on Darkvision to see you there.',
  },
  'gloomStalker-iron-mind': {
    id: 'gloomStalker-iron-mind',
    name: 'Iron Mind',
    source: src(125),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'Proficiency in Wisdom saving throws (or Intelligence/Charisma, your choice, if you already have Wisdom).',
  },
  'gloomStalker-stalkers-flurry': {
    id: 'gloomStalker-stalkers-flurry',
    name: "Stalker's Flurry",
    source: src(125),
    minimumLevel: 11,
    activation: 'passive',
    summary: "Dreadful Strike's damage becomes 2d6; when used, also choose Sudden Strike (attack a different creature within 5 ft of the target) or Mass Fear (target and creatures within 10 ft Wisdom save or Frightened until your next turn).",
  },
  'gloomStalker-shadowy-dodge': {
    id: 'gloomStalker-shadowy-dodge',
    name: 'Shadowy Dodge',
    source: src(125),
    minimumLevel: 15,
    activation: 'reaction',
    summary: 'Impose Disadvantage on an attack roll against you; whether it hits or misses, teleport up to 30 ft to a space you can see.',
  },
  // ---- Hunter ----
  'hunter-hunters-lore': {
    id: 'hunter-hunters-lore',
    name: "Hunter's Lore",
    source: src(126),
    minimumLevel: 3,
    activation: 'passive',
    summary: "While a creature is marked by your Hunter's Mark, know its Immunities, Resistances, and Vulnerabilities, if any.",
  },
  'hunter-hunters-prey': {
    id: 'hunter-hunters-prey',
    name: "Hunter's Prey",
    source: src(126),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Choose Colossus Slayer or Horde Breaker; swap your choice on any Short or Long Rest.',
    choices: ['hunter-hunters-prey-choice'],
  },
  'hunter-defensive-tactics': {
    id: 'hunter-defensive-tactics',
    name: 'Defensive Tactics',
    source: src(126),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'Choose Escape the Horde or Multiattack Defense; swap your choice on any Short or Long Rest.',
    choices: ['hunter-defensive-tactics-choice'],
  },
  'hunter-superior-hunters-prey': {
    id: 'hunter-superior-hunters-prey',
    name: "Superior Hunter's Prey",
    source: src(126),
    minimumLevel: 11,
    activation: 'passive',
    summary: "Once per turn, when you deal Hunter's Mark damage to the marked creature, also deal it to a different creature within 30 ft of the first.",
  },
  'hunter-superior-hunters-defense': {
    id: 'hunter-superior-hunters-defense',
    name: "Superior Hunter's Defense",
    source: src(126),
    minimumLevel: 15,
    activation: 'reaction',
    summary: 'When you take damage, gain Resistance to that damage type (and any other of the same type) until the end of the current turn.',
  },
}
