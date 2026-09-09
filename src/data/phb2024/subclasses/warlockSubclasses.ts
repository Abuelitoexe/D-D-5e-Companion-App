import type { FeatureDefinition, ResourceDefinition, SubclassDefinition } from '../../../domain/types'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

export const warlockSubclasses: Record<string, SubclassDefinition> = {
  archfeyPatron: {
    id: 'archfeyPatron',
    name: 'Archfey Patron',
    parentClassId: 'warlock',
    minimumLevel: 3,
    source: src(371),
    featuresByLevel: {
      3: ['archfeyPatron-archfeySpells', 'archfeyPatron-stepsOfTheFey'],
      6: ['archfeyPatron-mistyEscape'],
      10: ['archfeyPatron-beguilingDefenses'],
      14: ['archfeyPatron-bewitchingMagic'],
    },
    resources: ['stepsOfTheFey'],
  },
  celestialPatron: {
    id: 'celestialPatron',
    name: 'Celestial Patron',
    parentClassId: 'warlock',
    minimumLevel: 3,
    source: src(447),
    featuresByLevel: {
      3: ['celestialPatron-celestialSpells', 'celestialPatron-healingLight'],
      6: ['celestialPatron-radiantSoul'],
      10: ['celestialPatron-celestialResilience'],
      14: ['celestialPatron-searingVengeance'],
    },
    resources: ['healingLightDice'],
  },
  fiendPatron: {
    id: 'fiendPatron',
    name: 'Fiend Patron',
    parentClassId: 'warlock',
    minimumLevel: 3,
    source: src(512),
    featuresByLevel: {
      3: ['fiendPatron-darkOnesBlessing', 'fiendPatron-fiendSpells'],
      6: ['fiendPatron-darkOnesOwnLuck'],
      10: ['fiendPatron-fiendishResilience'],
      14: ['fiendPatron-hurlThroughHell'],
    },
    resources: ['darkOnesOwnLuck'],
  },
  greatOldOnePatron: {
    id: 'greatOldOnePatron',
    name: 'Great Old One Patron',
    parentClassId: 'warlock',
    minimumLevel: 3,
    source: src(576),
    featuresByLevel: {
      3: ['greatOldOnePatron-awakenedMind', 'greatOldOnePatron-greatOldOneSpells', 'greatOldOnePatron-psychicSpells'],
      6: ['greatOldOnePatron-clairvoyantCombatant'],
      10: ['greatOldOnePatron-eldritchHex', 'greatOldOnePatron-thoughtShield'],
      14: ['greatOldOnePatron-createThrall'],
    },
  },
}

export const warlockSubclassResources: Record<string, ResourceDefinition> = {
  stepsOfTheFey: {
    id: 'stepsOfTheFey',
    name: 'Steps of the Fey (free Misty Steps)',
    minimumLevel: 3,
    maximum: { kind: 'abilityModifier', ability: 'Charisma', minimum: 1 },
    refresh: { default: ['longRest'] },
    source: src(371),
  },
  healingLightDice: {
    id: 'healingLightDice',
    name: 'Healing Light (d6 pool)',
    minimumLevel: 3,
    maximum: { kind: 'derived', base: 'classLevel', addend: 1, rounding: 'down' },
    refresh: { default: ['longRest'] },
    source: src(447),
  },
  darkOnesOwnLuck: {
    id: 'darkOnesOwnLuck',
    name: "Dark One's Own Luck",
    minimumLevel: 6,
    maximum: { kind: 'abilityModifier', ability: 'Charisma', minimum: 1 },
    refresh: { default: ['longRest'] },
    source: src(512),
  },
}

export const warlockSubclassFeatures: Record<string, FeatureDefinition> = {
  // --- Archfey Patron ---
  'archfeyPatron-archfeySpells': {
    id: 'archfeyPatron-archfeySpells',
    name: 'Archfey Spells',
    source: src(371),
    minimumLevel: 3,
    activation: 'passive',
    // Full always-prepared spell list not mechanically wired — most of these
    // (Calm Emotions, Faerie Fire, Phantasmal Force, Blink, Plant Growth,
    // Dominate Beast/Person, Greater Invisibility, Seeming) aren't in the
    // populated spell set yet (Phase 4 bulk population).
    summary: 'Always-prepared bonus spells by level: 3rd — Calm Emotions, Faerie Fire, Misty Step, Phantasmal Force, Sleep; 5th — Blink, Plant Growth; 7th — Dominate Beast, Greater Invisibility; 9th — Dominate Person, Seeming.',
  },
  'archfeyPatron-stepsOfTheFey': {
    id: 'archfeyPatron-stepsOfTheFey',
    name: 'Steps of the Fey',
    source: src(371),
    minimumLevel: 3,
    activation: 'special',
    summary: 'Cast Misty Step without a slot, a number of times equal to your Charisma modifier (min 1). Adds Refreshing Step or Taunting Step as an optional rider. Regain all uses on a Long Rest.',
    resourceId: 'stepsOfTheFey',
  },
  'archfeyPatron-mistyEscape': {
    id: 'archfeyPatron-mistyEscape',
    name: 'Misty Escape',
    source: src(371),
    minimumLevel: 6,
    activation: 'reaction',
    summary: 'Cast Misty Step as a Reaction to taking damage. Adds Disappearing Step and Dreadful Step as Steps of the Fey options.',
    resourceId: 'stepsOfTheFey',
  },
  'archfeyPatron-beguilingDefenses': {
    id: 'archfeyPatron-beguilingDefenses',
    name: 'Beguiling Defenses',
    source: src(371),
    minimumLevel: 10,
    activation: 'reaction',
    summary: 'Immune to Charmed. Reaction on being hit: halve the damage and force a Wisdom save on the attacker or they take the damage you took as Psychic. Once per Long Rest unless you spend a Pact Magic slot.',
  },
  'archfeyPatron-bewitchingMagic': {
    id: 'archfeyPatron-bewitchingMagic',
    name: 'Bewitching Magic',
    source: src(371),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'After casting an Enchantment or Illusion spell (action + slot), cast Misty Step as part of the same action without a slot.',
  },

  // --- Celestial Patron ---
  'celestialPatron-celestialSpells': {
    id: 'celestialPatron-celestialSpells',
    name: 'Celestial Spells',
    source: src(447),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Always-prepared bonus spells by level: 3rd — Aid, Cure Wounds, Guiding Bolt, Lesser Restoration, Light, Sacred Flame; 5th — Daylight, Revivify; 7th — Guardian of Faith, Wall of Fire; 9th — Greater Restoration, Summon Celestial.',
  },
  'celestialPatron-healingLight': {
    id: 'celestialPatron-healingLight',
    name: 'Healing Light',
    source: src(447),
    minimumLevel: 3,
    activation: 'bonusAction',
    summary: 'A pool of d6s (1 + Warlock level) heals yourself or a creature within 60 feet; spend up to your Charisma modifier worth of dice at once. Pool refills on a Long Rest.',
    resourceId: 'healingLightDice',
  },
  'celestialPatron-radiantSoul': {
    id: 'celestialPatron-radiantSoul',
    name: 'Radiant Soul',
    source: src(447),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Resistance to Radiant damage. Once per turn, add your Charisma modifier to a Radiant or Fire spell\'s damage.',
  },
  'celestialPatron-celestialResilience': {
    id: 'celestialPatron-celestialResilience',
    name: 'Celestial Resilience',
    source: src(447),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'Gain Temporary HP (Warlock level + Charisma modifier) on using Magical Cunning or finishing a rest; up to 5 allies gain half that amount.',
  },
  'celestialPatron-searingVengeance': {
    id: 'celestialPatron-searingVengeance',
    name: 'Searing Vengeance',
    source: src(447),
    minimumLevel: 14,
    activation: 'special',
    summary: 'When you or a nearby ally would make a Death Save, erupt with radiant energy: that creature regains half its HP max and stands up; nearby foes take 2d8+Cha Radiant damage and are Blinded. Once per Long Rest.',
  },

  // --- Fiend Patron ---
  'fiendPatron-darkOnesBlessing': {
    id: 'fiendPatron-darkOnesBlessing',
    name: "Dark One's Blessing",
    source: src(512),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Reducing an enemy to 0 HP (or an ally doing so within 10 feet) grants Temporary HP equal to Charisma modifier + Warlock level (min 1).',
  },
  'fiendPatron-fiendSpells': {
    id: 'fiendPatron-fiendSpells',
    name: 'Fiend Spells',
    source: src(512),
    minimumLevel: 3,
    activation: 'passive',
    // Level 3 grant is fully in the registry; higher levels partially so —
    // not mechanically wired to avoid an incomplete alwaysPreparedGrants entry.
    summary: 'Always-prepared bonus spells by level: 3rd — Burning Hands, Command, Scorching Ray, Suggestion; 5th — Fireball, Stinking Cloud; 7th — Fire Shield, Wall of Fire; 9th — Geas, Insect Plague.',
  },
  'fiendPatron-darkOnesOwnLuck': {
    id: 'fiendPatron-darkOnesOwnLuck',
    name: "Dark One's Own Luck",
    source: src(512),
    minimumLevel: 6,
    activation: 'special',
    summary: 'Add 1d10 to an ability check or saving throw after seeing the roll. Uses equal to Charisma modifier (min 1), max once per roll. Regain all on a Long Rest.',
    resourceId: 'darkOnesOwnLuck',
  },
  'fiendPatron-fiendishResilience': {
    id: 'fiendPatron-fiendishResilience',
    name: 'Fiendish Resilience',
    source: src(512),
    minimumLevel: 10,
    activation: 'special',
    summary: 'Choose a damage type (not Force) on finishing a rest; gain Resistance to it until you choose again.',
  },
  'fiendPatron-hurlThroughHell': {
    id: 'fiendPatron-hurlThroughHell',
    name: 'Hurl Through Hell',
    source: src(512),
    minimumLevel: 14,
    activation: 'special',
    summary: 'Once per turn on a hit, force a Charisma save or banish the target through the Lower Planes: 8d10 Psychic damage (unless a Fiend) and Incapacitated until your next turn. Once per Long Rest unless you spend a Pact Magic slot.',
  },

  // --- Great Old One Patron ---
  'greatOldOnePatron-awakenedMind': {
    id: 'greatOldOnePatron-awakenedMind',
    name: 'Awakened Mind',
    source: src(576),
    minimumLevel: 3,
    activation: 'bonusAction',
    summary: 'Telepathic link with one creature within 30 feet, lasting minutes equal to your Warlock level (miles equal to Charisma modifier apart).',
  },
  'greatOldOnePatron-greatOldOneSpells': {
    id: 'greatOldOnePatron-greatOldOneSpells',
    name: 'Great Old One Spells',
    source: src(576),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Always-prepared bonus spells by level: 3rd — Detect Thoughts, Dissonant Whispers, Phantasmal Force, Tasha\'s Hideous Laughter; 5th — Clairvoyance, Hunger of Hadar; 7th — Confusion, Summon Aberration; 9th — Modify Memory, Telekinesis.',
  },
  'greatOldOnePatron-psychicSpells': {
    id: 'greatOldOnePatron-psychicSpells',
    name: 'Psychic Spells',
    source: src(576),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Change a damage spell\'s type to Psychic. Cast Enchantment/Illusion Warlock spells without Verbal or Somatic components.',
  },
  'greatOldOnePatron-clairvoyantCombatant': {
    id: 'greatOldOnePatron-clairvoyantCombatant',
    name: 'Clairvoyant Combatant',
    source: src(576),
    minimumLevel: 6,
    activation: 'special',
    summary: 'Force a Wisdom save on a creature you\'re telepathically bonded with: on a failure, it has Disadvantage against you and you have Advantage against it for the bond\'s duration. Once per Short/Long Rest unless you spend a Pact Magic slot.',
  },
  'greatOldOnePatron-eldritchHex': {
    id: 'greatOldOnePatron-eldritchHex',
    name: 'Eldritch Hex',
    source: src(576),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'Always have Hex prepared; when cast, the target also has Disadvantage on saves of the chosen ability.',
  },
  'greatOldOnePatron-thoughtShield': {
    id: 'greatOldOnePatron-thoughtShield',
    name: 'Thought Shield',
    source: src(576),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'Immune to telepathy unless you allow it. Resistance to Psychic damage; a creature dealing you Psychic damage takes the same amount back.',
  },
  'greatOldOnePatron-createThrall': {
    id: 'greatOldOnePatron-createThrall',
    name: 'Create Thrall',
    source: src(576),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'Cast Summon Aberration without Concentration (1 minute duration, bonus Temp HP); while a Hexed creature is hit by it, deal extra Psychic damage equal to Hex\'s bonus damage.',
  },
}
