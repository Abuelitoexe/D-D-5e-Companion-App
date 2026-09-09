import type {
  ChoiceDefinition,
  ChoiceOptionDefinition,
  FeatureDefinition,
  ResourceDefinition,
  SpellcastingDefinition,
  SubclassDefinition,
} from '../../../domain/types'
import { FIGHTING_STYLE_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// Eldritch Knight Spellcasting table, PHB 2024 p.97 — keyed by Fighter level.
export const eldritchKnightSpellcasting: SpellcastingDefinition = {
  ability: 'Intelligence',
  slotProgression: 'custom',
  cantripProgression: { 3: 2, 10: 3 },
  preparedSource: 'knownList',
  preparedCountFormula: { kind: 'levelTable', table: { 3: 3, 4: 4, 7: 5, 8: 6, 10: 7, 11: 8, 13: 9, 14: 10, 16: 11, 19: 12, 20: 13 } },
  swapPolicy: { timing: ['onLevelUp'], count: 1 },
  slotTable: {
    3: { 1: 2 },
    4: { 1: 3 },
    5: { 1: 3 },
    6: { 1: 3 },
    7: { 1: 4, 2: 2 },
    8: { 1: 4, 2: 2 },
    9: { 1: 4, 2: 2 },
    10: { 1: 4, 2: 3 },
    11: { 1: 4, 2: 3 },
    12: { 1: 4, 2: 3 },
    13: { 1: 4, 2: 3, 3: 2 },
    14: { 1: 4, 2: 3, 3: 2 },
    15: { 1: 4, 2: 3, 3: 2 },
    16: { 1: 4, 2: 3, 3: 3 },
    17: { 1: 4, 2: 3, 3: 3 },
    18: { 1: 4, 2: 3, 3: 3 },
    19: { 1: 4, 2: 3, 3: 3 },
    20: { 1: 4, 2: 3, 3: 3 },
  },
  ritualCasting: { fromSpellbookOnly: false, requiresPreparation: true },
  // References the Wizard spell list, which doesn't exist in the registry
  // until Phase 2 (Wizard vertical slice) — structurally correct now,
  // content-linked later with zero changes to this definition.
  spellListId: 'wizard',
  source: src(97),
}

export const fighterSubclasses: Record<string, SubclassDefinition> = {
  battleMaster: {
    id: 'battleMaster',
    name: 'Battle Master',
    parentClassId: 'fighter',
    minimumLevel: 3,
    source: src(93),
    featuresByLevel: {
      3: ['battleMaster-combatSuperiority', 'battleMaster-studentOfWar'],
      7: ['battleMaster-knowYourEnemy'],
      10: ['battleMaster-improvedCombatSuperiority'],
      15: ['battleMaster-relentless'],
      18: ['battleMaster-ultimateCombatSuperiority'],
    },
    resources: ['superiorityDice'],
  },
  champion: {
    id: 'champion',
    name: 'Champion',
    parentClassId: 'fighter',
    minimumLevel: 3,
    source: src(96),
    featuresByLevel: {
      3: ['champion-improvedCritical', 'champion-remarkableAthlete'],
      7: ['champion-additionalFightingStyle'],
      10: ['champion-heroicWarrior'],
      15: ['champion-superiorCritical'],
      18: ['champion-survivor'],
    },
  },
  eldritchKnight: {
    id: 'eldritchKnight',
    name: 'Eldritch Knight',
    parentClassId: 'fighter',
    minimumLevel: 3,
    source: src(96),
    featuresByLevel: {
      3: ['eldritchKnight-spellcasting', 'eldritchKnight-warBond'],
      7: ['eldritchKnight-warMagic'],
      10: ['eldritchKnight-eldritchStrike'],
      15: ['eldritchKnight-arcaneCharge'],
      18: ['eldritchKnight-improvedWarMagic'],
    },
    spellcasting: eldritchKnightSpellcasting,
  },
  psiWarrior: {
    id: 'psiWarrior',
    name: 'Psi Warrior',
    parentClassId: 'fighter',
    minimumLevel: 3,
    source: src(98),
    featuresByLevel: {
      3: ['psiWarrior-psionicPower'],
      7: ['psiWarrior-telekineticAdept'],
      10: ['psiWarrior-guardedMind'],
      15: ['psiWarrior-bulwarkOfForce'],
      18: ['psiWarrior-telekineticMaster'],
    },
    resources: ['psionicEnergyDice'],
  },
}

export const fighterSubclassResources: Record<string, ResourceDefinition> = {
  superiorityDice: {
    id: 'superiorityDice',
    name: 'Superiority Dice',
    minimumLevel: 3,
    // d8s, 4 at level 3; +1 die at level 7 (5 total); +1 at level 15 (6 total).
    // Die size itself increases to d10 at level 10 and d12 at level 18 (see
    // battleMaster-improvedCombatSuperiority / ultimateCombatSuperiority).
    maximum: { kind: 'levelTable', table: { 3: 4, 7: 5, 15: 6 } },
    refresh: { default: ['shortRest', 'longRest'] },
    source: src(93),
  },
  psionicEnergyDice: {
    id: 'psionicEnergyDice',
    name: 'Psionic Energy Dice',
    minimumLevel: 3,
    // Die size: d6 (lvl3) -> d8 (lvl5) -> d10 (lvl11) -> d12 (lvl17); tracked
    // in the feature text since ResourceDefinition models count, not die size.
    maximum: { kind: 'levelTable', table: { 3: 4, 5: 6, 9: 8, 13: 10, 17: 12 } },
    refresh: { default: ['shortRest', 'longRest'] },
    partialRefresh: { shortRest: { kind: 'flat', value: 1 } },
    source: src(97),
  },
}

// PHB 2024 p.93-94, "Maneuver Options" — Battle Master's fixed maneuver list.
const maneuverOptions: [string, string][] = [
  ['Ambush', 'Expend a Superiority Die and add it to a Dexterity (Stealth) check or Initiative roll.'],
  ['Bait and Switch', 'Expend a die to swap places with a willing creature within 5 feet, without provoking Opportunity Attacks; you or the creature gains a bonus to AC equal to the roll until the start of your next turn.'],
  ["Commander's Strike", 'Replace one of your attacks to direct a willing ally who can see/hear you; they use their Reaction to attack, adding the Superiority Die to the damage.'],
  ['Commanding Presence', 'Expend a die and add it to a Charisma (Intimidation, Performance, or Persuasion) check.'],
  ['Disarming Attack', 'On a hit, add the die to the damage; the target makes a Strength save or drops one held object.'],
  ['Distracting Strike', 'On a hit, add the die to the damage; the next attack against the target by someone else has Advantage before the start of your next turn.'],
  ['Evasive Footwork', 'Bonus Action: expend a die to take the Disengage action and add the roll to your AC until the start of your next turn.'],
  ['Feinting Attack', 'Bonus Action: expend a die to gain Advantage on your next attack this turn against a target within 5 feet; on a hit, add the die to the damage.'],
  ['Goading Attack', 'On a hit, add the die to the damage; the target makes a Wisdom save or has Disadvantage on attacks against targets other than you until the end of your next turn.'],
  ['Lunging Attack', 'Bonus Action: expend a die to take the Dash action; if you move 5+ feet in a line before a melee hit this turn, add the die to the damage.'],
  ['Maneuvering Attack', 'On a hit, add the die to the damage; a willing ally who can see/hear you can use their Reaction to move up to half their Speed without provoking an Opportunity Attack from the target.'],
  ['Menacing Attack', 'On a hit, add the die to the damage; the target makes a Wisdom save or has the Frightened condition until the end of your next turn.'],
  ['Parry', 'Reaction, when a melee attack damages you: expend a die to reduce the damage by the roll plus your Strength or Dexterity modifier.'],
  ['Precision Attack', 'On a miss: expend a die, roll it, and add it to the attack roll, potentially turning it into a hit.'],
  ['Pushing Attack', 'On a hit with a weapon or Unarmed Strike, add the die to the damage; a Large or smaller target makes a Strength save or is pushed up to 15 feet away.'],
  ['Rally', 'Bonus Action: expend a die to give an ally within 30 feet Temporary Hit Points equal to the roll plus half your Fighter level (round down).'],
  ['Riposte', 'Reaction, when a creature misses you with a melee attack: expend a die to make a melee attack against it; on a hit, add the die to the damage.'],
  ['Sweeping Attack', 'On a melee hit, expend a die; a second creature within 5 feet of the target and your reach takes damage equal to the roll if the original roll would have hit it.'],
  ['Tactical Assessment', 'Expend a die and add it to an Intelligence (History or Investigation) or Wisdom (Insight) check.'],
  ['Trip Attack', 'On a hit with a weapon or Unarmed Strike, add the die to the damage; a Large or smaller target makes a Strength save or has the Prone condition.'],
]

export const battleMasterManeuverOptions: ChoiceOptionDefinition[] = maneuverOptions.map(([name, summary]) => ({
  id: `maneuver-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
  label: `${name} — ${summary}`,
  source: src(94),
}))

export const fighterSubclassChoices: Record<string, ChoiceDefinition> = {
  'battleMaster-maneuvers-choice': {
    id: 'battleMaster-maneuvers-choice',
    label: 'Maneuvers Known',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 3: 3, 7: 5, 10: 7, 15: 9 } },
    maximumSelections: { kind: 'levelTable', table: { 3: 3, 7: 5, 10: 7, 15: 9 } },
    required: true,
    // Replaceable each time you learn new maneuvers (i.e. at the levels above).
    timing: ['characterCreation', 'onLevelUp'],
    optionIds: battleMasterManeuverOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onLevelUp', maxReplacements: 'unlimited' }],
    source: src(93),
  },
  'champion-additionalFightingStyle-choice': {
    id: 'champion-additionalFightingStyle-choice',
    label: 'Additional Fighting Style',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['onLevelUp'],
    // Reuses the same Fighting Style feat pool as the core class choice.
    optionIds: FIGHTING_STYLE_FEAT_IDS,
    source: src(96),
  },
}

export const fighterSubclassChoiceOptions: Record<string, ChoiceOptionDefinition> = Object.fromEntries(
  battleMasterManeuverOptions.map((o) => [o.id, o]),
)

export const fighterSubclassFeatures: Record<string, FeatureDefinition> = {
  // --- Battle Master ---
  'battleMaster-combatSuperiority': {
    id: 'battleMaster-combatSuperiority',
    name: 'Combat Superiority',
    source: src(93),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Learn maneuvers fueled by Superiority Dice (d8s). Use only one maneuver per attack. Learn more maneuvers at Fighter levels 7, 10, and 15, replacing any known maneuver each time.',
    resourceId: 'superiorityDice',
    choices: ['battleMaster-maneuvers-choice'],
  },
  'battleMaster-studentOfWar': {
    id: 'battleMaster-studentOfWar',
    name: 'Student of War',
    source: src(93),
    minimumLevel: 3,
    activation: 'passive',
    summary: "Gain proficiency with one kind of Artisan's Tools and one skill from the Fighter level 1 skill list.",
  },
  'battleMaster-knowYourEnemy': {
    id: 'battleMaster-knowYourEnemy',
    name: 'Know Your Enemy',
    source: src(94),
    minimumLevel: 7,
    activation: 'bonusAction',
    summary: 'Learn a creature\'s Immunities, Resistances, or Vulnerabilities. Once per Long Rest, or restore a use by spending a Superiority Die. Also grants a 5th Superiority Die.',
    resourceId: 'superiorityDice',
  },
  'battleMaster-improvedCombatSuperiority': {
    id: 'battleMaster-improvedCombatSuperiority',
    name: 'Improved Combat Superiority',
    source: src(94),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'Your Superiority Die becomes a d10.',
  },
  'battleMaster-relentless': {
    id: 'battleMaster-relentless',
    name: 'Relentless',
    source: src(94),
    minimumLevel: 15,
    activation: 'passive',
    summary: 'Once per turn when you use a maneuver, you can roll 1d8 instead of expending a Superiority Die. Also grants a 6th Superiority Die.',
  },
  'battleMaster-ultimateCombatSuperiority': {
    id: 'battleMaster-ultimateCombatSuperiority',
    name: 'Ultimate Combat Superiority',
    source: src(94),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'Your Superiority Die becomes a d12.',
  },

  // --- Champion ---
  'champion-improvedCritical': {
    id: 'champion-improvedCritical',
    name: 'Improved Critical',
    source: src(96),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Your weapon and Unarmed Strike attack rolls score a Critical Hit on a roll of 19 or 20.',
  },
  'champion-remarkableAthlete': {
    id: 'champion-remarkableAthlete',
    name: 'Remarkable Athlete',
    source: src(96),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Advantage on Initiative rolls and Strength (Athletics) checks. After a Critical Hit, move up to half your Speed without provoking Opportunity Attacks.',
  },
  'champion-additionalFightingStyle': {
    id: 'champion-additionalFightingStyle',
    name: 'Additional Fighting Style',
    source: src(96),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'Gain another Fighting Style feat of your choice.',
    choices: ['champion-additionalFightingStyle-choice'],
  },
  'champion-heroicWarrior': {
    id: 'champion-heroicWarrior',
    name: 'Heroic Warrior',
    source: src(96),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'During combat, give yourself Heroic Inspiration whenever you start your turn without it.',
  },
  'champion-superiorCritical': {
    id: 'champion-superiorCritical',
    name: 'Superior Critical',
    source: src(96),
    minimumLevel: 15,
    activation: 'passive',
    summary: 'Your weapon and Unarmed Strike attack rolls score a Critical Hit on a roll of 18-20.',
  },
  'champion-survivor': {
    id: 'champion-survivor',
    name: 'Survivor',
    source: src(96),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'Defy Death: Advantage on Death Saving Throws, and rolling 18-20 counts as a 20. Heroic Rally: regain 5 + Constitution modifier HP at the start of each turn while Bloodied with at least 1 HP.',
  },

  // --- Eldritch Knight ---
  'eldritchKnight-spellcasting': {
    id: 'eldritchKnight-spellcasting',
    name: 'Spellcasting',
    source: src(97),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Cast Wizard spells using Intelligence. Know 2 Wizard cantrips (3 at level 10). Prepare a growing list of level 1+ Wizard spells; replace one on each Fighter level gained.',
  },
  'eldritchKnight-warBond': {
    id: 'eldritchKnight-warBond',
    name: 'War Bond',
    source: src(97),
    minimumLevel: 3,
    activation: 'special',
    summary: 'Ritual-bond up to two weapons to yourself; you can\'t be disarmed of a bonded weapon (barring Incapacitated), and can summon one to your hand as a Bonus Action.',
  },
  'eldritchKnight-warMagic': {
    id: 'eldritchKnight-warMagic',
    name: 'War Magic',
    source: src(97),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'When you take the Attack action, replace one attack with a casting of one of your Wizard cantrips that has a casting time of an action.',
    modifiesRuleIds: ['attack-action-count'],
  },
  'eldritchKnight-eldritchStrike': {
    id: 'eldritchKnight-eldritchStrike',
    name: 'Eldritch Strike',
    source: src(97),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'On a weapon hit, the target has Disadvantage on its next save against a spell you cast before the end of your next turn.',
  },
  'eldritchKnight-arcaneCharge': {
    id: 'eldritchKnight-arcaneCharge',
    name: 'Arcane Charge',
    source: src(97),
    minimumLevel: 15,
    activation: 'passive',
    summary: 'When you use Action Surge, teleport up to 30 feet to an unoccupied space you can see, before or after the additional action.',
  },
  'eldritchKnight-improvedWarMagic': {
    id: 'eldritchKnight-improvedWarMagic',
    name: 'Improved War Magic',
    source: src(97),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'When you take the Attack action, replace two attacks with a casting of one of your level 1-2 Wizard spells that has a casting time of an action.',
    modifiesRuleIds: ['attack-action-count'],
  },

  // --- Psi Warrior ---
  'psiWarrior-psionicPower': {
    id: 'psiWarrior-psionicPower',
    name: 'Psionic Power',
    source: src(97),
    minimumLevel: 3,
    activation: 'special',
    summary: 'Gain Psionic Energy Dice (d6, 4 dice at level 3; d8/6 at level 5; d8/8 at level 9; d10/8 at level 11; d10/10 at level 13; d12/12 at level 17). Fuels Protective Field (Reaction), Psionic Strike (once/turn on a weapon hit), and Telekinetic Movement (Magic action). Regain 1 on Short Rest, all on Long Rest.',
    resourceId: 'psionicEnergyDice',
  },
  'psiWarrior-telekineticAdept': {
    id: 'psiWarrior-telekineticAdept',
    name: 'Telekinetic Adept',
    source: src(98),
    minimumLevel: 7,
    activation: 'special',
    summary: 'Psi-Powered Leap (Bonus Action: Fly Speed = 2x Speed until end of turn, once between rests unless you spend a Psionic Energy Die). Telekinetic Thrust (on a Psionic Strike hit, force a Strength save or Prone/push 10 ft).',
    resourceId: 'psionicEnergyDice',
  },
  'psiWarrior-guardedMind': {
    id: 'psiWarrior-guardedMind',
    name: 'Guarded Mind',
    source: src(98),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'Resistance to Psychic damage. Can expend a Psionic Energy Die (no action) to end Charmed/Frightened on yourself at the start of your turn.',
    resourceId: 'psionicEnergyDice',
  },
  'psiWarrior-bulwarkOfForce': {
    id: 'psiWarrior-bulwarkOfForce',
    name: 'Bulwark of Force',
    source: src(98),
    minimumLevel: 15,
    activation: 'bonusAction',
    summary: 'Grant Half Cover for 1 minute to a number of creatures (including yourself) within 30 feet equal to your Intelligence modifier (min 1). Once per Long Rest unless you spend a Psionic Energy Die.',
    resourceId: 'psionicEnergyDice',
  },
  'psiWarrior-telekineticMaster': {
    id: 'psiWarrior-telekineticMaster',
    name: 'Telekinetic Master',
    source: src(98),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'Always have Telekinesis prepared (Intelligence, no slot/components). While concentrating on it, make one weapon attack as a Bonus Action each turn. Once per Long Rest unless you spend a Psionic Energy Die.',
    resourceId: 'psionicEnergyDice',
  },
}
