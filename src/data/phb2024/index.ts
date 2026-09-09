import type { RegistryModule } from '../registry'
import { armor, weaponMasteryProperties, weapons } from './equipment'
import { feats } from './feats'
import { generalActions } from './generalActions'
import { backgrounds, equipmentPacks, species } from './origins'
import { spells } from './spells'
import { barbarianChoiceOptions, barbarianChoices, barbarianFeatures, barbarianResources, barbarianClass } from './classes/barbarian'
import { bardChoices, bardFeatures, bardResources, bardClass } from './classes/bard'
import { clericChoiceOptions, clericChoices, clericFeatures, clericResources, clericClass } from './classes/cleric'
import { druidChoiceOptions, druidChoices, druidFeatures, druidResources, druidClass } from './classes/druid'
import { fighterChoiceOptions, fighterChoices, fighterFeatures, fighterResources, fighterClass } from './classes/fighter'
import { monkChoices, monkFeatures, monkResources, monkClass } from './classes/monk'
import { paladinChoiceOptions, paladinChoices, paladinFeatures, paladinResources, paladinClass } from './classes/paladin'
import { rangerChoiceOptions, rangerChoices, rangerFeatures, rangerResources, rangerClass } from './classes/ranger'
import { wizardChoices, wizardFeatures, wizardResources, wizardClass } from './classes/wizard'
import { rogueChoiceOptions, rogueChoices, rogueConditionalModifiers, rogueFeatures, rogueResources, rogueClass } from './classes/rogue'
import { sorcererChoiceOptions, sorcererChoices, sorcererFeatures, sorcererResources, sorcererClass } from './classes/sorcerer'
import { warlockChoiceOptions, warlockChoices, warlockFeatures, warlockResources, warlockClass } from './classes/warlock'
import {
  barbarianSubclassChoiceOptions,
  barbarianSubclassChoices,
  barbarianSubclassFeatures,
  barbarianSubclassResources,
  barbarianSubclasses,
} from './subclasses/barbarianSubclasses'
import { bardSubclassFeatures, bardSubclassResources, bardSubclasses } from './subclasses/bardSubclasses'
import { clericSubclassFeatures, clericSubclassResources, clericSubclasses } from './subclasses/clericSubclasses'
import { druidSubclassFeatures, druidSubclassResources, druidSubclasses } from './subclasses/druidSubclasses'
import {
  fighterSubclassChoiceOptions,
  fighterSubclassChoices,
  fighterSubclassFeatures,
  fighterSubclassResources,
  fighterSubclasses,
} from './subclasses/fighterSubclasses'
import { monkSubclassFeatures, monkSubclassResources, monkSubclasses } from './subclasses/monkSubclasses'
import { paladinSubclassFeatures, paladinSubclassResources, paladinSubclasses } from './subclasses/paladinSubclasses'
import {
  rangerSubclassChoiceOptions,
  rangerSubclassChoices,
  rangerSubclassFeatures,
  rangerSubclassResources,
  rangerSubclasses,
} from './subclasses/rangerSubclasses'
import {
  wizardSubclassFeatures,
  wizardSubclassResources,
  wizardSubclasses,
} from './subclasses/wizardSubclasses'
import { rogueSubclassFeatures, rogueSubclassResources, rogueSubclasses } from './subclasses/rogueSubclasses'
import {
  sorcererSubclassChoiceOptions,
  sorcererSubclassChoices,
  sorcererSubclassFeatures,
  sorcererSubclassResources,
  sorcererSubclasses,
} from './subclasses/sorcererSubclasses'
import { warlockSubclassFeatures, warlockSubclassResources, warlockSubclasses } from './subclasses/warlockSubclasses'
import { speciesTraits, traitChoiceOptions, traitChoices } from './traits'

export { FIGHTING_STYLE_FEAT_IDS, GENERAL_FEAT_IDS } from './feats'
export { eldritchKnightSpellcasting } from './subclasses/fighterSubclasses'
export { wizardSpellcasting } from './classes/wizard'
export { arcaneTricksterSpellcasting } from './subclasses/rogueSubclasses'
export { warlockSpellcasting, warlockInvocationOptions } from './classes/warlock'
export { sorcererSpellcasting } from './classes/sorcerer'
export { clericSpellcasting } from './classes/cleric'
export { bardSpellcasting } from './classes/bard'
export { druidSpellcasting } from './classes/druid'
export { paladinSpellcasting } from './classes/paladin'
export { rangerSpellcasting } from './classes/ranger'

/**
 * The complete PHB2024 content module — all 12 core classes populated
 * (Fighter — Phase 1; Wizard — Phase 2; Rogue + Warlock — Phase 3;
 * Barbarian + Sorcerer — Phase 4 pair 1; Monk + Cleric — Phase 4 pair 2;
 * Bard + Druid — Phase 4 pair 3; Paladin + Ranger — Phase 4 pair 4, the
 * final pair). Registering this via buildRegistry is the only step required
 * to make this content available; nothing else in the app references these
 * data files directly.
 */
export const phb2024Module: RegistryModule = {
  classes: {
    barbarian: barbarianClass,
    bard: bardClass,
    cleric: clericClass,
    druid: druidClass,
    fighter: fighterClass,
    monk: monkClass,
    paladin: paladinClass,
    ranger: rangerClass,
    wizard: wizardClass,
    rogue: rogueClass,
    sorcerer: sorcererClass,
    warlock: warlockClass,
  },
  subclasses: {
    ...barbarianSubclasses,
    ...bardSubclasses,
    ...clericSubclasses,
    ...druidSubclasses,
    ...fighterSubclasses,
    ...monkSubclasses,
    ...paladinSubclasses,
    ...rangerSubclasses,
    ...wizardSubclasses,
    ...rogueSubclasses,
    ...sorcererSubclasses,
    ...warlockSubclasses,
  },
  features: {
    ...barbarianFeatures, ...barbarianSubclassFeatures,
    ...bardFeatures, ...bardSubclassFeatures,
    ...clericFeatures, ...clericSubclassFeatures,
    ...druidFeatures, ...druidSubclassFeatures,
    ...fighterFeatures, ...fighterSubclassFeatures,
    ...monkFeatures, ...monkSubclassFeatures,
    ...paladinFeatures, ...paladinSubclassFeatures,
    ...rangerFeatures, ...rangerSubclassFeatures,
    ...wizardFeatures, ...wizardSubclassFeatures,
    ...rogueFeatures, ...rogueSubclassFeatures,
    ...sorcererFeatures, ...sorcererSubclassFeatures,
    ...warlockFeatures, ...warlockSubclassFeatures,
    ...speciesTraits,
  },
  resources: {
    ...barbarianResources, ...barbarianSubclassResources,
    ...bardResources, ...bardSubclassResources,
    ...clericResources, ...clericSubclassResources,
    ...druidResources, ...druidSubclassResources,
    ...fighterResources, ...fighterSubclassResources,
    ...monkResources, ...monkSubclassResources,
    ...paladinResources, ...paladinSubclassResources,
    ...rangerResources, ...rangerSubclassResources,
    ...wizardResources, ...wizardSubclassResources,
    ...rogueResources, ...rogueSubclassResources,
    ...sorcererResources, ...sorcererSubclassResources,
    ...warlockResources, ...warlockSubclassResources,
  },
  conditionalModifiers: { ...rogueConditionalModifiers },
  choices: {
    ...barbarianChoices, ...barbarianSubclassChoices,
    ...bardChoices,
    ...clericChoices,
    ...druidChoices,
    ...fighterChoices, ...fighterSubclassChoices,
    ...monkChoices,
    ...paladinChoices,
    ...rangerChoices, ...rangerSubclassChoices,
    ...wizardChoices,
    ...rogueChoices,
    ...sorcererChoices, ...sorcererSubclassChoices,
    ...warlockChoices,
    ...traitChoices,
  },
  choiceOptions: {
    ...barbarianChoiceOptions, ...barbarianSubclassChoiceOptions,
    ...clericChoiceOptions,
    ...druidChoiceOptions,
    ...fighterChoiceOptions, ...fighterSubclassChoiceOptions,
    ...paladinChoiceOptions,
    ...rangerChoiceOptions, ...rangerSubclassChoiceOptions,
    ...rogueChoiceOptions,
    ...sorcererChoiceOptions, ...sorcererSubclassChoiceOptions,
    ...warlockChoiceOptions,
    ...traitChoiceOptions,
  },
  backgrounds,
  species,
  feats,
  generalActions,
  weapons,
  armor,
  weaponMasteryProperties,
  equipmentPacks,
  spells,
}
