import type { ChoiceDefinition, ChoiceOptionDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition } from '../../../domain/types'
import { weapons } from '../equipment'
import { GENERAL_FEAT_IDS } from '../feats'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.50-52 — Core Barbarian Traits + Barbarian Features table,
// verified via pdftotext -table mode for the table and -raw for prose.
export const barbarianClass: ClassDefinition = {
  id: 'barbarian',
  name: 'Barbarian',
  source: src(50),
  primaryAbilities: ['Strength'],
  hitDie: 12,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['barbarian-rage', 'barbarian-unarmored-defense', 'barbarian-weapon-mastery'],
    2: ['barbarian-danger-sense', 'barbarian-reckless-attack'],
    3: ['barbarian-primal-knowledge'],
    4: ['barbarian-asi'],
    5: ['barbarian-extra-attack', 'barbarian-fast-movement'],
    6: [],
    7: ['barbarian-feral-instinct', 'barbarian-instinctive-pounce'],
    8: ['barbarian-asi'],
    9: ['barbarian-brutal-strike'],
    10: [],
    11: ['barbarian-relentless-rage'],
    12: ['barbarian-asi'],
    13: ['barbarian-improved-brutal-strike'],
    14: [],
    15: ['barbarian-persistent-rage'],
    16: ['barbarian-asi'],
    17: ['barbarian-improved-brutal-strike-2'],
    18: ['barbarian-indomitable-might'],
    19: ['barbarian-epic-boon'],
    20: ['barbarian-primal-champion'],
  },
  resources: ['rages'],
  choiceIds: ['barbarian-weapon-mastery-choice', 'barbarian-primal-knowledge-choice', 'barbarian-asi-choice'],
}

const weaponMasteryOptions: ChoiceOptionDefinition[] = Object.values(weapons).map((weapon) => ({
  id: `weapon-mastery-${weapon.id}`,
  label: weapon.name,
  source: weapon.source,
}))

const PRIMAL_KNOWLEDGE_SKILLS = ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival']
const skillOptionId = (skill: string) => `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`

export const barbarianChoices: Record<string, ChoiceDefinition> = {
  'barbarian-weapon-mastery-choice': {
    id: 'barbarian-weapon-mastery-choice',
    label: 'Weapon Mastery',
    mode: 'multiple',
    // 2 kinds at level 1, 3 at level 4, 4 at level 10 — Barbarian's own
    // growth curve, same mechanic as Fighter (3 flat) and Rogue (2 flat).
    minimumSelections: { kind: 'levelTable', table: { 1: 2, 4: 3, 10: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 1: 2, 4: 3, 10: 4 } },
    required: true,
    timing: ['characterCreation', 'onLongRest'],
    optionIds: weaponMasteryOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onLongRest', maxReplacements: 'unlimited' }],
    source: src(51),
  },
  'barbarian-primal-knowledge-choice': {
    id: 'barbarian-primal-knowledge-choice',
    label: 'Primal Knowledge: choose a skill proficiency',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['onLevelUp'],
    optionIds: PRIMAL_KNOWLEDGE_SKILLS.map(skillOptionId),
    // No replacementPolicies — permanent once chosen.
    source: src(51),
  },
  'barbarian-asi-choice': {
    id: 'barbarian-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 8: 2, 12: 3, 16: 4 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(52),
  },
}

export const barbarianChoiceOptions: Record<string, ChoiceOptionDefinition> = Object.fromEntries(
  weaponMasteryOptions.map((o) => [o.id, o]),
)

export const barbarianResources: Record<string, ResourceDefinition> = {
  rages: {
    id: 'rages',
    name: 'Rage',
    minimumLevel: 1,
    // Sparse level table: 2 uses at 1, 3 at 3, 4 at 6, 5 at 12, 6 at 17.
    maximum: { kind: 'levelTable', table: { 1: 2, 3: 3, 6: 4, 12: 5, 17: 6 } },
    // Short Rest returns exactly 1 use; Long Rest fully refills.
    refresh: { default: ['shortRest', 'longRest'] },
    partialRefresh: { shortRest: { kind: 'flat', value: 1 } },
    source: src(51),
  },
}

export const barbarianFeatures: Record<string, FeatureDefinition> = {
  'barbarian-rage': {
    id: 'barbarian-rage',
    name: 'Rage',
    source: src(51),
    minimumLevel: 1,
    activation: 'bonusAction',
    resourceId: 'rages',
    summary:
      "Enter a Rage (can't while wearing Heavy armor): Resistance to Bludgeoning/Piercing/Slashing damage, Advantage on Strength checks/saves, a Strength-weapon/Unarmed-Strike damage bonus that scales with level (+2 at 1, +3 at 9, +4 at 16 — see Rage Damage column), and you can't maintain Concentration or cast spells. Lasts until the end of your next turn; extend by attacking, forcing a save, or spending a Bonus Action, up to 10 minutes total. Ends early if you don Heavy armor or become Incapacitated. Regain 1 use per Short Rest, all uses per Long Rest.",
  },
  'barbarian-unarmored-defense': {
    id: 'barbarian-unarmored-defense',
    name: 'Unarmored Defense',
    source: src(51),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'While wearing no armor, AC = 10 + Dexterity modifier + Constitution modifier. A Shield can still be used.',
  },
  'barbarian-weapon-mastery': {
    id: 'barbarian-weapon-mastery',
    name: 'Weapon Mastery',
    source: src(51),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Use the mastery properties of 2 kinds of Simple or Martial Melee weapons you choose. Change your choices whenever you finish a Long Rest.',
    choices: ['barbarian-weapon-mastery-choice'],
  },
  'barbarian-danger-sense': {
    id: 'barbarian-danger-sense',
    name: 'Danger Sense',
    source: src(51),
    minimumLevel: 2,
    activation: 'passive',
    summary: 'Advantage on Dexterity saving throws, unless you have the Incapacitated condition.',
  },
  'barbarian-reckless-attack': {
    id: 'barbarian-reckless-attack',
    name: 'Reckless Attack',
    source: src(51),
    minimumLevel: 2,
    activation: 'special',
    summary: "On your first attack roll of the turn, you can attack recklessly: Advantage on Strength-based attack rolls until the start of your next turn, but attack rolls against you have Advantage during that time too.",
  },
  'barbarian-primal-knowledge': {
    id: 'barbarian-primal-knowledge',
    name: 'Primal Knowledge',
    source: src(51),
    minimumLevel: 3,
    activation: 'passive',
    summary:
      'Gain proficiency in another skill from the Barbarian level 1 skill list. While your Rage is active, you can make an Acrobatics, Intimidation, Perception, Stealth, or Survival check as a Strength check instead of its normal ability.',
    choices: ['barbarian-primal-knowledge-choice'],
  },
  'barbarian-asi': {
    id: 'barbarian-asi',
    name: 'Ability Score Improvement',
    source: src(52),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Barbarian levels 8, 12, and 16.',
    choices: ['barbarian-asi-choice'],
  },
  'barbarian-extra-attack': {
    id: 'barbarian-extra-attack',
    name: 'Extra Attack',
    source: src(52),
    minimumLevel: 5,
    activation: 'passive',
    summary: 'Attack twice, instead of once, whenever you take the Attack action on your turn.',
  },
  'barbarian-fast-movement': {
    id: 'barbarian-fast-movement',
    name: 'Fast Movement',
    source: src(52),
    minimumLevel: 5,
    activation: 'passive',
    summary: 'Your Speed increases by 10 feet while you aren\'t wearing Heavy armor.',
  },
  'barbarian-feral-instinct': {
    id: 'barbarian-feral-instinct',
    name: 'Feral Instinct',
    source: src(52),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'Advantage on Initiative rolls.',
  },
  'barbarian-instinctive-pounce': {
    id: 'barbarian-instinctive-pounce',
    name: 'Instinctive Pounce',
    source: src(52),
    minimumLevel: 7,
    activation: 'passive',
    summary: 'As part of the Bonus Action you take to enter your Rage, you can move up to half your Speed.',
  },
  'barbarian-brutal-strike': {
    id: 'barbarian-brutal-strike',
    name: 'Brutal Strike',
    source: src(52),
    minimumLevel: 9,
    activation: 'special',
    summary:
      "If you use Reckless Attack, you can forgo its Advantage on one Strength-based attack roll (that isn't already at Disadvantage) to deal an extra 1d10 damage on a hit, plus one effect of your choice: Forceful Blow (push 15 ft, then move up to half Speed toward it) or Hamstring Blow (target's Speed -15 ft until your next turn).",
  },
  'barbarian-relentless-rage': {
    id: 'barbarian-relentless-rage',
    name: 'Relentless Rage',
    source: src(52),
    minimumLevel: 11,
    activation: 'passive',
    summary:
      "If you drop to 0 HP while your Rage is active and don't die outright, make a DC 10 Constitution save to instead drop to HP equal to twice your Barbarian level. The DC rises by 5 each further use since your last rest, resetting to 10 on a Short or Long Rest.",
  },
  'barbarian-improved-brutal-strike': {
    id: 'barbarian-improved-brutal-strike',
    name: 'Improved Brutal Strike',
    source: src(52),
    minimumLevel: 13,
    activation: 'passive',
    summary: 'Brutal Strike gains two more effect options: Staggering Blow (Disadvantage on its next save, no Opportunity Attacks until your next turn) and Sundering Blow (+5 to the next attack roll another creature makes against it before your next turn).',
  },
  'barbarian-persistent-rage': {
    id: 'barbarian-persistent-rage',
    name: 'Persistent Rage',
    source: src(52),
    minimumLevel: 15,
    activation: 'passive',
    summary:
      "When you roll Initiative, you can regain all expended Rage uses (once per Long Rest). Your Rage now lasts a full 10 minutes without needing to be extended each round, ending early only on the Unconscious condition or donning Heavy armor.",
  },
  'barbarian-improved-brutal-strike-2': {
    id: 'barbarian-improved-brutal-strike-2',
    name: 'Improved Brutal Strike (2d10)',
    source: src(52),
    minimumLevel: 17,
    activation: 'passive',
    summary: "Brutal Strike's extra damage increases to 2d10, and you can apply two different Brutal Strike effects on the same use.",
  },
  'barbarian-indomitable-might': {
    id: 'barbarian-indomitable-might',
    name: 'Indomitable Might',
    source: src(52),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'If your total for a Strength check or save is less than your Strength score, use that score in place of the total.',
  },
  'barbarian-epic-boon': {
    id: 'barbarian-epic-boon',
    name: 'Epic Boon',
    source: src(52),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Irresistible Offense is recommended.',
  },
  'barbarian-primal-champion': {
    id: 'barbarian-primal-champion',
    name: 'Primal Champion',
    source: src(52),
    minimumLevel: 20,
    activation: 'passive',
    summary: 'Your Strength and Constitution scores each increase by 4, to a maximum of 25.',
  },
}
