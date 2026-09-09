import type { ArmorDefinition, WeaponDefinition, WeaponMasteryPropertyDefinition } from '../../domain/types'

const source = { sourceId: 'PHB2024', sourceLabel: 'PHB 2024', page: 214 } as const

// PHB 2024 p.213-214, "Mastery Properties"
export const weaponMasteryProperties: Record<string, WeaponMasteryPropertyDefinition> = {
  cleave: {
    id: 'cleave',
    name: 'Cleave',
    source,
    summary: 'On a hit, make a melee attack with the same weapon against a second creature within 5 feet of the first and in reach. No ability modifier on the second hit\'s damage unless negative. Once per turn.',
  },
  graze: {
    id: 'graze',
    name: 'Graze',
    source,
    summary: 'On a miss, still deal damage to the target equal to the ability modifier used for the attack.',
  },
  nick: {
    id: 'nick',
    name: 'Nick',
    source,
    summary: 'The Light property\'s extra attack can be made as part of the Attack action instead of as a Bonus Action. Once per turn.',
  },
  push: {
    id: 'push',
    name: 'Push',
    source,
    summary: 'On a hit, push the target up to 10 feet straight away from you if it is Large or smaller.',
  },
  sap: {
    id: 'sap',
    name: 'Sap',
    source,
    summary: 'On a hit, the target has Disadvantage on its next attack roll before the start of your next turn.',
  },
  slow: {
    id: 'slow',
    name: 'Slow',
    source,
    summary: 'On a hit that deals damage, reduce the target\'s Speed by 10 feet until the start of your next turn (doesn\'t stack).',
  },
  topple: {
    id: 'topple',
    name: 'Topple',
    source,
    summary: 'On a hit, force a Constitution save (DC 8 + ability modifier + Proficiency Bonus) or the target has the Prone condition.',
  },
  vex: {
    id: 'vex',
    name: 'Vex',
    source,
    summary: 'On a hit that deals damage, you have Advantage on your next attack roll against that target before the end of your next turn.',
  },
}

// PHB 2024 p.214-215, "Weapons" table
export const weapons: Record<string, WeaponDefinition> = {
  club: { id: 'club', name: 'Club', source, category: 'simple', rangeType: 'melee', damageDice: '1d4', damageType: 'Bludgeoning', properties: ['light'], masteryPropertyId: 'slow', cost: '1 SP', weight: '2 lb.' },
  dagger: { id: 'dagger', name: 'Dagger', source, category: 'simple', rangeType: 'melee', damageDice: '1d4', damageType: 'Piercing', properties: ['finesse', 'light', 'thrown'], masteryPropertyId: 'nick', cost: '2 GP', weight: '1 lb.' },
  greatclub: { id: 'greatclub', name: 'Greatclub', source, category: 'simple', rangeType: 'melee', damageDice: '1d8', damageType: 'Bludgeoning', properties: ['twoHanded'], masteryPropertyId: 'push', cost: '2 SP', weight: '10 lb.' },
  handaxe: { id: 'handaxe', name: 'Handaxe', source, category: 'simple', rangeType: 'melee', damageDice: '1d6', damageType: 'Slashing', properties: ['light', 'thrown'], masteryPropertyId: 'vex', cost: '5 GP', weight: '2 lb.' },
  javelin: { id: 'javelin', name: 'Javelin', source, category: 'simple', rangeType: 'melee', damageDice: '1d6', damageType: 'Piercing', properties: ['thrown'], masteryPropertyId: 'slow', cost: '5 SP', weight: '2 lb.' },
  lightHammer: { id: 'lightHammer', name: 'Light Hammer', source, category: 'simple', rangeType: 'melee', damageDice: '1d4', damageType: 'Bludgeoning', properties: ['light', 'thrown'], masteryPropertyId: 'nick', cost: '2 GP', weight: '2 lb.' },
  mace: { id: 'mace', name: 'Mace', source, category: 'simple', rangeType: 'melee', damageDice: '1d6', damageType: 'Bludgeoning', properties: [], masteryPropertyId: 'sap', cost: '5 GP', weight: '4 lb.' },
  quarterstaff: { id: 'quarterstaff', name: 'Quarterstaff', source, category: 'simple', rangeType: 'melee', damageDice: '1d6', damageType: 'Bludgeoning', properties: ['versatile'], versatileDamageDice: '1d8', masteryPropertyId: 'topple', cost: '2 SP', weight: '4 lb.' },
  sickle: { id: 'sickle', name: 'Sickle', source, category: 'simple', rangeType: 'melee', damageDice: '1d4', damageType: 'Slashing', properties: ['light'], masteryPropertyId: 'nick', cost: '1 GP', weight: '2 lb.' },
  spear: { id: 'spear', name: 'Spear', source, category: 'simple', rangeType: 'melee', damageDice: '1d6', damageType: 'Piercing', properties: ['thrown', 'versatile'], versatileDamageDice: '1d8', masteryPropertyId: 'sap', cost: '1 GP', weight: '3 lb.' },
  dart: { id: 'dart', name: 'Dart', source, category: 'simple', rangeType: 'ranged', damageDice: '1d4', damageType: 'Piercing', properties: ['finesse', 'thrown'], masteryPropertyId: 'vex', cost: '5 CP', weight: '1/4 lb.' },
  lightCrossbow: { id: 'lightCrossbow', name: 'Light Crossbow', source, category: 'simple', rangeType: 'ranged', damageDice: '1d8', damageType: 'Piercing', properties: ['ammunition', 'loading', 'twoHanded'], masteryPropertyId: 'slow', cost: '25 GP', weight: '5 lb.' },
  shortbow: { id: 'shortbow', name: 'Shortbow', source, category: 'simple', rangeType: 'ranged', damageDice: '1d6', damageType: 'Piercing', properties: ['ammunition', 'twoHanded'], masteryPropertyId: 'vex', cost: '25 GP', weight: '2 lb.' },
  sling: { id: 'sling', name: 'Sling', source, category: 'simple', rangeType: 'ranged', damageDice: '1d4', damageType: 'Bludgeoning', properties: ['ammunition'], masteryPropertyId: 'slow', cost: '1 SP', weight: '—' },
  battleaxe: { id: 'battleaxe', name: 'Battleaxe', source, category: 'martial', rangeType: 'melee', damageDice: '1d8', damageType: 'Slashing', properties: ['versatile'], versatileDamageDice: '1d10', masteryPropertyId: 'topple', cost: '10 GP', weight: '4 lb.' },
  flail: { id: 'flail', name: 'Flail', source, category: 'martial', rangeType: 'melee', damageDice: '1d8', damageType: 'Bludgeoning', properties: [], masteryPropertyId: 'sap', cost: '10 GP', weight: '2 lb.' },
  glaive: { id: 'glaive', name: 'Glaive', source, category: 'martial', rangeType: 'melee', damageDice: '1d10', damageType: 'Slashing', properties: ['heavy', 'reach', 'twoHanded'], masteryPropertyId: 'graze', cost: '20 GP', weight: '6 lb.' },
  greataxe: { id: 'greataxe', name: 'Greataxe', source, category: 'martial', rangeType: 'melee', damageDice: '1d12', damageType: 'Slashing', properties: ['heavy', 'twoHanded'], masteryPropertyId: 'cleave', cost: '30 GP', weight: '7 lb.' },
  greatsword: { id: 'greatsword', name: 'Greatsword', source, category: 'martial', rangeType: 'melee', damageDice: '2d6', damageType: 'Slashing', properties: ['heavy', 'twoHanded'], masteryPropertyId: 'graze', cost: '50 GP', weight: '6 lb.' },
  halberd: { id: 'halberd', name: 'Halberd', source, category: 'martial', rangeType: 'melee', damageDice: '1d10', damageType: 'Slashing', properties: ['heavy', 'reach', 'twoHanded'], masteryPropertyId: 'cleave', cost: '20 GP', weight: '6 lb.' },
  lance: { id: 'lance', name: 'Lance', source, category: 'martial', rangeType: 'melee', damageDice: '1d10', damageType: 'Piercing', properties: ['heavy', 'reach'], masteryPropertyId: 'topple', cost: '10 GP', weight: '6 lb.' },
  longsword: { id: 'longsword', name: 'Longsword', source, category: 'martial', rangeType: 'melee', damageDice: '1d8', damageType: 'Slashing', properties: ['versatile'], versatileDamageDice: '1d10', masteryPropertyId: 'sap', cost: '15 GP', weight: '3 lb.' },
  maul: { id: 'maul', name: 'Maul', source, category: 'martial', rangeType: 'melee', damageDice: '2d6', damageType: 'Bludgeoning', properties: ['heavy', 'twoHanded'], masteryPropertyId: 'topple', cost: '10 GP', weight: '10 lb.' },
  morningstar: { id: 'morningstar', name: 'Morningstar', source, category: 'martial', rangeType: 'melee', damageDice: '1d8', damageType: 'Piercing', properties: [], masteryPropertyId: 'sap', cost: '15 GP', weight: '4 lb.' },
  pike: { id: 'pike', name: 'Pike', source, category: 'martial', rangeType: 'melee', damageDice: '1d10', damageType: 'Piercing', properties: ['heavy', 'reach', 'twoHanded'], masteryPropertyId: 'push', cost: '5 GP', weight: '18 lb.' },
  rapier: { id: 'rapier', name: 'Rapier', source, category: 'martial', rangeType: 'melee', damageDice: '1d8', damageType: 'Piercing', properties: ['finesse'], masteryPropertyId: 'vex', cost: '25 GP', weight: '2 lb.' },
  scimitar: { id: 'scimitar', name: 'Scimitar', source, category: 'martial', rangeType: 'melee', damageDice: '1d6', damageType: 'Slashing', properties: ['finesse', 'light'], masteryPropertyId: 'nick', cost: '25 GP', weight: '3 lb.' },
  shortsword: { id: 'shortsword', name: 'Shortsword', source, category: 'martial', rangeType: 'melee', damageDice: '1d6', damageType: 'Piercing', properties: ['finesse', 'light'], masteryPropertyId: 'vex', cost: '10 GP', weight: '2 lb.' },
  trident: { id: 'trident', name: 'Trident', source, category: 'martial', rangeType: 'melee', damageDice: '1d8', damageType: 'Piercing', properties: ['thrown', 'versatile'], versatileDamageDice: '1d10', masteryPropertyId: 'topple', cost: '5 GP', weight: '4 lb.' },
  warhammer: { id: 'warhammer', name: 'Warhammer', source, category: 'martial', rangeType: 'melee', damageDice: '1d8', damageType: 'Bludgeoning', properties: ['versatile'], versatileDamageDice: '1d10', masteryPropertyId: 'push', cost: '15 GP', weight: '5 lb.' },
  warPick: { id: 'warPick', name: 'War Pick', source, category: 'martial', rangeType: 'melee', damageDice: '1d8', damageType: 'Piercing', properties: ['versatile'], versatileDamageDice: '1d10', masteryPropertyId: 'sap', cost: '5 GP', weight: '2 lb.' },
  whip: { id: 'whip', name: 'Whip', source, category: 'martial', rangeType: 'melee', damageDice: '1d4', damageType: 'Slashing', properties: ['finesse', 'reach'], masteryPropertyId: 'slow', cost: '2 GP', weight: '3 lb.' },
  blowgun: { id: 'blowgun', name: 'Blowgun', source, category: 'martial', rangeType: 'ranged', damageDice: '1', damageType: 'Piercing', properties: ['ammunition', 'loading'], masteryPropertyId: 'vex', cost: '10 GP', weight: '1 lb.' },
  handCrossbow: { id: 'handCrossbow', name: 'Hand Crossbow', source, category: 'martial', rangeType: 'ranged', damageDice: '1d6', damageType: 'Piercing', properties: ['ammunition', 'light', 'loading'], masteryPropertyId: 'vex', cost: '75 GP', weight: '3 lb.' },
  heavyCrossbow: { id: 'heavyCrossbow', name: 'Heavy Crossbow', source, category: 'martial', rangeType: 'ranged', damageDice: '1d10', damageType: 'Piercing', properties: ['ammunition', 'heavy', 'loading', 'twoHanded'], masteryPropertyId: 'push', cost: '50 GP', weight: '18 lb.' },
  longbow: { id: 'longbow', name: 'Longbow', source, category: 'martial', rangeType: 'ranged', damageDice: '1d8', damageType: 'Piercing', properties: ['ammunition', 'heavy', 'twoHanded'], masteryPropertyId: 'slow', cost: '50 GP', weight: '2 lb.' },
  musket: { id: 'musket', name: 'Musket', source, category: 'martial', rangeType: 'ranged', damageDice: '1d12', damageType: 'Piercing', properties: ['ammunition', 'loading', 'twoHanded'], masteryPropertyId: 'slow', cost: '500 GP', weight: '10 lb.' },
  pistol: { id: 'pistol', name: 'Pistol', source, category: 'martial', rangeType: 'ranged', damageDice: '1d10', damageType: 'Piercing', properties: ['ammunition', 'loading'], masteryPropertyId: 'vex', cost: '250 GP', weight: '3 lb.' },
}

// PHB 2024 p.218-219, "Armor" table
export const armor: Record<string, ArmorDefinition> = {
  paddedArmor: { id: 'paddedArmor', name: 'Padded Armor', source, category: 'light', baseAC: 11, stealthDisadvantage: true, cost: '5 GP', weight: '8 lb.' },
  leatherArmor: { id: 'leatherArmor', name: 'Leather Armor', source, category: 'light', baseAC: 11, cost: '10 GP', weight: '10 lb.' },
  studdedLeatherArmor: { id: 'studdedLeatherArmor', name: 'Studded Leather Armor', source, category: 'light', baseAC: 12, cost: '45 GP', weight: '13 lb.' },
  hideArmor: { id: 'hideArmor', name: 'Hide Armor', source, category: 'medium', baseAC: 12, dexModifierCap: 2, cost: '10 GP', weight: '12 lb.' },
  chainShirt: { id: 'chainShirt', name: 'Chain Shirt', source, category: 'medium', baseAC: 13, dexModifierCap: 2, cost: '50 GP', weight: '20 lb.' },
  scaleMail: { id: 'scaleMail', name: 'Scale Mail', source, category: 'medium', baseAC: 14, dexModifierCap: 2, stealthDisadvantage: true, cost: '50 GP', weight: '45 lb.' },
  breastplate: { id: 'breastplate', name: 'Breastplate', source, category: 'medium', baseAC: 14, dexModifierCap: 2, cost: '400 GP', weight: '20 lb.' },
  halfPlateArmor: { id: 'halfPlateArmor', name: 'Half Plate Armor', source, category: 'medium', baseAC: 15, dexModifierCap: 2, stealthDisadvantage: true, cost: '750 GP', weight: '40 lb.' },
  ringMail: { id: 'ringMail', name: 'Ring Mail', source, category: 'heavy', baseAC: 14, stealthDisadvantage: true, cost: '30 GP', weight: '40 lb.' },
  chainMail: { id: 'chainMail', name: 'Chain Mail', source, category: 'heavy', baseAC: 16, strengthRequirement: 13, stealthDisadvantage: true, cost: '75 GP', weight: '55 lb.' },
  splintArmor: { id: 'splintArmor', name: 'Splint Armor', source, category: 'heavy', baseAC: 17, strengthRequirement: 15, stealthDisadvantage: true, cost: '200 GP', weight: '60 lb.' },
  plateArmor: { id: 'plateArmor', name: 'Plate Armor', source, category: 'heavy', baseAC: 18, strengthRequirement: 15, stealthDisadvantage: true, cost: '1,500 GP', weight: '65 lb.' },
  shield: { id: 'shield', name: 'Shield', source, category: 'shield', baseAC: 2, cost: '10 GP', weight: '6 lb.' },
}
