import type { FeatDefinition } from '../../domain/types'

const source = { sourceId: 'PHB2024', sourceLabel: 'PHB 2024' } as const

/**
 * All PHB 2024 feats except Epic Boon feats (level 19+, deferred — vanishingly
 * rare to reach and not yet requested): Ability Score Improvement, all 10
 * Origin feats, all 42 General feats, and all 10 Fighting Style feats.
 */
export const feats: Record<string, FeatDefinition> = {
  abilityScoreImprovement: {
    id: 'abilityScoreImprovement',
    name: 'Ability Score Improvement',
    source: { ...source, page: 202 },
    category: 'general',
    passiveSummary: 'Increase one ability score by 2, or two ability scores by 1 each (max 20). Repeatable.',
    repeatable: true,
  },
  savageAttacker: {
    id: 'savageAttacker',
    name: 'Savage Attacker',
    source: { ...source, page: 207 },
    category: 'origin',
    passiveSummary: 'Once per turn when you hit with a weapon, you can roll its damage dice twice and use either roll.',
  },

  // Remaining Origin feats — PHB 2024 p.200-201, granted automatically by a
  // background's originFeatId or (for Human's Versatile trait) player-chosen.
  alert: {
    id: 'alert',
    name: 'Alert',
    source: { ...source, page: 200 },
    category: 'origin',
    passiveSummary: 'Add your Proficiency Bonus to Initiative rolls. You can also swap your Initiative with a willing ally\'s immediately after rolling.',
  },
  crafter: {
    id: 'crafter',
    name: 'Crafter',
    source: { ...source, page: 200 },
    category: 'origin',
    passiveSummary: 'Proficiency with three Artisan\'s Tools, a 20% discount on nonmagical items, and the ability to Fast Craft one item from the Fast Crafting table on a Long Rest (lasts until your next Long Rest).',
  },
  healer: {
    id: 'healer',
    name: 'Healer',
    source: { ...source, page: 200 },
    category: 'origin',
    passiveSummary: 'Spend a Healer\'s Kit use as a Utilize action to let a creature within 5 feet spend a Hit Point Die, healing the roll + your Proficiency Bonus. Reroll 1s on healing dice from this or spells.',
  },
  lucky: {
    id: 'lucky',
    name: 'Lucky',
    source: { ...source, page: 200 },
    category: 'origin',
    passiveSummary: 'You have Luck Points equal to your Proficiency Bonus (regained on Long Rest). Spend 1 to gain Advantage on a d20 Test, or to impose Disadvantage on an attack roll against you.',
  },
  magicInitiateCleric: {
    id: 'magicInitiateCleric',
    name: 'Magic Initiate (Cleric)',
    source: { ...source, page: 200 },
    category: 'origin',
    passiveSummary: 'Learn 2 cantrips and 1 always-prepared level 1 spell from the Cleric spell list (castable once free per Long Rest, or via a spell slot). Int/Wis/Cha is your spellcasting ability, chosen when selected.',
    repeatable: true,
  },
  magicInitiateDruid: {
    id: 'magicInitiateDruid',
    name: 'Magic Initiate (Druid)',
    source: { ...source, page: 200 },
    category: 'origin',
    passiveSummary: 'Learn 2 cantrips and 1 always-prepared level 1 spell from the Druid spell list (castable once free per Long Rest, or via a spell slot). Int/Wis/Cha is your spellcasting ability, chosen when selected.',
    repeatable: true,
  },
  magicInitiateWizard: {
    id: 'magicInitiateWizard',
    name: 'Magic Initiate (Wizard)',
    source: { ...source, page: 200 },
    category: 'origin',
    passiveSummary: 'Learn 2 cantrips and 1 always-prepared level 1 spell from the Wizard spell list (castable once free per Long Rest, or via a spell slot). Int/Wis/Cha is your spellcasting ability, chosen when selected.',
    repeatable: true,
  },
  musician: {
    id: 'musician',
    name: 'Musician',
    source: { ...source, page: 201 },
    category: 'origin',
    passiveSummary: 'Proficiency with three Musical Instruments. On finishing a Short or Long Rest, play to give Heroic Inspiration to a number of allies who hear it equal to your Proficiency Bonus.',
  },
  skilled: {
    id: 'skilled',
    name: 'Skilled',
    source: { ...source, page: 201 },
    category: 'origin',
    passiveSummary: 'Gain proficiency in any combination of three skills or tools of your choice.',
    repeatable: true,
  },
  tavernBrawler: {
    id: 'tavernBrawler',
    name: 'Tavern Brawler',
    source: { ...source, page: 201 },
    category: 'origin',
    passiveSummary: 'Unarmed Strikes deal 1d4 + Strength Bludgeoning damage (reroll 1s) and proficiency with improvised weapons; once per turn, an Unarmed Strike hit as part of the Attack action can also push the target 5 feet.',
  },
  tough: {
    id: 'tough',
    name: 'Tough',
    source: { ...source, page: 201 },
    category: 'origin',
    passiveSummary: 'Hit Point maximum increases by twice your character level when gained, then by 2 more for every level gained thereafter.',
  },

  // General feats — PHB 2024 p.202-208. All require Level 4+ (expressed via
  // prerequisites); a single-ability minimum score is also expressed where
  // the feat requires exactly one ability (e.g. Actor/Charisma). Where the
  // real prerequisite is an ability-score OR (e.g. "Strength or Dexterity
  // 13+") or a feature/training check (e.g. "Shield Training", "Spellcasting
  // or Pact Magic Feature"), the Prerequisite union has no OR or
  // feature-training primitive to express it, so it's stated in the summary
  // text only and not engine-enforced — consistent with every other
  // "known simplification" in this project (Rage's per-subclass damage,
  // Wild Shape's forms, etc.) rather than a special-cased type extension.
  actor: { id: 'actor', name: 'Actor', source: { ...source, page: 202 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }, { kind: 'abilityScoreAtLeast', ability: 'Charisma', score: 13 }], passiveSummary: '+1 Charisma (max 20). Advantage on Deception/Performance checks to pass as someone you\'re disguised as. Can mimic sounds/speech (target Insight check DC 8 + Cha mod + Prof to detect).' },
  athlete: { id: 'athlete', name: 'Athlete', source: { ...source, page: 202 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20; requires Str or Dex 13+). Climb Speed = Speed. Stand from Prone for only 5 feet of movement. Running Long/High Jump after moving only 5 feet.' },
  charger: { id: 'charger', name: 'Charger', source: { ...source, page: 202 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20; requires Str or Dex 13+). Dash grants +10 feet Speed. After moving 10+ feet in a line before a melee hit: +1d8 damage or push 10 feet (once per turn).' },
  chef: { id: 'chef', name: 'Chef', source: { ...source, page: 202 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Constitution or Wisdom (max 20). Proficiency with Cook\'s Utensils. Short Rest: cook food for 4+Proficiency Bonus creatures, granting +1d8 HP on a Hit Die spend. Long Rest (or 1 hour): cook Proficiency-Bonus treats granting Temp HP as a Bonus Action.' },
  crossbowExpert: { id: 'crossbowExpert', name: 'Crossbow Expert', source: { ...source, page: 203 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }, { kind: 'abilityScoreAtLeast', ability: 'Dexterity', score: 13 }], passiveSummary: '+1 Dexterity (max 20). Ignore the Loading property of crossbows. No Disadvantage firing crossbows within 5 feet of an enemy. Add ability modifier to a Light-crossbow extra attack\'s damage.' },
  crusher: { id: 'crusher', name: 'Crusher', source: { ...source, page: 203 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Constitution (max 20). Once per turn, a Bludgeoning hit can push the target 5 feet. A Bludgeoning Critical Hit gives Advantage on attacks against that target until your next turn.' },
  defensiveDuelist: { id: 'defensiveDuelist', name: 'Defensive Duelist', source: { ...source, page: 203 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }, { kind: 'abilityScoreAtLeast', ability: 'Dexterity', score: 13 }], passiveSummary: '+1 Dexterity (max 20). While holding a Finesse weapon, Reaction to add Proficiency Bonus to AC against one melee attack.' },
  dualWielder: { id: 'dualWielder', name: 'Dual Wielder', source: { ...source, page: 203 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20; requires Str or Dex 13+). Attacking with a Light weapon lets you make one extra Bonus Action attack with a different non-Two-Handed Melee weapon. Draw/stow two non-Two-Handed weapons at once.' },
  durable: { id: 'durable', name: 'Durable', source: { ...source, page: 203 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Constitution (max 20). Advantage on Death Saving Throws. Bonus Action: spend a Hit Point Die to regain HP equal to the roll.' },
  elementalAdept: {
    id: 'elementalAdept', name: 'Elemental Adept', source: { ...source, page: 203 }, category: 'general',
    prerequisites: [{ kind: 'minimumLevel', level: 4 }],
    passiveSummary: '+1 Int/Wis/Cha (max 20; requires a Spellcasting or Pact Magic feature). Choose a damage type (Acid/Cold/Fire/Lightning/Thunder): your spells of that type ignore Resistance, and you can treat a 1 on a damage die as a 2. Repeatable with a different damage type each time.',
    repeatable: true,
  },
  feyTouched: { id: 'feyTouched', name: 'Fey-Touched', source: { ...source, page: 203 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Int/Wis/Cha (max 20). Choose a level 1 Divination or Enchantment spell; you always have it and Misty Step prepared, each castable once free per Long Rest (or via a spell slot).' },
  grappler: { id: 'grappler', name: 'Grappler', source: { ...source, page: 204 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20; requires Str or Dex 13+). An Unarmed Strike hit can also Grapple (once per turn). Advantage on attacks against a creature you\'ve Grappled. Moving a same-or-smaller Grappled creature doesn\'t halve your Speed.' },
  greatWeaponMaster: { id: 'greatWeaponMaster', name: 'Great Weapon Master', source: { ...source, page: 204 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }, { kind: 'abilityScoreAtLeast', ability: 'Strength', score: 13 }], passiveSummary: '+1 Strength (max 20). A Heavy-weapon hit deals +Proficiency-Bonus damage. After a Melee Critical Hit or reducing a creature to 0 HP with a Melee weapon, make one Bonus Action attack with it.' },
  heavilyArmored: { id: 'heavilyArmored', name: 'Heavily Armored', source: { ...source, page: 204 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Constitution or Strength (max 20; requires Medium Armor Training). Gain training with Heavy armor.' },
  heavyArmorMaster: { id: 'heavyArmorMaster', name: 'Heavy Armor Master', source: { ...source, page: 204 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Constitution or Strength (max 20; requires Heavy Armor Training). While wearing Heavy armor, reduce Bludgeoning/Piercing/Slashing damage taken by your Proficiency Bonus.' },
  inspiringLeader: { id: 'inspiringLeader', name: 'Inspiring Leader', source: { ...source, page: 204 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Wisdom or Charisma (max 20; requires Wis or Cha 13+). On finishing a Short or Long Rest, give up to 6 allies within 30 feet Temporary Hit Points equal to your level + the increased ability\'s modifier.' },
  keenMind: { id: 'keenMind', name: 'Keen Mind', source: { ...source, page: 204 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }, { kind: 'abilityScoreAtLeast', ability: 'Intelligence', score: 13 }], passiveSummary: '+1 Intelligence (max 20). Choose Arcana, History, Investigation, Nature, or Religion: gain proficiency, or Expertise if already proficient. Study becomes a Bonus Action.' },
  lightlyArmored: { id: 'lightlyArmored', name: 'Lightly Armored', source: { ...source, page: 204 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20). Gain training with Light armor and Shields.' },
  mageSlayer: { id: 'mageSlayer', name: 'Mage Slayer', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20). Damaging a concentrating creature gives it Disadvantage on the Concentration save. Once per Short/Long Rest, turn a failed Int/Wis/Cha save into a success.' },
  martialWeaponTraining: { id: 'martialWeaponTraining', name: 'Martial Weapon Training', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20). Gain proficiency with Martial weapons.' },
  mediumArmorMaster: { id: 'mediumArmorMaster', name: 'Medium Armor Master', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20; requires Medium Armor Training). While wearing Medium armor, add up to +3 (not +2) from Dexterity 16+.' },
  moderatelyArmored: { id: 'moderatelyArmored', name: 'Moderately Armored', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20; requires Light Armor Training). Gain training with Medium armor.' },
  mountedCombatant: { id: 'mountedCombatant', name: 'Mounted Combatant', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength, Dexterity, or Wisdom (max 20). While mounted, Advantage on attacks against smaller unmounted creatures within 5 feet of your mount. Your mount takes no/half damage on a successful/failed Dex save. Redirect a hit against your mount to yourself.' },
  observant: { id: 'observant', name: 'Observant', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Intelligence or Wisdom (max 20; requires Int or Wis 13+). Choose Insight, Investigation, or Perception: gain proficiency, or Expertise if already proficient. Search becomes a Bonus Action.' },
  piercer: { id: 'piercer', name: 'Piercer', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20). Once per turn on a Piercing hit, reroll one damage die. A Piercing Critical Hit rolls one extra damage die.' },
  poisoner: { id: 'poisoner', name: 'Poisoner', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Dexterity or Intelligence (max 20). Your Poison damage ignores Resistance. Gain Poisoner\'s Kit proficiency; craft Proficiency-Bonus poison doses (1 hour, 50 GP) and apply one as a Bonus Action (DC 8 + ability mod + Prof Con save or 2d8 Poison + Poisoned).' },
  polearmMaster: { id: 'polearmMaster', name: 'Polearm Master', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Dexterity or Strength (max 20; requires Str or Dex 13+). After attacking with a Quarterstaff/Spear/Heavy-Reach weapon, Bonus Action 1d4 Bludgeoning butt-end attack. Reaction melee attack against a creature entering your reach with such a weapon.' },
  resilient: { id: 'resilient', name: 'Resilient', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: 'Choose an ability you lack saving throw proficiency in: +1 to it (max 20) and gain saving throw proficiency with it.' },
  ritualCaster: { id: 'ritualCaster', name: 'Ritual Caster', source: { ...source, page: 205 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Int/Wis/Cha (max 20; requires Int, Wis, or Cha 13+). Always have a number of Ritual-tagged level 1 spells equal to your Proficiency Bonus prepared (grows as Proficiency Bonus grows); cast them with spell slots normally, or once per Long Rest at normal casting time without a slot.' },
  sentinel: { id: 'sentinel', name: 'Sentinel', source: { ...source, page: 206 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20; requires Str or Dex 13+). Opportunity Attack when a creature within 5 feet Disengages or hits someone other than you. A creature hit by your Opportunity Attack has its Speed reduced to 0 for the rest of the turn.' },
  shadowTouched: { id: 'shadowTouched', name: 'Shadow-Touched', source: { ...source, page: 206 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Int/Wis/Cha (max 20). Choose a level 1 Illusion or Necromancy spell; you always have it and Invisibility prepared, each castable once free per Long Rest (or via a spell slot).' },
  sharpshooter: { id: 'sharpshooter', name: 'Sharpshooter', source: { ...source, page: 206 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }, { kind: 'abilityScoreAtLeast', ability: 'Dexterity', score: 13 }], passiveSummary: '+1 Dexterity (max 20). Ranged weapon attacks ignore Half/Three-Quarters Cover, don\'t suffer Disadvantage in melee range, and don\'t suffer Disadvantage at long range.' },
  shieldMaster: { id: 'shieldMaster', name: 'Shield Master', source: { ...source, page: 206 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength (max 20; requires Shield Training). Once per turn on a Melee hit, Shield Bash to push 5 feet or Prone (DC 8 + Str mod + Prof Strength save). Reaction: no damage on a successful Dex save while holding a Shield.' },
  skillExpert: { id: 'skillExpert', name: 'Skill Expert', source: { ...source, page: 206 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 to any ability (max 20). Gain proficiency in one skill. Gain Expertise in one skill you\'re already proficient in.' },
  skulker: { id: 'skulker', name: 'Skulker', source: { ...source, page: 207 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }, { kind: 'abilityScoreAtLeast', ability: 'Dexterity', score: 13 }], passiveSummary: '+1 Dexterity (max 20). Blindsight 10 feet. Advantage on Stealth checks made as part of the Hide action in combat. A missed attack roll while hidden doesn\'t reveal your location.' },
  slasher: { id: 'slasher', name: 'Slasher', source: { ...source, page: 207 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20). Once per turn on a Slashing hit, reduce the target\'s Speed by 10 feet until your next turn. A Slashing Critical Hit gives the target Disadvantage on attack rolls until your next turn.' },
  speedy: { id: 'speedy', name: 'Speedy', source: { ...source, page: 207 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Dexterity or Constitution (max 20; requires Dex or Con 13+). Speed +10 feet. Dash ignores Difficult Terrain for the turn. Opportunity Attacks against you have Disadvantage.' },
  spellSniper: { id: 'spellSniper', name: 'Spell Sniper', source: { ...source, page: 208 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Int/Wis/Cha (max 20; requires a Spellcasting or Pact Magic feature). Spell attacks ignore Half/Three-Quarters Cover and don\'t suffer melee-range Disadvantage. A ranged spell-attack spell\'s range increases by 60 feet.' },
  telekinetic: { id: 'telekinetic', name: 'Telekinetic', source: { ...source, page: 208 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Int/Wis/Cha (max 20). Learn Mage Hand (no Verbal/Somatic components, Invisible hand, +30 feet range). Bonus Action: telekinetically shove a creature within 30 feet 5 feet toward/away (DC 8 + ability mod + Prof Strength save).' },
  telepathic: { id: 'telepathic', name: 'Telepathic', source: { ...source, page: 208 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Int/Wis/Cha (max 20). Speak telepathically (one-way) to a creature you see within 60 feet that knows a language you know. Always have Detect Thoughts prepared, castable once free per Long Rest (or via a spell slot).' },
  warCaster: { id: 'warCaster', name: 'War Caster', source: { ...source, page: 208 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Int/Wis/Cha (max 20; requires a Spellcasting or Pact Magic feature). Advantage on Concentration saves. Reaction: cast a 1-action spell at a creature instead of an Opportunity Attack when it leaves your reach. Perform Somatic components with weapons/a Shield in hand.' },
  weaponMaster: { id: 'weaponMaster', name: 'Weapon Master', source: { ...source, page: 208 }, category: 'general', prerequisites: [{ kind: 'minimumLevel', level: 4 }], passiveSummary: '+1 Strength or Dexterity (max 20). Use the mastery property of one Simple or Martial weapon kind you\'re proficient with; change the chosen kind on a Long Rest.' },

  // Fighting Style feats — PHB 2024 p.209, all share the prerequisite "Fighting Style Feature"
  archery: { id: 'archery', name: 'Archery', source: { ...source, page: 209 }, category: 'fightingStyle', passiveSummary: '+2 bonus to attack rolls with Ranged weapons.' },
  blindFighting: { id: 'blindFighting', name: 'Blind Fighting', source: { ...source, page: 209 }, category: 'fightingStyle', passiveSummary: 'You have Blindsight with a range of 10 feet.' },
  defense: { id: 'defense', name: 'Defense', source: { ...source, page: 209 }, category: 'fightingStyle', passiveSummary: '+1 bonus to Armor Class while wearing Light, Medium, or Heavy armor.' },
  dueling: { id: 'dueling', name: 'Dueling', source: { ...source, page: 209 }, category: 'fightingStyle', passiveSummary: '+2 bonus to damage rolls while wielding a Melee weapon in one hand and no other weapons.' },
  greatWeaponFighting: { id: 'greatWeaponFighting', name: 'Great Weapon Fighting', source: { ...source, page: 209 }, category: 'fightingStyle', passiveSummary: 'Treat a 1 or 2 on a damage die as a 3 when attacking two-handed with a Two-Handed or Versatile Melee weapon.' },
  interception: { id: 'interception', name: 'Interception', source: { ...source, page: 209 }, category: 'fightingStyle', passiveSummary: 'Reaction: reduce damage to an ally within 5 feet by 1d10 + Proficiency Bonus. Requires holding a Shield or a Simple/Martial weapon.' },
  protection: { id: 'protection', name: 'Protection', source: { ...source, page: 209 }, category: 'fightingStyle', passiveSummary: 'Reaction: impose Disadvantage on an attack targeting an ally within 5 feet. Requires holding a Shield.' },
  thrownWeaponFighting: { id: 'thrownWeaponFighting', name: 'Thrown Weapon Fighting', source: { ...source, page: 210 }, category: 'fightingStyle', passiveSummary: '+2 bonus to damage rolls on ranged attacks with Thrown weapons.' },
  twoWeaponFighting: { id: 'twoWeaponFighting', name: 'Two-Weapon Fighting', source: { ...source, page: 210 }, category: 'fightingStyle', passiveSummary: 'Add your ability modifier to the damage of the extra attack granted by a Light weapon.' },
  unarmedFighting: { id: 'unarmedFighting', name: 'Unarmed Fighting', source: { ...source, page: 210 }, category: 'fightingStyle', passiveSummary: 'Unarmed Strike deals 1d6 + Strength modifier (1d8 if empty-handed); can also deal 1d4 to a creature you\'ve Grappled at the start of your turns.' },
}

export const FIGHTING_STYLE_FEAT_IDS = [
  'archery',
  'blindFighting',
  'defense',
  'dueling',
  'greatWeaponFighting',
  'interception',
  'protection',
  'thrownWeaponFighting',
  'twoWeaponFighting',
  'unarmedFighting',
]

/** Every option offered by a class's ASI-or-Feat choice slot — Ability
 * Score Improvement plus all 42 General feats. A class's own -asi-choice
 * uses this directly, so a class needs zero further changes once this list
 * grows (e.g. a future Epic Boon addition). */
export const GENERAL_FEAT_IDS = [
  'abilityScoreImprovement',
  'actor', 'athlete', 'charger', 'chef', 'crossbowExpert', 'crusher', 'defensiveDuelist', 'dualWielder', 'durable',
  'elementalAdept', 'feyTouched', 'grappler', 'greatWeaponMaster', 'heavilyArmored', 'heavyArmorMaster',
  'inspiringLeader', 'keenMind', 'lightlyArmored', 'mageSlayer', 'martialWeaponTraining', 'mediumArmorMaster',
  'moderatelyArmored', 'mountedCombatant', 'observant', 'piercer', 'poisoner', 'polearmMaster', 'resilient',
  'ritualCaster', 'sentinel', 'shadowTouched', 'sharpshooter', 'shieldMaster', 'skillExpert', 'skulker', 'slasher',
  'speedy', 'spellSniper', 'telekinetic', 'telepathic', 'warCaster', 'weaponMaster',
]
