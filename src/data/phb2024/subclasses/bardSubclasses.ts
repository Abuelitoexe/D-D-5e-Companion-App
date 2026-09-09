import type { FeatureDefinition, ResourceDefinition, SubclassDefinition } from '../../../domain/types'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.63-66 — all 4 Bard subclasses, extracted via pdftotext -raw.
// All 4 share a 3/6/14 feature-level pattern (no level 10 or 17 features),
// confirmed directly from each subclass's own prose.
export const bardSubclasses: Record<string, SubclassDefinition> = {
  collegeOfDance: {
    id: 'collegeOfDance',
    name: 'College of Dance',
    parentClassId: 'bard',
    minimumLevel: 3,
    source: src(63),
    featuresByLevel: {
      3: ['dance-dazzling-footwork'],
      6: ['dance-inspiring-movement', 'dance-tandem-footwork'],
      14: ['dance-leading-evasion'],
    },
  },
  collegeOfGlamour: {
    id: 'collegeOfGlamour',
    name: 'College of Glamour',
    parentClassId: 'bard',
    minimumLevel: 3,
    source: src(64),
    featuresByLevel: {
      3: ['glamour-beguiling-magic', 'glamour-mantle-of-inspiration'],
      6: ['glamour-mantle-of-majesty'],
      14: ['glamour-unbreakable-majesty'],
    },
    resources: ['glamourBeguilingMagic', 'glamourMantleOfMajesty', 'glamourUnbreakableMajesty'],
  },
  collegeOfLore: {
    id: 'collegeOfLore',
    name: 'College of Lore',
    parentClassId: 'bard',
    minimumLevel: 3,
    source: src(65),
    featuresByLevel: {
      3: ['lore-bonus-proficiencies', 'lore-cutting-words'],
      6: ['lore-magical-discoveries'],
      14: ['lore-peerless-skill'],
    },
  },
  collegeOfValor: {
    id: 'collegeOfValor',
    name: 'College of Valor',
    parentClassId: 'bard',
    minimumLevel: 3,
    source: src(66),
    featuresByLevel: {
      3: ['valor-combat-inspiration', 'valor-martial-training'],
      6: ['valor-extra-attack'],
      14: ['valor-battle-magic'],
    },
  },
}

export const bardSubclassResources: Record<string, ResourceDefinition> = {
  glamourBeguilingMagic: {
    id: 'glamourBeguilingMagic',
    name: 'Beguiling Magic',
    minimumLevel: 3,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(64),
  },
  glamourMantleOfMajesty: {
    id: 'glamourMantleOfMajesty',
    name: 'Mantle of Majesty',
    minimumLevel: 6,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(64),
  },
  glamourUnbreakableMajesty: {
    id: 'glamourUnbreakableMajesty',
    name: 'Unbreakable Majesty',
    minimumLevel: 14,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['shortRest', 'longRest'] },
    source: src(65),
  },
}

export const bardSubclassFeatures: Record<string, FeatureDefinition> = {
  // ---- College of Dance ----
  'dance-dazzling-footwork': {
    id: 'dance-dazzling-footwork',
    name: 'Dazzling Footwork',
    source: src(63),
    minimumLevel: 3,
    activation: 'passive',
    summary:
      "While unarmored and not wielding a Shield: Advantage on Charisma (Performance) checks involving dancing; base AC = 10 + Dexterity + Charisma modifiers; expending a Bardic Inspiration die as part of an action/Bonus Action/Reaction lets you also make an Unarmed Strike; use Dexterity for Unarmed Strike attacks, dealing a Bardic Inspiration die roll + Dexterity modifier Bludgeoning damage instead of normal damage (without expending the die).",
  },
  'dance-inspiring-movement': {
    id: 'dance-inspiring-movement',
    name: 'Inspiring Movement',
    source: src(63),
    minimumLevel: 6,
    activation: 'reaction',
    resourceId: 'bardicInspiration',
    summary: "When an enemy you can see ends its turn within 5 ft of you, expend a Bardic Inspiration use to move up to half your Speed (no Opportunity Attacks); one ally within 30 ft can also move up to half their Speed with their own Reaction.",
  },
  'dance-tandem-footwork': {
    id: 'dance-tandem-footwork',
    name: 'Tandem Footwork',
    source: src(63),
    minimumLevel: 6,
    activation: 'special',
    resourceId: 'bardicInspiration',
    summary: "When you roll Initiative (and aren't Incapacitated), expend a Bardic Inspiration use and roll the die: you and each ally within 30 ft who can see/hear you gain that bonus to Initiative.",
  },
  'dance-leading-evasion': {
    id: 'dance-leading-evasion',
    name: 'Leading Evasion',
    source: src(64),
    minimumLevel: 14,
    activation: 'passive',
    summary: "A successful Dexterity save that would deal half damage instead deals none (half on a fail); you can share this with allies making the same save within 5 ft. Not while Incapacitated.",
  },
  // ---- College of Glamour ----
  'glamour-beguiling-magic': {
    id: 'glamour-beguiling-magic',
    name: 'Beguiling Magic',
    source: src(64),
    minimumLevel: 3,
    activation: 'special',
    resourceId: 'glamourBeguilingMagic',
    summary: "Always have Charm Person and Mirror Image prepared. Immediately after casting an Enchantment/Illusion spell with a slot, force a Wisdom save on a creature within 60 ft or it's Charmed or Frightened (your choice) for 1 minute. Once per Long Rest, though you can restore this use early by expending a Bardic Inspiration.",
  },
  'glamour-mantle-of-inspiration': {
    id: 'glamour-mantle-of-inspiration',
    name: 'Mantle of Inspiration',
    source: src(64),
    minimumLevel: 3,
    activation: 'bonusAction',
    resourceId: 'bardicInspiration',
    summary: "Expend a Bardic Inspiration die and roll it: up to your Charisma modifier (min 1) creatures within 60 ft gain Temporary HP equal to twice the roll, and each can then use its Reaction to move up to its Speed without provoking Opportunity Attacks.",
  },
  'glamour-mantle-of-majesty': {
    id: 'glamour-mantle-of-majesty',
    name: 'Mantle of Majesty',
    source: src(64),
    minimumLevel: 6,
    activation: 'bonusAction',
    resourceId: 'glamourMantleOfMajesty',
    summary: "Always have Command prepared; cast it without a slot as a Bonus Action, taking on an unearthly appearance for 1 minute (or until the Command ends) during which you can cast Command again as a Bonus Action for free, and Charmed creatures auto-fail their save against it. Once per Long Rest, though you can restore this use early by expending a level 3+ spell slot.",
  },
  'glamour-unbreakable-majesty': {
    id: 'glamour-unbreakable-majesty',
    name: 'Unbreakable Majesty',
    source: src(65),
    minimumLevel: 14,
    activation: 'bonusAction',
    resourceId: 'glamourUnbreakableMajesty',
    summary: "For 1 minute (or until Incapacitated), the first time each turn a creature hits you it must succeed on a Charisma save against your spell save DC or the attack misses instead. Once per Short or Long Rest.",
  },
  // ---- College of Lore ----
  'lore-bonus-proficiencies': {
    id: 'lore-bonus-proficiencies',
    name: 'Bonus Proficiencies',
    source: src(65),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Gain proficiency with 3 skills of your choice.',
  },
  'lore-cutting-words': {
    id: 'lore-cutting-words',
    name: 'Cutting Words',
    source: src(65),
    minimumLevel: 3,
    activation: 'reaction',
    resourceId: 'bardicInspiration',
    summary: "When a creature you can see within 60 ft makes a damage roll or succeeds on an ability check/attack roll, expend a Bardic Inspiration use and roll the die, subtracting it from that roll — potentially turning a hit or success into a miss or failure.",
  },
  'lore-magical-discoveries': {
    id: 'lore-magical-discoveries',
    name: 'Magical Discoveries',
    source: src(65),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Learn 2 spells (cantrips or spells you have slots for) from the Cleric, Druid, or Wizard spell lists; always prepared, replaceable on a level-up. (Cross-class spells aren\'t auto-added to the prepared list here — pick them manually in Spells.)',
  },
  'lore-peerless-skill': {
    id: 'lore-peerless-skill',
    name: 'Peerless Skill',
    source: src(66),
    minimumLevel: 14,
    activation: 'special',
    resourceId: 'bardicInspiration',
    summary: "On a failed ability check or attack roll, expend a Bardic Inspiration use and add the die roll to the d20, potentially turning it into a success. If it's still a failure, the use isn't expended. (The conditional refund isn't automated — restore the use manually if it fails.)",
  },
  // ---- College of Valor ----
  'valor-combat-inspiration': {
    id: 'valor-combat-inspiration',
    name: 'Combat Inspiration',
    source: src(66),
    minimumLevel: 3,
    activation: 'passive',
    summary: "A creature holding your Bardic Inspiration die can use it to add the roll to its AC against a hit (Reaction) or to its damage after a hit, instead of the usual D20 Test use.",
  },
  'valor-martial-training': {
    id: 'valor-martial-training',
    name: 'Martial Training',
    source: src(66),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Proficiency with Martial weapons and training with Medium armor and Shields; a Simple or Martial weapon can serve as your Spellcasting Focus.',
  },
  'valor-extra-attack': {
    id: 'valor-extra-attack',
    name: 'Extra Attack',
    source: src(66),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Attack twice, instead of once, whenever you take the Attack action; you can cast an Action-cost cantrip in place of one of those attacks.',
  },
  'valor-battle-magic': {
    id: 'valor-battle-magic',
    name: 'Battle Magic',
    source: src(66),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'After casting an Action-cost spell, make one weapon attack as a Bonus Action.',
  },
}
