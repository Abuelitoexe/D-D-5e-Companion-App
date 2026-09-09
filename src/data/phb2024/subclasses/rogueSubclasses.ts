import type { FeatureDefinition, ResourceDefinition, SpellcastingDefinition, SubclassDefinition } from '../../../domain/types'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// Arcane Trickster Spellcasting table, PHB 2024 p.132 — same shape as
// Eldritch Knight (subclass-granted, Wizard-list, knownList/level-up swap).
export const arcaneTricksterSpellcasting: SpellcastingDefinition = {
  ability: 'Intelligence',
  slotProgression: 'custom',
  cantripProgression: { 3: 3, 10: 4 },
  preparedSource: 'knownList',
  preparedCountFormula: { kind: 'levelTable', table: { 3: 3, 4: 4, 7: 5, 8: 6, 10: 7, 11: 8, 13: 9, 14: 10, 16: 11, 19: 12, 20: 13 } },
  swapPolicy: { timing: ['onLevelUp'], count: 1 },
  slotTable: {
    3: { 1: 2 }, 4: { 1: 3 }, 5: { 1: 3 }, 6: { 1: 3 },
    7: { 1: 4, 2: 2 }, 8: { 1: 4, 2: 2 }, 9: { 1: 4, 2: 2 },
    10: { 1: 4, 2: 3 }, 11: { 1: 4, 2: 3 }, 12: { 1: 4, 2: 3 },
    13: { 1: 4, 2: 3, 3: 2 }, 14: { 1: 4, 2: 3, 3: 2 }, 15: { 1: 4, 2: 3, 3: 2 },
    16: { 1: 4, 2: 3, 3: 3 }, 17: { 1: 4, 2: 3, 3: 3 }, 18: { 1: 4, 2: 3, 3: 3 },
    19: { 1: 4, 2: 3, 3: 3 }, 20: { 1: 4, 2: 3, 3: 3 },
  },
  ritualCasting: { fromSpellbookOnly: false, requiresPreparation: true },
  spellListId: 'wizard',
  source: src(132),
}

export const rogueSubclasses: Record<string, SubclassDefinition> = {
  arcaneTrickster: {
    id: 'arcaneTrickster',
    name: 'Arcane Trickster',
    parentClassId: 'rogue',
    minimumLevel: 3,
    source: src(132),
    featuresByLevel: {
      3: ['arcaneTrickster-spellcasting', 'arcaneTrickster-mageHandLegerdemain'],
      9: ['arcaneTrickster-magicalAmbush'],
      13: ['arcaneTrickster-versatileTrickster'],
      17: ['arcaneTrickster-spellThief'],
    },
    spellcasting: arcaneTricksterSpellcasting,
  },
  assassin: {
    id: 'assassin',
    name: 'Assassin',
    parentClassId: 'rogue',
    minimumLevel: 3,
    source: src(133),
    featuresByLevel: {
      3: ['assassin-assassinate', 'assassin-assassinsTools'],
      9: ['assassin-infiltrationExpertise'],
      13: ['assassin-envenomWeapons'],
      17: ['assassin-deathStrike'],
    },
  },
  soulknife: {
    id: 'soulknife',
    name: 'Soulknife',
    parentClassId: 'rogue',
    minimumLevel: 3,
    source: src(133),
    featuresByLevel: {
      3: ['soulknife-psionicPower', 'soulknife-psychicBlades'],
      9: ['soulknife-soulBlades'],
      13: ['soulknife-psychicVeil'],
      17: ['soulknife-rendMind'],
    },
    resources: ['soulknifePsionicEnergyDice'],
  },
  thief: {
    id: 'thief',
    name: 'Thief',
    parentClassId: 'rogue',
    minimumLevel: 3,
    source: src(134),
    featuresByLevel: {
      3: ['thief-fastHands', 'thief-secondStoryWork'],
      9: ['thief-supremeSneak'],
      13: ['thief-useMagicDevice'],
      17: ['thief-thiefsReflexes'],
    },
  },
}

export const rogueSubclassResources: Record<string, ResourceDefinition> = {
  soulknifePsionicEnergyDice: {
    id: 'soulknifePsionicEnergyDice',
    name: 'Psionic Energy Dice',
    minimumLevel: 3,
    // Die size: d6(3) -> d8(5) -> d10(11) -> d12(17); count tracked here, die
    // size noted in the feature text (same pattern as Psi Warrior).
    maximum: { kind: 'levelTable', table: { 3: 4, 5: 6, 9: 8, 13: 10, 17: 12 } },
    refresh: { default: ['shortRest', 'longRest'] },
    partialRefresh: { shortRest: { kind: 'flat', value: 1 } },
    source: src(133),
  },
}

export const rogueSubclassFeatures: Record<string, FeatureDefinition> = {
  // --- Arcane Trickster ---
  'arcaneTrickster-spellcasting': {
    id: 'arcaneTrickster-spellcasting',
    name: 'Spellcasting',
    source: src(132),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Cast Wizard spells using Intelligence. Know 3 cantrips (Mage Hand + 2, 4th at level 10). Prepare a growing list of level 1+ Wizard spells; replace one on each Rogue level gained.',
  },
  'arcaneTrickster-mageHandLegerdemain': {
    id: 'arcaneTrickster-mageHandLegerdemain',
    name: 'Mage Hand Legerdemain',
    source: src(132),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Cast Mage Hand as a Bonus Action; the hand can be Invisible, and you control it (and make Sleight of Hand checks with it) as a Bonus Action.',
  },
  'arcaneTrickster-magicalAmbush': {
    id: 'arcaneTrickster-magicalAmbush',
    name: 'Magical Ambush',
    source: src(132),
    minimumLevel: 9,
    activation: 'passive',
    summary: 'While Invisible, a creature you cast a spell on has Disadvantage on its save against that spell this turn.',
  },
  'arcaneTrickster-versatileTrickster': {
    id: 'arcaneTrickster-versatileTrickster',
    name: 'Versatile Trickster',
    source: src(132),
    minimumLevel: 13,
    activation: 'passive',
    summary: "Using Cunning Strike's Trip option can also target a second creature within 5 feet of your Mage Hand.",
  },
  'arcaneTrickster-spellThief': {
    id: 'arcaneTrickster-spellThief',
    name: 'Spell Thief',
    source: src(132),
    minimumLevel: 17,
    activation: 'reaction',
    summary: 'Force an Intelligence save on a creature that targets you with a spell; on a failure, negate it and steal the spell (if level 1+ and castable by you) to have prepared for 8 hours. Once per Long Rest.',
  },

  // --- Assassin ---
  'assassin-assassinate': {
    id: 'assassin-assassinate',
    name: 'Assassinate',
    source: src(133),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Advantage on Initiative rolls. During the first round of combat, Advantage on attacks against creatures that haven\'t acted; a Sneak Attack hit that round adds extra damage equal to your Rogue level.',
  },
  'assassin-assassinsTools': {
    id: 'assassin-assassinsTools',
    name: "Assassin's Tools",
    source: src(133),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Gain a Disguise Kit and a Poisoner\'s Kit, with proficiency in both.',
  },
  'assassin-infiltrationExpertise': {
    id: 'assassin-infiltrationExpertise',
    name: 'Infiltration Expertise',
    source: src(133),
    minimumLevel: 9,
    activation: 'passive',
    summary: 'Mimic another person\'s speech/handwriting after 1 hour of study. Steady Aim no longer reduces your Speed to 0.',
  },
  'assassin-envenomWeapons': {
    id: 'assassin-envenomWeapons',
    name: 'Envenom Weapons',
    source: src(133),
    minimumLevel: 13,
    activation: 'passive',
    summary: "Cunning Strike's Poison option also deals 2d6 Poison damage on a failed save, ignoring Poison Resistance.",
  },
  'assassin-deathStrike': {
    id: 'assassin-deathStrike',
    name: 'Death Strike',
    source: src(133),
    minimumLevel: 17,
    activation: 'passive',
    summary: 'A Sneak Attack hit on the first round of combat forces a Constitution save (DC 8 + Dex mod + Proficiency Bonus) or the damage is doubled.',
  },

  // --- Soulknife ---
  'soulknife-psionicPower': {
    id: 'soulknife-psionicPower',
    name: 'Psionic Power',
    source: src(133),
    minimumLevel: 3,
    activation: 'special',
    summary: 'Gain Psionic Energy Dice (d6 at level 3, growing to d12 by 17). Fuels Psi-Bolstered Knack (reroll a failed proficient check) and Psychic Whispers (telepathy, Magic action). Regain 1 on Short Rest, all on Long Rest.',
    resourceId: 'soulknifePsionicEnergyDice',
  },
  'soulknife-psychicBlades': {
    id: 'soulknife-psychicBlades',
    name: 'Psychic Blades',
    source: src(133),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Manifest a Psychic Blade (1d6 Psychic + ability modifier, Finesse, Thrown 60/120, Vex) when you Attack or make an Opportunity Attack. A second blade attack (1d4) is available as a Bonus Action if your other hand is free.',
  },
  'soulknife-soulBlades': {
    id: 'soulknife-soulBlades',
    name: 'Soul Blades',
    source: src(133),
    minimumLevel: 9,
    activation: 'special',
    summary: 'Homing Strikes (spend a Psionic Energy Die to turn a Psychic Blade miss into a possible hit) and Psychic Teleportation (Bonus Action: throw a blade and teleport to it).',
    resourceId: 'soulknifePsionicEnergyDice',
  },
  'soulknife-psychicVeil': {
    id: 'soulknife-psychicVeil',
    name: 'Psychic Veil',
    source: src(133),
    minimumLevel: 13,
    activation: 'special',
    summary: 'Magic action: become Invisible for 1 hour (ends early on damage/forcing a save). Once per Long Rest unless you spend a Psionic Energy Die.',
    resourceId: 'soulknifePsionicEnergyDice',
  },
  'soulknife-rendMind': {
    id: 'soulknife-rendMind',
    name: 'Rend Mind',
    source: src(133),
    minimumLevel: 17,
    activation: 'special',
    summary: 'On a Psychic Blade Sneak Attack hit, force a Wisdom save or Stun for 1 minute (repeats save each turn). Once per Long Rest unless you spend 3 Psionic Energy Dice.',
    resourceId: 'soulknifePsionicEnergyDice',
  },

  // --- Thief ---
  'thief-fastHands': {
    id: 'thief-fastHands',
    name: 'Fast Hands',
    source: src(134),
    minimumLevel: 3,
    activation: 'bonusAction',
    summary: 'Bonus Action: Sleight of Hand check (lock/trap/pocket) with Thieves\' Tools, or Utilize, or Magic action to use a magic item.',
    grantsActionIds: ['utilize'],
  },
  'thief-secondStoryWork': {
    id: 'thief-secondStoryWork',
    name: 'Second-Story Work',
    source: src(134),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Gain a Climb Speed equal to your Speed; use Dexterity instead of Strength for jump distance.',
  },
  'thief-supremeSneak': {
    id: 'thief-supremeSneak',
    name: 'Supreme Sneak',
    source: src(134),
    minimumLevel: 9,
    activation: 'passive',
    summary: 'New Cunning Strike option: Stealth Attack (cost 1d6) — attacking while Hidden doesn\'t break your Invisible condition if you end the turn behind Three-Quarters or Total Cover.',
  },
  'thief-useMagicDevice': {
    id: 'thief-useMagicDevice',
    name: 'Use Magic Device',
    source: src(134),
    minimumLevel: 13,
    activation: 'passive',
    summary: 'Attune to up to 4 magic items. 1-in-6 chance to use a charge-based item property without expending a charge. Use any Spell Scroll via Intelligence (Arcana check for higher-level spells).',
  },
  'thief-thiefsReflexes': {
    id: 'thief-thiefsReflexes',
    name: "Thief's Reflexes",
    source: src(134),
    minimumLevel: 17,
    activation: 'passive',
    summary: 'Take two turns during the first round of combat: one at your normal Initiative, one at Initiative minus 10.',
  },
}
