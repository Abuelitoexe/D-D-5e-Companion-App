import type { BackgroundDefinition, EquipmentPackOption, SpeciesDefinition } from '../../domain/types'

const bgSrc = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

/** All 16 PHB 2024 backgrounds — PHB p.178-185, extracted via pdftotext -raw
 * and cross-checked against the TOC's own page numbers. */
export const backgrounds: Record<string, BackgroundDefinition> = {
  acolyte: {
    id: 'acolyte', name: 'Acolyte', source: bgSrc(178),
    abilityScoreOptions: ['Intelligence', 'Wisdom', 'Charisma'],
    originFeatId: 'magicInitiateCleric',
    skillProficiencies: ['Insight', 'Religion'],
    toolProficiency: "Calligrapher's Supplies",
    equipmentChoiceIds: ['acolytePackA', 'acolytePackB'],
  },
  artisan: {
    id: 'artisan', name: 'Artisan', source: bgSrc(178),
    abilityScoreOptions: ['Strength', 'Dexterity', 'Intelligence'],
    originFeatId: 'crafter',
    skillProficiencies: ['Investigation', 'Persuasion'],
    toolProficiency: "Artisan's Tools (choice)",
    equipmentChoiceIds: ['artisanPackA', 'artisanPackB'],
  },
  charlatan: {
    id: 'charlatan', name: 'Charlatan', source: bgSrc(179),
    abilityScoreOptions: ['Dexterity', 'Constitution', 'Charisma'],
    originFeatId: 'skilled',
    skillProficiencies: ['Deception', 'Sleight of Hand'],
    toolProficiency: 'Forgery Kit',
    equipmentChoiceIds: ['charlatanPackA', 'charlatanPackB'],
  },
  criminal: {
    id: 'criminal', name: 'Criminal', source: bgSrc(179),
    abilityScoreOptions: ['Dexterity', 'Constitution', 'Intelligence'],
    originFeatId: 'alert',
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiency: "Thieves' Tools",
    equipmentChoiceIds: ['criminalPackA', 'criminalPackB'],
  },
  entertainer: {
    id: 'entertainer', name: 'Entertainer', source: bgSrc(180),
    abilityScoreOptions: ['Strength', 'Dexterity', 'Charisma'],
    originFeatId: 'musician',
    skillProficiencies: ['Acrobatics', 'Performance'],
    toolProficiency: 'Musical Instrument (choice)',
    equipmentChoiceIds: ['entertainerPackA', 'entertainerPackB'],
  },
  farmer: {
    id: 'farmer', name: 'Farmer', source: bgSrc(180),
    abilityScoreOptions: ['Strength', 'Constitution', 'Wisdom'],
    originFeatId: 'tough',
    skillProficiencies: ['Animal Handling', 'Nature'],
    toolProficiency: "Carpenter's Tools",
    equipmentChoiceIds: ['farmerPackA', 'farmerPackB'],
  },
  guard: {
    id: 'guard', name: 'Guard', source: bgSrc(181),
    abilityScoreOptions: ['Strength', 'Intelligence', 'Wisdom'],
    originFeatId: 'alert',
    skillProficiencies: ['Athletics', 'Perception'],
    toolProficiency: 'Gaming Set (choice)',
    equipmentChoiceIds: ['guardPackA', 'guardPackB'],
  },
  guide: {
    id: 'guide', name: 'Guide', source: bgSrc(181),
    abilityScoreOptions: ['Dexterity', 'Constitution', 'Wisdom'],
    originFeatId: 'magicInitiateDruid',
    skillProficiencies: ['Stealth', 'Survival'],
    toolProficiency: "Cartographer's Tools",
    equipmentChoiceIds: ['guidePackA', 'guidePackB'],
  },
  hermit: {
    id: 'hermit', name: 'Hermit', source: bgSrc(182),
    abilityScoreOptions: ['Constitution', 'Wisdom', 'Charisma'],
    originFeatId: 'healer',
    skillProficiencies: ['Medicine', 'Religion'],
    toolProficiency: 'Herbalism Kit',
    equipmentChoiceIds: ['hermitPackA', 'hermitPackB'],
  },
  merchant: {
    id: 'merchant', name: 'Merchant', source: bgSrc(182),
    abilityScoreOptions: ['Constitution', 'Intelligence', 'Charisma'],
    originFeatId: 'lucky',
    skillProficiencies: ['Animal Handling', 'Persuasion'],
    toolProficiency: "Navigator's Tools",
    equipmentChoiceIds: ['merchantPackA', 'merchantPackB'],
  },
  noble: {
    id: 'noble', name: 'Noble', source: bgSrc(183),
    abilityScoreOptions: ['Strength', 'Intelligence', 'Charisma'],
    originFeatId: 'skilled',
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiency: 'Gaming Set (choice)',
    equipmentChoiceIds: ['noblePackA', 'noblePackB'],
  },
  sage: {
    id: 'sage', name: 'Sage', source: bgSrc(183),
    abilityScoreOptions: ['Constitution', 'Intelligence', 'Wisdom'],
    originFeatId: 'magicInitiateWizard',
    skillProficiencies: ['Arcana', 'History'],
    toolProficiency: "Calligrapher's Supplies",
    equipmentChoiceIds: ['sagePackA', 'sagePackB'],
  },
  sailor: {
    id: 'sailor', name: 'Sailor', source: bgSrc(184),
    abilityScoreOptions: ['Strength', 'Dexterity', 'Wisdom'],
    originFeatId: 'tavernBrawler',
    skillProficiencies: ['Acrobatics', 'Perception'],
    toolProficiency: "Navigator's Tools",
    equipmentChoiceIds: ['sailorPackA', 'sailorPackB'],
  },
  scribe: {
    id: 'scribe', name: 'Scribe', source: bgSrc(184),
    abilityScoreOptions: ['Dexterity', 'Intelligence', 'Wisdom'],
    originFeatId: 'skilled',
    skillProficiencies: ['Investigation', 'Perception'],
    toolProficiency: "Calligrapher's Supplies",
    equipmentChoiceIds: ['scribePackA', 'scribePackB'],
  },
  soldier: {
    id: 'soldier',
    name: 'Soldier',
    source: { sourceId: 'PHB2024', sourceLabel: 'PHB 2024', page: 185 },
    abilityScoreOptions: ['Strength', 'Dexterity', 'Constitution'],
    originFeatId: 'savageAttacker',
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiency: 'Gaming Set (choice)',
    equipmentChoiceIds: ['soldierPackA', 'soldierPackB'],
  },
  wayfarer: {
    id: 'wayfarer', name: 'Wayfarer', source: bgSrc(185),
    abilityScoreOptions: ['Dexterity', 'Wisdom', 'Charisma'],
    originFeatId: 'lucky',
    skillProficiencies: ['Insight', 'Stealth'],
    toolProficiency: "Thieves' Tools",
    equipmentChoiceIds: ['wayfarerPackA', 'wayfarerPackB'],
  },
}

/** All 10 PHB 2024 species — PHB p.186-197, extracted via pdftotext -raw;
 * Tiefling's Fiendish Legacies table Level 5 cell for Infernal was missing
 * from every text-extraction pass (raw/table/layout/PyMuPDF all agreed) and
 * was recovered by rendering the page to an image and reading it directly:
 * Darkness. */
export const species: Record<string, SpeciesDefinition> = {
  aasimar: {
    id: 'aasimar', name: 'Aasimar', source: bgSrc(186),
    creatureType: 'Humanoid', sizeOptions: ['Medium', 'Small'], speed: 30,
    traitIds: ['aasimarCelestialResistance', 'aasimarDarkvision', 'aasimarHealingHands', 'aasimarLightBearer', 'aasimarCelestialRevelation'],
  },
  dragonborn: {
    id: 'dragonborn', name: 'Dragonborn', source: bgSrc(187),
    creatureType: 'Humanoid', sizeOptions: ['Medium'], speed: 30,
    traitIds: ['dragonbornDraconicAncestry', 'dragonbornBreathWeapon', 'dragonbornDamageResistance', 'dragonbornDarkvision', 'dragonbornDraconicFlight'],
  },
  dwarf: {
    id: 'dwarf', name: 'Dwarf', source: bgSrc(188),
    creatureType: 'Humanoid', sizeOptions: ['Medium'], speed: 30,
    traitIds: ['dwarfDarkvision', 'dwarfResilience', 'dwarfToughness', 'dwarfStonecunning'],
  },
  elf: {
    id: 'elf', name: 'Elf', source: bgSrc(189),
    creatureType: 'Humanoid', sizeOptions: ['Medium'], speed: 30,
    traitIds: ['elfDarkvision', 'elfElvenLineage', 'elfFeyAncestry', 'elfKeenSenses', 'elfTrance'],
  },
  gnome: {
    id: 'gnome', name: 'Gnome', source: bgSrc(191),
    creatureType: 'Humanoid', sizeOptions: ['Small'], speed: 30,
    traitIds: ['gnomeDarkvision', 'gnomeGnomishCunning', 'gnomeGnomishLineage'],
  },
  goliath: {
    id: 'goliath', name: 'Goliath', source: bgSrc(192),
    creatureType: 'Humanoid', sizeOptions: ['Medium'], speed: 35,
    traitIds: ['goliathGiantAncestry', 'goliathLargeForm', 'goliathPowerfulBuild'],
  },
  halfling: {
    id: 'halfling', name: 'Halfling', source: bgSrc(193),
    creatureType: 'Humanoid', sizeOptions: ['Small'], speed: 30,
    traitIds: ['halflingBrave', 'halflingNimbleness', 'halflingLuck', 'halflingNaturallyStealthy'],
  },
  human: {
    id: 'human',
    name: 'Human',
    source: { sourceId: 'PHB2024', sourceLabel: 'PHB 2024', page: 194 },
    creatureType: 'Humanoid',
    sizeOptions: ['Medium', 'Small'],
    speed: 30,
    traitIds: ['humanResourceful', 'humanSkillful', 'humanVersatile'],
  },
  orc: {
    id: 'orc', name: 'Orc', source: bgSrc(195),
    creatureType: 'Humanoid', sizeOptions: ['Medium'], speed: 30,
    traitIds: ['orcAdrenalineRush', 'orcDarkvision', 'orcRelentlessEndurance'],
  },
  tiefling: {
    id: 'tiefling', name: 'Tiefling', source: bgSrc(196),
    creatureType: 'Humanoid', sizeOptions: ['Medium', 'Small'], speed: 30,
    traitIds: ['tieflingDarkvision', 'tieflingFiendishLegacy', 'tieflingOtherworldlyPresence'],
  },
}

export const equipmentPacks: Record<string, EquipmentPackOption> = {
  soldierPackA: {
    id: 'soldierPackA',
    label: 'Spear, Shortbow, 20 Arrows, Gaming Set, Healer\'s Kit, Quiver, Traveler\'s Clothes, 14 GP',
    weaponIds: ['spear', 'shortbow'],
    goldPieces: 14,
    otherItems: ['20 Arrows', 'Gaming Set', "Healer's Kit", 'Quiver', "Traveler's Clothes"],
  },
  soldierPackB: {
    id: 'soldierPackB',
    label: '50 GP',
    goldPieces: 50,
  },
  fighterPackA: {
    id: 'fighterPackA',
    label: 'Chain Mail, Greatsword, Flail, 8 Javelins, Dungeoneer\'s Pack, 4 GP',
    weaponIds: ['greatsword', 'flail', 'javelin'],
    armorIds: ['chainMail'],
    goldPieces: 4,
    otherItems: ["Dungeoneer's Pack"],
  },
  fighterPackB: {
    id: 'fighterPackB',
    label: 'Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Dungeoneer\'s Pack, 11 GP',
    weaponIds: ['scimitar', 'shortsword', 'longbow'],
    armorIds: ['studdedLeatherArmor'],
    goldPieces: 11,
    otherItems: ['20 Arrows', 'Quiver', "Dungeoneer's Pack"],
  },
  fighterPackC: {
    id: 'fighterPackC',
    label: '155 GP',
    goldPieces: 155,
  },
  wizardPackA: {
    id: 'wizardPackA',
    label: "2 Daggers, Arcane Focus (Quarterstaff), Robe, Spellbook, Scholar's Pack, 5 GP",
    weaponIds: ['dagger', 'quarterstaff'],
    goldPieces: 5,
    otherItems: ['2nd Dagger', 'Robe', 'Spellbook', "Scholar's Pack"],
  },
  wizardPackB: {
    id: 'wizardPackB',
    label: '55 GP',
    goldPieces: 55,
  },
  // PHB 2024 p.128 — verified via pdftotext -raw.
  roguePackA: {
    id: 'roguePackA',
    label: "Leather Armor, 2 Daggers, Shortsword, Shortbow, 20 Arrows, Quiver, Thieves' Tools, Burglar's Pack, 8 GP",
    weaponIds: ['dagger', 'shortsword', 'shortbow'],
    armorIds: ['leatherArmor'],
    goldPieces: 8,
    otherItems: ['2nd Dagger', '20 Arrows', 'Quiver', "Thieves' Tools", "Burglar's Pack"],
  },
  roguePackB: {
    id: 'roguePackB',
    label: '100 GP',
    goldPieces: 100,
  },
  // PHB 2024 p.152 — verified via pdftotext -raw.
  warlockPackA: {
    id: 'warlockPackA',
    label: "Leather Armor, Sickle, 2 Daggers, Arcane Focus (Orb), Book (Occult Lore), Scholar's Pack, 15 GP",
    weaponIds: ['sickle', 'dagger'],
    armorIds: ['leatherArmor'],
    goldPieces: 15,
    otherItems: ['2nd Dagger', 'Arcane Focus (Orb)', 'Book (Occult Lore)', "Scholar's Pack"],
  },
  warlockPackB: {
    id: 'warlockPackB',
    label: '100 GP',
    goldPieces: 100,
  },
  // PHB 2024 p.50 — verified via pdftotext -raw.
  barbarianPackA: {
    id: 'barbarianPackA',
    label: "Greataxe, 4 Handaxes, Explorer's Pack, 15 GP",
    weaponIds: ['greataxe', 'handaxe'],
    goldPieces: 15,
    otherItems: ['3 more Handaxes', "Explorer's Pack"],
  },
  barbarianPackB: {
    id: 'barbarianPackB',
    label: '75 GP',
    goldPieces: 75,
  },
  // PHB 2024 p.138 — verified via pdftotext -raw.
  sorcererPackA: {
    id: 'sorcererPackA',
    label: "Spear, 2 Daggers, Arcane Focus (Crystal), Dungeoneer's Pack, 28 GP",
    weaponIds: ['spear', 'dagger'],
    goldPieces: 28,
    otherItems: ['2nd Dagger', 'Arcane Focus (Crystal)', "Dungeoneer's Pack"],
  },
  sorcererPackB: {
    id: 'sorcererPackB',
    label: '50 GP',
    goldPieces: 50,
  },
  // PHB 2024 p.100 — verified via pdftotext -raw.
  monkPackA: {
    id: 'monkPackA',
    label: "Spear, 5 Daggers, Artisan's Tools or Musical Instrument, Explorer's Pack, 11 GP",
    weaponIds: ['spear', 'dagger'],
    goldPieces: 11,
    otherItems: ['4 more Daggers', "Artisan's Tools or Musical Instrument (choice)", "Explorer's Pack"],
  },
  monkPackB: {
    id: 'monkPackB',
    label: '50 GP',
    goldPieces: 50,
  },
  // PHB 2024 p.68 — verified via pdftotext -raw.
  clericPackA: {
    id: 'clericPackA',
    label: "Chain Shirt, Shield, Mace, Holy Symbol, Priest's Pack, 7 GP",
    weaponIds: ['mace'],
    armorIds: ['chainShirt', 'shield'],
    goldPieces: 7,
    otherItems: ['Holy Symbol', "Priest's Pack"],
  },
  clericPackB: {
    id: 'clericPackB',
    label: '110 GP',
    goldPieces: 110,
  },
  // PHB 2024 p.58 — verified via pdftotext -raw.
  bardPackA: {
    id: 'bardPackA',
    label: "Leather Armor, 2 Daggers, Musical Instrument, Entertainer's Pack, 19 GP",
    weaponIds: ['dagger'],
    armorIds: ['leatherArmor'],
    goldPieces: 19,
    otherItems: ['2nd Dagger', 'Musical Instrument (choice)', "Entertainer's Pack"],
  },
  bardPackB: {
    id: 'bardPackB',
    label: '90 GP',
    goldPieces: 90,
  },
  // PHB 2024 p.78 — verified via pdftotext -raw.
  druidPackA: {
    id: 'druidPackA',
    label: "Leather Armor, Shield, Sickle, Druidic Focus (Quarterstaff), Explorer's Pack, Herbalism Kit, 9 GP",
    weaponIds: ['sickle', 'quarterstaff'],
    armorIds: ['leatherArmor', 'shield'],
    goldPieces: 9,
    otherItems: ["Explorer's Pack", 'Herbalism Kit'],
  },
  druidPackB: {
    id: 'druidPackB',
    label: '50 GP',
    goldPieces: 50,
  },
  // PHB 2024 p.108 — verified via pdftotext -raw.
  paladinPackA: {
    id: 'paladinPackA',
    label: "Chain Mail, Shield, Longsword, 6 Javelins, Holy Symbol, Priest's Pack, 9 GP",
    weaponIds: ['longsword', 'javelin'],
    armorIds: ['chainMail', 'shield'],
    goldPieces: 9,
    otherItems: ['5 more Javelins', 'Holy Symbol', "Priest's Pack"],
  },
  paladinPackB: {
    id: 'paladinPackB',
    label: '150 GP',
    goldPieces: 150,
  },
  // PHB 2024 p.118 — verified via pdftotext -raw.
  rangerPackA: {
    id: 'rangerPackA',
    label: "Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Druidic Focus (Sprig of Mistletoe), Explorer's Pack, 7 GP",
    weaponIds: ['scimitar', 'shortsword', 'longbow'],
    armorIds: ['studdedLeatherArmor'],
    goldPieces: 7,
    otherItems: ['20 Arrows', 'Quiver', 'Druidic Focus (Sprig of Mistletoe)', "Explorer's Pack"],
  },
  rangerPackB: {
    id: 'rangerPackB',
    label: '150 GP',
    goldPieces: 150,
  },
  // Background equipment packs — PHB 2024 p.178-185, verified via pdftotext -raw.
  acolytePackA: { id: 'acolytePackA', label: "Calligrapher's Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe, 8 GP", goldPieces: 8, otherItems: ["Calligrapher's Supplies", 'Book (prayers)', 'Holy Symbol', 'Parchment (10 sheets)', 'Robe'] },
  acolytePackB: { id: 'acolytePackB', label: '50 GP', goldPieces: 50 },
  artisanPackA: { id: 'artisanPackA', label: "Artisan's Tools (choice), 2 Pouches, Traveler's Clothes, 32 GP", goldPieces: 32, otherItems: ["Artisan's Tools (choice)", '2 Pouches', "Traveler's Clothes"] },
  artisanPackB: { id: 'artisanPackB', label: '50 GP', goldPieces: 50 },
  charlatanPackA: { id: 'charlatanPackA', label: 'Forgery Kit, Costume, Fine Clothes, 15 GP', goldPieces: 15, otherItems: ['Forgery Kit', 'Costume', 'Fine Clothes'] },
  charlatanPackB: { id: 'charlatanPackB', label: '50 GP', goldPieces: 50 },
  criminalPackA: { id: 'criminalPackA', label: "2 Daggers, Thieves' Tools, Crowbar, 2 Pouches, Traveler's Clothes, 16 GP", weaponIds: ['dagger'], goldPieces: 16, otherItems: ['2nd Dagger', "Thieves' Tools", 'Crowbar', '2 Pouches', "Traveler's Clothes"] },
  criminalPackB: { id: 'criminalPackB', label: '50 GP', goldPieces: 50 },
  entertainerPackA: { id: 'entertainerPackA', label: "Musical Instrument (choice), 2 Costumes, Mirror, Perfume, Traveler's Clothes, 11 GP", goldPieces: 11, otherItems: ['Musical Instrument (choice)', '2 Costumes', 'Mirror', 'Perfume', "Traveler's Clothes"] },
  entertainerPackB: { id: 'entertainerPackB', label: '50 GP', goldPieces: 50 },
  farmerPackA: { id: 'farmerPackA', label: "Sickle, Carpenter's Tools, Healer's Kit, Iron Pot, Shovel, Traveler's Clothes, 30 GP", weaponIds: ['sickle'], goldPieces: 30, otherItems: ["Carpenter's Tools", "Healer's Kit", 'Iron Pot', 'Shovel', "Traveler's Clothes"] },
  farmerPackB: { id: 'farmerPackB', label: '50 GP', goldPieces: 50 },
  guardPackA: { id: 'guardPackA', label: "Spear, Light Crossbow, 20 Bolts, Gaming Set (choice), Hooded Lantern, Manacles, Quiver, Traveler's Clothes, 12 GP", weaponIds: ['spear', 'lightCrossbow'], goldPieces: 12, otherItems: ['20 Bolts', 'Gaming Set (choice)', 'Hooded Lantern', 'Manacles', 'Quiver', "Traveler's Clothes"] },
  guardPackB: { id: 'guardPackB', label: '50 GP', goldPieces: 50 },
  guidePackA: { id: 'guidePackA', label: "Shortbow, 20 Arrows, Cartographer's Tools, Bedroll, Quiver, Tent, Traveler's Clothes, 3 GP", weaponIds: ['shortbow'], goldPieces: 3, otherItems: ['20 Arrows', "Cartographer's Tools", 'Bedroll', 'Quiver', 'Tent', "Traveler's Clothes"] },
  guidePackB: { id: 'guidePackB', label: '50 GP', goldPieces: 50 },
  hermitPackA: { id: 'hermitPackA', label: "Quarterstaff, Herbalism Kit, Bedroll, Book (philosophy), Lamp, Oil (3 flasks), Traveler's Clothes, 16 GP", weaponIds: ['quarterstaff'], goldPieces: 16, otherItems: ['Herbalism Kit', 'Bedroll', 'Book (philosophy)', 'Lamp', 'Oil (3 flasks)', "Traveler's Clothes"] },
  hermitPackB: { id: 'hermitPackB', label: '50 GP', goldPieces: 50 },
  merchantPackA: { id: 'merchantPackA', label: "Navigator's Tools, 2 Pouches, Traveler's Clothes, 22 GP", goldPieces: 22, otherItems: ["Navigator's Tools", '2 Pouches', "Traveler's Clothes"] },
  merchantPackB: { id: 'merchantPackB', label: '50 GP', goldPieces: 50 },
  noblePackA: { id: 'noblePackA', label: 'Gaming Set (choice), Fine Clothes, Perfume, 29 GP', goldPieces: 29, otherItems: ['Gaming Set (choice)', 'Fine Clothes', 'Perfume'] },
  noblePackB: { id: 'noblePackB', label: '50 GP', goldPieces: 50 },
  sagePackA: { id: 'sagePackA', label: "Quarterstaff, Calligrapher's Supplies, Book (history), Parchment (8 sheets), Robe, 8 GP", weaponIds: ['quarterstaff'], goldPieces: 8, otherItems: ["Calligrapher's Supplies", 'Book (history)', 'Parchment (8 sheets)', 'Robe'] },
  sagePackB: { id: 'sagePackB', label: '50 GP', goldPieces: 50 },
  sailorPackA: { id: 'sailorPackA', label: "Dagger, Navigator's Tools, Rope, Traveler's Clothes, 20 GP", weaponIds: ['dagger'], goldPieces: 20, otherItems: ["Navigator's Tools", 'Rope', "Traveler's Clothes"] },
  sailorPackB: { id: 'sailorPackB', label: '50 GP', goldPieces: 50 },
  scribePackA: { id: 'scribePackA', label: "Calligrapher's Supplies, Fine Clothes, Lamp, Oil (3 flasks), Parchment (12 sheets), 23 GP", goldPieces: 23, otherItems: ["Calligrapher's Supplies", 'Fine Clothes', 'Lamp', 'Oil (3 flasks)', 'Parchment (12 sheets)'] },
  scribePackB: { id: 'scribePackB', label: '50 GP', goldPieces: 50 },
  wayfarerPackA: { id: 'wayfarerPackA', label: "2 Daggers, Thieves' Tools, Gaming Set (any), Bedroll, 2 Pouches, Traveler's Clothes, 16 GP", weaponIds: ['dagger'], goldPieces: 16, otherItems: ['2nd Dagger', "Thieves' Tools", 'Gaming Set (any)', 'Bedroll', '2 Pouches', "Traveler's Clothes"] },
  wayfarerPackB: { id: 'wayfarerPackB', label: '50 GP', goldPieces: 50 },
}
