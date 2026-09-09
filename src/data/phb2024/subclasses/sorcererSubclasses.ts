import type { ChoiceDefinition, ChoiceOptionDefinition, FeatureDefinition, ResourceDefinition, SubclassDefinition } from '../../../domain/types'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

// PHB 2024 p.144-151 — all 4 Sorcerer subclasses, extracted via pdftotext -raw.
export const sorcererSubclasses: Record<string, SubclassDefinition> = {
  aberrantSorcery: {
    id: 'aberrantSorcery',
    name: 'Aberrant Sorcery',
    parentClassId: 'sorcerer',
    minimumLevel: 3,
    source: src(144),
    featuresByLevel: {
      3: ['aberrant-psionic-spells', 'aberrant-telepathic-speech'],
      6: ['aberrant-psionic-sorcery', 'aberrant-psychic-defenses'],
      14: ['aberrant-revelation-in-flesh'],
      18: ['aberrant-warping-implosion'],
    },
    resources: ['aberrantWarpingImplosion'],
  },
  clockworkSorcery: {
    id: 'clockworkSorcery',
    name: 'Clockwork Sorcery',
    parentClassId: 'sorcerer',
    minimumLevel: 3,
    source: src(145),
    featuresByLevel: {
      3: ['clockwork-spells', 'clockwork-restore-balance'],
      6: ['clockwork-bastion-of-law'],
      14: ['clockwork-trance-of-order'],
      18: ['clockwork-cavalcade'],
    },
    resources: ['clockworkRestoreBalance', 'clockworkTranceOfOrder', 'clockworkCavalcade'],
  },
  draconicSorcery: {
    id: 'draconicSorcery',
    name: 'Draconic Sorcery',
    parentClassId: 'sorcerer',
    minimumLevel: 3,
    source: src(147),
    featuresByLevel: {
      3: ['draconic-resilience', 'draconic-spells'],
      6: ['draconic-elemental-affinity'],
      14: ['draconic-dragon-wings'],
      18: ['draconic-dragon-companion'],
    },
    choiceIds: ['draconic-elemental-affinity-choice'],
    resources: ['draconicDragonWings'],
  },
  wildMagicSorcery: {
    id: 'wildMagicSorcery',
    name: 'Wild Magic Sorcery',
    parentClassId: 'sorcerer',
    minimumLevel: 3,
    source: src(148),
    featuresByLevel: {
      3: ['wildMagic-surge', 'wildMagic-tides-of-chaos'],
      6: ['wildMagic-bend-luck'],
      14: ['wildMagic-controlled-chaos'],
      18: ['wildMagic-tamed-surge'],
    },
    resources: ['wildMagicTidesOfChaos'],
  },
}

export const sorcererSubclassChoices: Record<string, ChoiceDefinition> = {
  'draconic-elemental-affinity-choice': {
    id: 'draconic-elemental-affinity-choice',
    label: 'Elemental Affinity: choose a damage type',
    mode: 'single',
    minimumSelections: { kind: 'flat', value: 1 },
    maximumSelections: { kind: 'flat', value: 1 },
    required: true,
    timing: ['onLevelUp'],
    optionIds: ['elementalAffinity-acid', 'elementalAffinity-cold', 'elementalAffinity-fire', 'elementalAffinity-lightning', 'elementalAffinity-poison'],
    // No replacementPolicies — permanent once chosen.
    source: src(147),
  },
}

export const sorcererSubclassChoiceOptions: Record<string, ChoiceOptionDefinition> = {
  'elementalAffinity-acid': { id: 'elementalAffinity-acid', label: 'Acid', source: src(147) },
  'elementalAffinity-cold': { id: 'elementalAffinity-cold', label: 'Cold', source: src(147) },
  'elementalAffinity-fire': { id: 'elementalAffinity-fire', label: 'Fire', source: src(147) },
  'elementalAffinity-lightning': { id: 'elementalAffinity-lightning', label: 'Lightning', source: src(147) },
  'elementalAffinity-poison': { id: 'elementalAffinity-poison', label: 'Poison', source: src(147) },
}

export const sorcererSubclassResources: Record<string, ResourceDefinition> = {
  aberrantWarpingImplosion: {
    id: 'aberrantWarpingImplosion',
    name: 'Warping Implosion',
    minimumLevel: 18,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(145),
  },
  clockworkRestoreBalance: {
    id: 'clockworkRestoreBalance',
    name: 'Restore Balance',
    minimumLevel: 3,
    maximum: { kind: 'abilityModifier', ability: 'Charisma', minimum: 1 },
    refresh: { default: ['longRest'] },
    source: src(146),
  },
  clockworkTranceOfOrder: {
    id: 'clockworkTranceOfOrder',
    name: 'Trance of Order',
    minimumLevel: 14,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(146),
  },
  clockworkCavalcade: {
    id: 'clockworkCavalcade',
    name: 'Clockwork Cavalcade',
    minimumLevel: 18,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(146),
  },
  draconicDragonWings: {
    id: 'draconicDragonWings',
    name: 'Dragon Wings',
    minimumLevel: 14,
    maximum: { kind: 'flat', value: 1 },
    refresh: { default: ['longRest'] },
    source: src(148),
  },
  wildMagicTidesOfChaos: {
    id: 'wildMagicTidesOfChaos',
    name: 'Tides of Chaos',
    minimumLevel: 3,
    maximum: { kind: 'flat', value: 1 },
    // Refreshes on a Long Rest, OR the moment you cast a Sorcerer spell with
    // a slot — the latter isn't one of the standard rest triggers, so it's
    // modeled as 'manual' (the player resets it themselves after casting).
    refresh: { default: ['longRest', 'manual'] },
    source: src(148),
  },
}

export const sorcererSubclassFeatures: Record<string, FeatureDefinition> = {
  // ---- Aberrant Sorcery ----
  'aberrant-psionic-spells': {
    id: 'aberrant-psionic-spells',
    name: 'Psionic Spells',
    source: src(144),
    minimumLevel: 3,
    activation: 'passive',
    summary:
      'Always-prepared spells by level: 3 — Arms of Hadar, Calm Emotions, Detect Thoughts, Dissonant Whispers, Mind Sliver; 5 — Hunger of Hadar, Sending; 7 — Evard\'s Black Tentacles, Summon Aberration; 9 — Rary\'s Telepathic Bond, Telekinesis. (Not yet in the spell registry — description only.)',
  },
  'aberrant-telepathic-speech': {
    id: 'aberrant-telepathic-speech',
    name: 'Telepathic Speech',
    source: src(144),
    minimumLevel: 3,
    activation: 'bonusAction',
    summary: 'Open telepathic communication with one creature you can see within 30 ft, lasting minutes equal to your Sorcerer level (ends early if you form a new connection).',
  },
  'aberrant-psionic-sorcery': {
    id: 'aberrant-psionic-sorcery',
    name: 'Psionic Sorcery',
    source: src(145),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Cast a Psionic Spells feature spell by spending Sorcery Points equal to its level instead of a slot; doing so drops Verbal/Somatic components (Material still required if consumed or costly).',
  },
  'aberrant-psychic-defenses': {
    id: 'aberrant-psychic-defenses',
    name: 'Psychic Defenses',
    source: src(145),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Resistance to Psychic damage; Advantage on saves to avoid or end the Charmed or Frightened condition.',
  },
  'aberrant-revelation-in-flesh': {
    id: 'aberrant-revelation-in-flesh',
    name: 'Revelation in Flesh',
    source: src(145),
    minimumLevel: 14,
    activation: 'bonusAction',
    summary: 'Spend 1+ Sorcery Points to alter your body for 10 minutes, gaining one benefit per point spent: Aquatic Adaptation, Glistening Flight, See the Invisible, or Wormlike Movement.',
  },
  'aberrant-warping-implosion': {
    id: 'aberrant-warping-implosion',
    name: 'Warping Implosion',
    source: src(145),
    minimumLevel: 18,
    activation: 'special',
    resourceId: 'aberrantWarpingImplosion',
    summary: 'Teleport up to 120 ft; each creature within 30 ft of your old space makes a Strength save (your spell save DC) or takes 3d10 Force damage and is pulled to your old space (half damage on a success, no pull). Once per Long Rest, though you can restore this use early by spending 5 Sorcery Points.',
  },
  // ---- Clockwork Sorcery ----
  'clockwork-spells': {
    id: 'clockwork-spells',
    name: 'Clockwork Spells',
    source: src(145),
    minimumLevel: 3,
    activation: 'passive',
    summary:
      'Always-prepared spells by level: 3 — Aid, Alarm, Lesser Restoration, Protection from Evil and Good; 5 — Dispel Magic, Protection from Energy; 7 — Freedom of Movement, Summon Construct; 9 — Greater Restoration, Wall of Force. (Not yet in the spell registry — description only.)',
  },
  'clockwork-restore-balance': {
    id: 'clockwork-restore-balance',
    name: 'Restore Balance',
    source: src(145),
    minimumLevel: 3,
    activation: 'reaction',
    resourceId: 'clockworkRestoreBalance',
    summary: 'Prevent a d20 roll (yours or a creature within 60 ft) from being affected by Advantage or Disadvantage. Uses equal to your Charisma modifier (min 1), refilling on a Long Rest.',
  },
  'clockwork-bastion-of-law': {
    id: 'clockwork-bastion-of-law',
    name: 'Bastion of Law',
    source: src(146),
    minimumLevel: 6,
    activation: 'special',
    summary: 'As a Magic action, spend 1-5 Sorcery Points to ward yourself or a creature within 30 ft with that many d8s; the warded creature can roll and spend those dice to reduce incoming damage. Lasts until a Long Rest or until used again.',
  },
  'clockwork-trance-of-order': {
    id: 'clockwork-trance-of-order',
    name: 'Trance of Order',
    source: src(146),
    minimumLevel: 14,
    activation: 'bonusAction',
    resourceId: 'clockworkTranceOfOrder',
    summary: "For 1 minute, attack rolls against you can't have Advantage, and you treat any d20 Test roll of 9 or lower as a 10. Once per Long Rest, though you can restore this use early by spending 5 Sorcery Points.",
  },
  'clockwork-cavalcade': {
    id: 'clockwork-cavalcade',
    name: 'Clockwork Cavalcade',
    source: src(146),
    minimumLevel: 18,
    activation: 'special',
    resourceId: 'clockworkCavalcade',
    summary: 'Summon order-spirits in a 30-ft Cube: heal up to 100 HP split as you choose, repair damaged objects, and end every spell of level 6 or lower on chosen creatures/objects. Once per Long Rest, though you can restore this use early by spending 7 Sorcery Points.',
  },
  // ---- Draconic Sorcery ----
  'draconic-resilience': {
    id: 'draconic-resilience',
    name: 'Draconic Resilience',
    source: src(147),
    minimumLevel: 3,
    activation: 'passive',
    summary:
      'Hit Point maximum +3, plus +1 every Sorcerer level after (not auto-applied by getHitPointMaximum — a known gap; track manually). While unarmored, base AC = 10 + Dexterity modifier + Charisma modifier.',
  },
  'draconic-spells': {
    id: 'draconic-spells',
    name: 'Draconic Spells',
    source: src(147),
    minimumLevel: 3,
    activation: 'passive',
    summary:
      'Always-prepared spells by level: 3 — Alter Self, Chromatic Orb, Command, Dragon\'s Breath; 5 — Fear, Fly; 7 — Arcane Eye, Charm Monster; 9 — Legend Lore, Summon Dragon. (Not yet in the spell registry — description only.)',
  },
  'draconic-elemental-affinity': {
    id: 'draconic-elemental-affinity',
    name: 'Elemental Affinity',
    source: src(147),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Choose Acid, Cold, Fire, Lightning, or Poison: gain Resistance to it, and add your Charisma modifier to one damage roll of a spell you cast that deals that type.',
    choices: ['draconic-elemental-affinity-choice'],
  },
  'draconic-dragon-wings': {
    id: 'draconic-dragon-wings',
    name: 'Dragon Wings',
    source: src(147),
    minimumLevel: 14,
    activation: 'bonusAction',
    resourceId: 'draconicDragonWings',
    summary: 'Sprout wings for a Fly Speed of 60 ft, lasting 1 hour or until dismissed. Once per Long Rest, though you can restore this use early by spending 3 Sorcery Points.',
  },
  'draconic-dragon-companion': {
    id: 'draconic-dragon-companion',
    name: 'Dragon Companion',
    source: src(148),
    minimumLevel: 18,
    activation: 'passive',
    summary: 'Cast Summon Dragon without a Material component, and once per Long Rest without a spell slot (optionally trading Concentration for a fixed 1-minute duration). (Summon Dragon is not yet in the spell registry.)',
  },
  // ---- Wild Magic Sorcery ----
  'wildMagic-surge': {
    id: 'wildMagic-surge',
    name: 'Wild Magic Surge',
    source: src(148),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Once per turn, after casting a Sorcerer spell with a slot, roll a d20; on a 20, roll on the Wild Magic Surge table (PHB p.149-151, d100 — a DM-adjudicated random table, not modeled digitally).',
  },
  'wildMagic-tides-of-chaos': {
    id: 'wildMagic-tides-of-chaos',
    name: 'Tides of Chaos',
    source: src(148),
    minimumLevel: 3,
    activation: 'special',
    resourceId: 'wildMagicTidesOfChaos',
    summary: 'Gain Advantage on one D20 Test. Recovers only once you cast a Sorcerer spell with a slot (which also forces a Wild Magic Surge roll) or finish a Long Rest.',
  },
  'wildMagic-bend-luck': {
    id: 'wildMagic-bend-luck',
    name: 'Bend Luck',
    source: src(148),
    minimumLevel: 6,
    activation: 'reaction',
    summary: "Spend 1 Sorcery Point to roll 1d4 and apply it as a bonus or penalty to another creature's just-rolled d20 Test.",
  },
  'wildMagic-controlled-chaos': {
    id: 'wildMagic-controlled-chaos',
    name: 'Controlled Chaos',
    source: src(148),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'Whenever you roll on the Wild Magic Surge table, roll twice and use either result.',
  },
  'wildMagic-tamed-surge': {
    id: 'wildMagic-tamed-surge',
    name: 'Tamed Surge',
    source: src(149),
    minimumLevel: 18,
    activation: 'special',
    summary: 'After casting a Sorcerer spell with a slot, choose any Wild Magic Surge table effect (except the final row) instead of rolling. Once per Long Rest.',
  },
}
