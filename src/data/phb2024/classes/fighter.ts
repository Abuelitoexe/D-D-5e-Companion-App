import type { ChoiceDefinition, ChoiceOptionDefinition, ClassDefinition, FeatureDefinition, ResourceDefinition } from '../../../domain/types'
import { FIGHTING_STYLE_FEAT_IDS, GENERAL_FEAT_IDS } from '../feats'
import { weapons } from '../equipment'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.90-92, "Fighter" — Core Fighter Traits + Fighter Features table (p.91, re-verified in raw extraction mode).
export const fighterClass: ClassDefinition = {
  id: 'fighter',
  name: 'Fighter',
  source: src(90),
  primaryAbilities: ['Strength', 'Dexterity'],
  hitDie: 10,
  subclassLevel: 3,
  featuresByLevel: {
    1: ['fighter-fighting-style', 'fighter-second-wind', 'fighter-weapon-mastery'],
    2: ['fighter-action-surge', 'fighter-tactical-mind'],
    3: [],
    4: ['fighter-asi'],
    5: ['fighter-extra-attack', 'fighter-tactical-shift'],
    6: ['fighter-asi'],
    7: [],
    8: ['fighter-asi'],
    9: ['fighter-indomitable', 'fighter-tactical-master'],
    10: [],
    11: ['fighter-two-extra-attacks'],
    12: ['fighter-asi'],
    13: ['fighter-studied-attacks'],
    14: ['fighter-asi'],
    15: [],
    16: ['fighter-asi'],
    17: [],
    18: [],
    19: ['fighter-epic-boon'],
    20: ['fighter-three-extra-attacks'],
  },
  resources: ['secondWind', 'actionSurge', 'indomitable'],
  choiceIds: ['fighter-fighting-style-choice', 'fighter-weapon-mastery-choice', 'fighter-asi-choice'],
}

// Second Wind uses / Weapon Mastery weapon-kind count per the Fighter Features
// table (p.91): 2/3 at level 1, 3/4 at level 4, 4/5 at level 10, (Weapon
// Mastery only) 6 at level 16. Action Surge: 1 use at level 2, 2 at level 17.
// Indomitable: 1 use at level 9, 2 at level 13, 3 at level 17.
export const fighterResources: Record<string, ResourceDefinition> = {
  secondWind: {
    id: 'secondWind',
    name: 'Second Wind',
    minimumLevel: 1,
    maximum: { kind: 'levelTable', table: { 1: 2, 4: 3, 10: 4 } },
    refresh: { default: ['shortRest', 'longRest'] },
    partialRefresh: { shortRest: { kind: 'flat', value: 1 } },
    source: src(91),
  },
  actionSurge: {
    id: 'actionSurge',
    name: 'Action Surge',
    minimumLevel: 2,
    maximum: { kind: 'levelTable', table: { 2: 1, 17: 2 } },
    refresh: { default: ['shortRest', 'longRest'] },
    source: src(91),
  },
  indomitable: {
    id: 'indomitable',
    name: 'Indomitable',
    minimumLevel: 9,
    maximum: { kind: 'levelTable', table: { 9: 1, 13: 2, 17: 3 } },
    refresh: { default: ['longRest'] },
    source: src(91),
  },
}

const weaponMasteryOptions: ChoiceOptionDefinition[] = Object.values(weapons).map((weapon) => ({
  id: `weapon-mastery-${weapon.id}`,
  label: weapon.name,
  source: weapon.source,
}))

export const fighterChoices: Record<string, ChoiceDefinition> = {
  'fighter-fighting-style-choice': {
    id: 'fighter-fighting-style-choice',
    label: 'Fighting Style',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['characterCreation', 'onLevelUp'],
    optionIds: FIGHTING_STYLE_FEAT_IDS,
    replacementPolicies: [{ timing: 'onLevelUp', maxReplacements: 'unlimited' }],
    source: src(91),
  },
  'fighter-weapon-mastery-choice': {
    id: 'fighter-weapon-mastery-choice',
    label: 'Weapon Mastery',
    mode: 'multiple',
    minimumSelections: { kind: 'levelTable', table: { 1: 3, 4: 4, 10: 5, 16: 6 } },
    maximumSelections: { kind: 'levelTable', table: { 1: 3, 4: 4, 10: 5, 16: 6 } },
    required: true,
    timing: ['characterCreation', 'onLongRest'],
    optionIds: weaponMasteryOptions.map((o) => o.id),
    replacementPolicies: [{ timing: 'onLongRest', maxReplacements: 'unlimited' }],
    source: src(91),
  },
  'fighter-asi-choice': {
    id: 'fighter-asi-choice',
    label: 'Ability Score Improvement or Feat',
    mode: 'multiple',
    // Fighter gets this pick 6 times (levels 4, 6, 8, 12, 14, 16), so the
    // choice is modeled as a growing count of independent picks rather than
    // a single selection — the 'abilityScoreImprovement' option is
    // repeatable, so selections can include it more than once.
    minimumSelections: { kind: 'levelTable', table: { 4: 1, 6: 2, 8: 3, 12: 4, 14: 5, 16: 6 } },
    maximumSelections: { kind: 'levelTable', table: { 4: 1, 6: 2, 8: 3, 12: 4, 14: 5, 16: 6 } },
    required: true,
    timing: ['onLevelUp'],
    optionIds: GENERAL_FEAT_IDS,
    source: src(92),
  },
}

export const fighterChoiceOptions: Record<string, ChoiceOptionDefinition> = Object.fromEntries(
  weaponMasteryOptions.map((o) => [o.id, o]),
)

export const fighterFeatures: Record<string, FeatureDefinition> = {
  'fighter-fighting-style': {
    id: 'fighter-fighting-style',
    name: 'Fighting Style',
    source: src(91),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'You gain a Fighting Style feat of your choice. Replaceable whenever you gain a Fighter level.',
    choices: ['fighter-fighting-style-choice'],
  },
  'fighter-second-wind': {
    id: 'fighter-second-wind',
    name: 'Second Wind',
    source: src(91),
    minimumLevel: 1,
    activation: 'bonusAction',
    summary: 'Regain 1d10 + Fighter level Hit Points.',
    resourceId: 'secondWind',
  },
  'fighter-weapon-mastery': {
    id: 'fighter-weapon-mastery',
    name: 'Weapon Mastery',
    source: src(91),
    minimumLevel: 1,
    activation: 'passive',
    summary: 'Use the mastery properties of your chosen weapon kinds. Change one choice whenever you finish a Long Rest.',
    choices: ['fighter-weapon-mastery-choice'],
  },
  'fighter-action-surge': {
    id: 'fighter-action-surge',
    name: 'Action Surge',
    source: src(91),
    minimumLevel: 2,
    activation: 'special',
    summary: 'Take one additional action on your turn, except the Magic action.',
    resourceId: 'actionSurge',
  },
  'fighter-tactical-mind': {
    id: 'fighter-tactical-mind',
    name: 'Tactical Mind',
    source: src(91),
    minimumLevel: 2,
    activation: 'special',
    summary: 'When you fail an ability check, expend a Second Wind use to roll 1d10 and add it to the check. Not expended if it still fails.',
    resourceId: 'secondWind',
  },
  'fighter-asi': {
    id: 'fighter-asi',
    name: 'Ability Score Improvement',
    source: src(92),
    activation: 'passive',
    summary: 'Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. Granted again at Fighter levels 4, 6, 8, 12, 14, and 16.',
    choices: ['fighter-asi-choice'],
  },
  'fighter-extra-attack': {
    id: 'fighter-extra-attack',
    name: 'Extra Attack',
    source: src(92),
    minimumLevel: 5,
    activation: 'passive',
    summary: 'Attack twice, instead of once, whenever you take the Attack action on your turn.',
    modifiesRuleIds: ['attack-action-count'],
  },
  'fighter-tactical-shift': {
    id: 'fighter-tactical-shift',
    name: 'Tactical Shift',
    source: src(92),
    minimumLevel: 5,
    activation: 'passive',
    summary: 'Whenever you activate Second Wind with a Bonus Action, move up to half your Speed without provoking Opportunity Attacks.',
  },
  'fighter-indomitable': {
    id: 'fighter-indomitable',
    name: 'Indomitable',
    source: src(92),
    minimumLevel: 9,
    activation: 'reaction',
    summary: 'If you fail a saving throw, reroll it with a bonus equal to your Fighter level. You must use the new roll.',
    resourceId: 'indomitable',
  },
  'fighter-tactical-master': {
    id: 'fighter-tactical-master',
    name: 'Tactical Master',
    source: src(92),
    minimumLevel: 9,
    activation: 'passive',
    summary: 'When attacking with a weapon whose mastery property you can use, you can replace that property with Push, Sap, or Slow for that attack.',
  },
  'fighter-two-extra-attacks': {
    id: 'fighter-two-extra-attacks',
    name: 'Two Extra Attacks',
    source: src(92),
    minimumLevel: 11,
    activation: 'passive',
    summary: 'Attack three times, instead of once, whenever you take the Attack action on your turn.',
    modifiesRuleIds: ['attack-action-count'],
  },
  'fighter-studied-attacks': {
    id: 'fighter-studied-attacks',
    name: 'Studied Attacks',
    source: src(92),
    minimumLevel: 13,
    activation: 'passive',
    summary: 'If you miss a creature with an attack roll, you have Advantage on your next attack roll against that creature before the end of your next turn.',
  },
  'fighter-epic-boon': {
    id: 'fighter-epic-boon',
    name: 'Epic Boon',
    source: src(92),
    minimumLevel: 19,
    activation: 'passive',
    summary: 'Gain an Epic Boon feat or another feat of your choice for which you qualify. Boon of Combat Prowess is recommended.',
    // Epic Boon feat content isn't populated yet (Phase 5) — flagged rather than guessed.
  },
  'fighter-three-extra-attacks': {
    id: 'fighter-three-extra-attacks',
    name: 'Three Extra Attacks',
    source: src(92),
    minimumLevel: 20,
    activation: 'passive',
    summary: 'Attack four times, instead of once, whenever you take the Attack action on your turn.',
    modifiesRuleIds: ['attack-action-count'],
  },
}
