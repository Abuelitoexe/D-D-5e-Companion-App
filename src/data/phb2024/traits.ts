import type { ChoiceDefinition, ChoiceOptionDefinition, FeatureDefinition } from '../../domain/types'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

const SKILLS = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
  'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
  'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival',
]

const ORIGIN_FEAT_IDS = [
  'alert', 'crafter', 'healer', 'lucky', 'magicInitiateCleric', 'magicInitiateDruid', 'magicInitiateWizard',
  'musician', 'savageAttacker', 'skilled', 'tavernBrawler', 'tough',
]

export const traitChoices: Record<string, ChoiceDefinition> = {
  'human-skillful-choice': {
    id: 'human-skillful-choice',
    label: 'Skillful: choose a skill proficiency',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: SKILLS.map((s) => `skill-${s.toLowerCase().replace(/\s+/g, '-')}`),
    source: src(194),
  },
  'human-versatile-choice': {
    id: 'human-versatile-choice',
    label: 'Versatile: choose an Origin feat',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    // Options are feat ids, resolved via registry.feats directly (same
    // pattern Fighting Style uses) — every Origin feat is now available.
    optionIds: ORIGIN_FEAT_IDS,
    source: src(194),
  },
  'dragonborn-draconic-ancestry-choice': {
    id: 'dragonborn-draconic-ancestry-choice',
    label: 'Draconic Ancestry: choose the dragon your Breath Weapon and Damage Resistance derive from',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: ['draconicAncestry-black', 'draconicAncestry-blue', 'draconicAncestry-brass', 'draconicAncestry-bronze', 'draconicAncestry-copper', 'draconicAncestry-gold', 'draconicAncestry-green', 'draconicAncestry-red', 'draconicAncestry-silver', 'draconicAncestry-white'],
    source: src(187),
  },
  'elf-elven-lineage-choice': {
    id: 'elf-elven-lineage-choice',
    label: 'Elven Lineage: choose Drow, High Elf, or Wood Elf',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: ['elvenLineage-drow', 'elvenLineage-highElf', 'elvenLineage-woodElf'],
    source: src(189),
  },
  'elf-keen-senses-choice': {
    id: 'elf-keen-senses-choice',
    label: 'Keen Senses: choose Insight, Perception, or Survival',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: ['skill-insight', 'skill-perception', 'skill-survival'],
    source: src(189),
  },
  'gnome-gnomish-lineage-choice': {
    id: 'gnome-gnomish-lineage-choice',
    label: 'Gnomish Lineage: choose Forest Gnome or Rock Gnome',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: ['gnomishLineage-forest', 'gnomishLineage-rock'],
    source: src(191),
  },
  'goliath-giant-ancestry-choice': {
    id: 'goliath-giant-ancestry-choice',
    label: 'Giant Ancestry: choose your ancestral boon',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: ['giantAncestry-cloud', 'giantAncestry-fire', 'giantAncestry-frost', 'giantAncestry-hill', 'giantAncestry-stone', 'giantAncestry-storm'],
    source: src(192),
  },
  'tiefling-fiendish-legacy-choice': {
    id: 'tiefling-fiendish-legacy-choice',
    label: 'Fiendish Legacy: choose Abyssal, Chthonic, or Infernal',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation'],
    optionIds: ['fiendishLegacy-abyssal', 'fiendishLegacy-chthonic', 'fiendishLegacy-infernal'],
    source: src(196),
  },
}

export const traitChoiceOptions: Record<string, ChoiceOptionDefinition> = {
  ...Object.fromEntries(
    SKILLS.map((s) => [`skill-${s.toLowerCase().replace(/\s+/g, '-')}`, { id: `skill-${s.toLowerCase().replace(/\s+/g, '-')}`, label: s, source: src(194) }]),
  ),
  'draconicAncestry-black': { id: 'draconicAncestry-black', label: 'Black — Acid damage', source: src(187) },
  'draconicAncestry-blue': { id: 'draconicAncestry-blue', label: 'Blue — Lightning damage', source: src(187) },
  'draconicAncestry-brass': { id: 'draconicAncestry-brass', label: 'Brass — Fire damage', source: src(187) },
  'draconicAncestry-bronze': { id: 'draconicAncestry-bronze', label: 'Bronze — Lightning damage', source: src(187) },
  'draconicAncestry-copper': { id: 'draconicAncestry-copper', label: 'Copper — Acid damage', source: src(187) },
  'draconicAncestry-gold': { id: 'draconicAncestry-gold', label: 'Gold — Fire damage', source: src(187) },
  'draconicAncestry-green': { id: 'draconicAncestry-green', label: 'Green — Poison damage', source: src(187) },
  'draconicAncestry-red': { id: 'draconicAncestry-red', label: 'Red — Fire damage', source: src(187) },
  'draconicAncestry-silver': { id: 'draconicAncestry-silver', label: 'Silver — Cold damage', source: src(187) },
  'draconicAncestry-white': { id: 'draconicAncestry-white', label: 'White — Cold damage', source: src(187) },
  'elvenLineage-drow': {
    id: 'elvenLineage-drow',
    label: 'Drow — Darkvision range increases to 120 feet; know Dancing Lights. At level 3: Faerie Fire. At level 5: Darkness (always prepared, cast once free per Long Rest).',
    source: src(189),
  },
  'elvenLineage-highElf': {
    id: 'elvenLineage-highElf',
    label: 'High Elf — Know Prestidigitation (swappable on a Long Rest). At level 3: Detect Magic. At level 5: Misty Step (always prepared, cast once free per Long Rest).',
    source: src(189),
  },
  'elvenLineage-woodElf': {
    id: 'elvenLineage-woodElf',
    label: 'Wood Elf — Speed increases to 35 feet; know Druidcraft. At level 3: Longstrider. At level 5: Pass without Trace (always prepared, cast once free per Long Rest).',
    source: src(189),
  },
  'gnomishLineage-forest': {
    id: 'gnomishLineage-forest',
    label: 'Forest Gnome — Know Minor Illusion; always have Speak with Animals prepared, castable free a number of times equal to your Proficiency Bonus per Long Rest.',
    source: src(191),
  },
  'gnomishLineage-rock': {
    id: 'gnomishLineage-rock',
    label: 'Rock Gnome — Know Mending and Prestidigitation; can spend 10 minutes casting Prestidigitation to create a Tiny clockwork device (up to 3 at a time, each lasts 8 hours).',
    source: src(191),
  },
  'giantAncestry-cloud': { id: 'giantAncestry-cloud', label: 'Cloud\'s Jaunt (Cloud Giant) — Bonus Action: teleport up to 30 feet to an unoccupied space you can see.', source: src(192) },
  'giantAncestry-fire': { id: 'giantAncestry-fire', label: 'Fire\'s Burn (Fire Giant) — On a hit that deals damage, also deal 1d10 Fire damage.', source: src(192) },
  'giantAncestry-frost': { id: 'giantAncestry-frost', label: 'Frost\'s Chill (Frost Giant) — On a hit that deals damage, also deal 1d6 Cold damage and reduce the target\'s Speed by 10 feet until the start of your next turn.', source: src(192) },
  'giantAncestry-hill': { id: 'giantAncestry-hill', label: 'Hill\'s Tumble (Hill Giant) — On a hit against a Large or smaller creature that deals damage, give it the Prone condition.', source: src(192) },
  'giantAncestry-stone': { id: 'giantAncestry-stone', label: 'Stone\'s Endurance (Stone Giant) — Reaction when you take damage: roll 1d12 + Constitution modifier and reduce the damage by that total.', source: src(192) },
  'giantAncestry-storm': { id: 'giantAncestry-storm', label: 'Storm\'s Thunder (Storm Giant) — Reaction when you take damage from a creature within 60 feet: deal 1d8 Thunder damage to that creature.', source: src(192) },
  'fiendishLegacy-abyssal': {
    id: 'fiendishLegacy-abyssal',
    label: 'Abyssal — Resistance to Poison damage; know Poison Spray. At level 3: Ray of Sickness. At level 5: Hold Person (always prepared, cast once free per Long Rest).',
    source: src(196),
  },
  'fiendishLegacy-chthonic': {
    id: 'fiendishLegacy-chthonic',
    label: 'Chthonic — Resistance to Necrotic damage; know Chill Touch. At level 3: False Life. At level 5: Ray of Enfeeblement (always prepared, cast once free per Long Rest).',
    source: src(196),
  },
  'fiendishLegacy-infernal': {
    id: 'fiendishLegacy-infernal',
    label: 'Infernal — Resistance to Fire damage; know Fire Bolt. At level 3: Hellish Rebuke. At level 5: Darkness (always prepared, cast once free per Long Rest).',
    source: src(196),
  },
}

export const speciesTraits: Record<string, FeatureDefinition> = {
  humanResourceful: {
    id: 'humanResourceful',
    name: 'Resourceful',
    source: src(194),
    activation: 'passive',
    summary: 'You gain Heroic Inspiration whenever you finish a Long Rest.',
  },
  humanSkillful: {
    id: 'humanSkillful',
    name: 'Skillful',
    source: src(194),
    activation: 'passive',
    summary: 'You gain proficiency in one skill of your choice.',
    choices: ['human-skillful-choice'],
  },
  humanVersatile: {
    id: 'humanVersatile',
    name: 'Versatile',
    source: src(194),
    activation: 'passive',
    summary: 'You gain an Origin feat of your choice. Skilled is recommended.',
    choices: ['human-versatile-choice'],
  },

  // Aasimar — PHB 2024 p.186
  aasimarCelestialResistance: { id: 'aasimarCelestialResistance', name: 'Celestial Resistance', source: src(186), activation: 'passive', summary: 'You have Resistance to Necrotic damage and Radiant damage.' },
  aasimarDarkvision: { id: 'aasimarDarkvision', name: 'Darkvision', source: src(186), activation: 'passive', summary: 'You have Darkvision with a range of 60 feet.' },
  aasimarHealingHands: { id: 'aasimarHealingHands', name: 'Healing Hands', source: src(186), activation: 'action', summary: 'Magic action: touch a creature and roll a number of d4s equal to your Proficiency Bonus; it regains that many Hit Points. Once per Long Rest.' },
  aasimarLightBearer: { id: 'aasimarLightBearer', name: 'Light Bearer', source: src(186), activation: 'passive', summary: 'You know the Light cantrip. Charisma is your spellcasting ability for it.' },
  aasimarCelestialRevelation: {
    id: 'aasimarCelestialRevelation',
    name: 'Celestial Revelation',
    source: src(186),
    activation: 'bonusAction',
    minimumLevel: 3,
    summary: 'Bonus Action: transform for 1 minute (once per Long Rest), choosing Heavenly Wings (Fly Speed = Speed), Inner Radiance (shed light and deal Radiant damage each turn to nearby creatures), or Necrotic Shroud (nearby non-allies must save or be Frightened). While transformed, deal extra Proficiency-Bonus damage once per turn on a hit.',
  },

  // Dragonborn — PHB 2024 p.187
  dragonbornDraconicAncestry: { id: 'dragonbornDraconicAncestry', name: 'Draconic Ancestry', source: src(187), activation: 'passive', summary: 'Choose the dragon your lineage stems from; it determines your Breath Weapon and Damage Resistance damage type.', choices: ['dragonborn-draconic-ancestry-choice'] },
  dragonbornBreathWeapon: { id: 'dragonbornBreathWeapon', name: 'Breath Weapon', source: src(187), activation: 'action', summary: 'Replace one Attack-action attack with a 15-foot Cone or 30-foot Line (5 feet wide) of your Draconic Ancestry\'s damage type; each creature in it makes a DC 8 + Con modifier + Proficiency Bonus Dexterity save, taking 1d10 (half on success), scaling to 2d10 at level 5, 3d10 at level 11, 4d10 at level 17. Uses equal to Proficiency Bonus per Long Rest.' },
  dragonbornDamageResistance: { id: 'dragonbornDamageResistance', name: 'Damage Resistance', source: src(187), activation: 'passive', summary: 'You have Resistance to the damage type determined by your Draconic Ancestry trait.' },
  dragonbornDarkvision: { id: 'dragonbornDarkvision', name: 'Darkvision', source: src(187), activation: 'passive', summary: 'You have Darkvision with a range of 60 feet.' },
  dragonbornDraconicFlight: { id: 'dragonbornDraconicFlight', name: 'Draconic Flight', source: src(187), activation: 'bonusAction', minimumLevel: 5, summary: 'Bonus Action: sprout spectral wings for 10 minutes, gaining a Fly Speed equal to your Speed. Once per Long Rest.' },

  // Dwarf — PHB 2024 p.188
  dwarfDarkvision: { id: 'dwarfDarkvision', name: 'Darkvision', source: src(188), activation: 'passive', summary: 'You have Darkvision with a range of 120 feet.' },
  dwarfResilience: { id: 'dwarfResilience', name: 'Dwarven Resilience', source: src(188), activation: 'passive', summary: 'You have Resistance to Poison damage and Advantage on saving throws to avoid or end the Poisoned condition.' },
  dwarfToughness: { id: 'dwarfToughness', name: 'Dwarven Toughness', source: src(188), activation: 'passive', summary: 'Your Hit Point maximum increases by 1, and by 1 again whenever you gain a level.' },
  dwarfStonecunning: { id: 'dwarfStonecunning', name: 'Stonecunning', source: src(188), activation: 'bonusAction', summary: 'Bonus Action: gain Tremorsense with a range of 60 feet for 10 minutes while on or touching stone. Uses equal to Proficiency Bonus per Long Rest.' },

  // Elf — PHB 2024 p.189
  elfDarkvision: { id: 'elfDarkvision', name: 'Darkvision', source: src(189), activation: 'passive', summary: 'You have Darkvision with a range of 60 feet.' },
  elfElvenLineage: { id: 'elfElvenLineage', name: 'Elven Lineage', source: src(189), activation: 'passive', summary: 'Choose Drow, High Elf, or Wood Elf — each grants a level 1 benefit plus higher-level spells at levels 3 and 5.', choices: ['elf-elven-lineage-choice'] },
  elfFeyAncestry: { id: 'elfFeyAncestry', name: 'Fey Ancestry', source: src(189), activation: 'passive', summary: 'You have Advantage on saving throws you make to avoid or end the Charmed condition.' },
  elfKeenSenses: { id: 'elfKeenSenses', name: 'Keen Senses', source: src(189), activation: 'passive', summary: 'You have proficiency in the Insight, Perception, or Survival skill (your choice).', choices: ['elf-keen-senses-choice'] },
  elfTrance: { id: 'elfTrance', name: 'Trance', source: src(189), activation: 'passive', summary: 'You don\'t need to sleep and magic can\'t put you to sleep. You can finish a Long Rest in 4 hours of trancelike meditation.' },

  // Gnome — PHB 2024 p.191
  gnomeDarkvision: { id: 'gnomeDarkvision', name: 'Darkvision', source: src(191), activation: 'passive', summary: 'You have Darkvision with a range of 60 feet.' },
  gnomeGnomishCunning: { id: 'gnomeGnomishCunning', name: 'Gnomish Cunning', source: src(191), activation: 'passive', summary: 'You have Advantage on Intelligence, Wisdom, and Charisma saving throws.' },
  gnomeGnomishLineage: { id: 'gnomeGnomishLineage', name: 'Gnomish Lineage', source: src(191), activation: 'passive', summary: 'Choose Forest Gnome or Rock Gnome, each granting different cantrips/spells.', choices: ['gnome-gnomish-lineage-choice'] },

  // Goliath — PHB 2024 p.192
  goliathGiantAncestry: { id: 'goliathGiantAncestry', name: 'Giant Ancestry', source: src(192), activation: 'passive', summary: 'Choose a supernatural boon from your giant ancestry, usable a number of times equal to your Proficiency Bonus per Long Rest.', choices: ['goliath-giant-ancestry-choice'] },
  goliathLargeForm: { id: 'goliathLargeForm', name: 'Large Form', source: src(192), activation: 'bonusAction', minimumLevel: 5, summary: 'Bonus Action: become Large for 10 minutes (Advantage on Strength checks, +10 feet Speed) if space allows. Once per Long Rest.' },
  goliathPowerfulBuild: { id: 'goliathPowerfulBuild', name: 'Powerful Build', source: src(192), activation: 'passive', summary: 'You have Advantage on saving throws to end the Grappled condition, and you count as one size larger when determining carrying capacity.' },

  // Halfling — PHB 2024 p.193
  halflingBrave: { id: 'halflingBrave', name: 'Brave', source: src(193), activation: 'passive', summary: 'You have Advantage on saving throws you make to avoid or end the Frightened condition.' },
  halflingNimbleness: { id: 'halflingNimbleness', name: 'Halfling Nimbleness', source: src(193), activation: 'passive', summary: 'You can move through the space of any creature that is a size larger than you, but can\'t stop there.' },
  halflingLuck: { id: 'halflingLuck', name: 'Luck', source: src(193), activation: 'passive', summary: 'When you roll a 1 on the d20 of a D20 Test, you can reroll the die and must use the new roll.' },
  halflingNaturallyStealthy: { id: 'halflingNaturallyStealthy', name: 'Naturally Stealthy', source: src(193), activation: 'passive', summary: 'You can take the Hide action even when obscured only by a creature at least one size larger than you.' },

  // Orc — PHB 2024 p.195
  orcAdrenalineRush: { id: 'orcAdrenalineRush', name: 'Adrenaline Rush', source: src(195), activation: 'bonusAction', summary: 'Bonus Action: take the Dash action and gain Temporary Hit Points equal to your Proficiency Bonus. Uses equal to Proficiency Bonus, regained on a Short or Long Rest.' },
  orcDarkvision: { id: 'orcDarkvision', name: 'Darkvision', source: src(195), activation: 'passive', summary: 'You have Darkvision with a range of 120 feet.' },
  orcRelentlessEndurance: { id: 'orcRelentlessEndurance', name: 'Relentless Endurance', source: src(195), activation: 'passive', summary: 'When reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once per Long Rest.' },

  // Tiefling — PHB 2024 p.196
  tieflingDarkvision: { id: 'tieflingDarkvision', name: 'Darkvision', source: src(196), activation: 'passive', summary: 'You have Darkvision with a range of 60 feet.' },
  tieflingFiendishLegacy: { id: 'tieflingFiendishLegacy', name: 'Fiendish Legacy', source: src(196), activation: 'passive', summary: 'Choose Abyssal, Chthonic, or Infernal — each grants a level 1 benefit plus higher-level spells at levels 3 and 5.', choices: ['tiefling-fiendish-legacy-choice'] },
  tieflingOtherworldlyPresence: { id: 'tieflingOtherworldlyPresence', name: 'Otherworldly Presence', source: src(196), activation: 'passive', summary: 'You know the Thaumaturgy cantrip, cast with the same spellcasting ability as your Fiendish Legacy trait.' },
}
