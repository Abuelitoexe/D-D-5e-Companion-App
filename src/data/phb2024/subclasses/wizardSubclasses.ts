import type { FeatureDefinition, ResourceDefinition, SubclassDefinition } from '../../../domain/types'

const src = (page: number) => ({ sourceId: 'PHB2024' as const, sourceLabel: 'PHB 2024', page })

export const wizardSubclasses: Record<string, SubclassDefinition> = {
  abjurer: {
    id: 'abjurer',
    name: 'Abjurer',
    parentClassId: 'wizard',
    minimumLevel: 3,
    source: src(172),
    featuresByLevel: {
      3: ['abjurer-abjurationSavant', 'abjurer-arcaneWard'],
      6: ['abjurer-projectedWard'],
      10: ['abjurer-spellBreaker'],
      14: ['abjurer-spellResistance'],
    },
    resources: ['arcaneWard'],
  },
  diviner: {
    id: 'diviner',
    name: 'Diviner',
    parentClassId: 'wizard',
    minimumLevel: 3,
    source: src(173),
    featuresByLevel: {
      3: ['diviner-divinationSavant', 'diviner-portent'],
      6: ['diviner-expertDivination'],
      10: ['diviner-thirdEye'],
      14: ['diviner-greaterPortent'],
    },
    resources: ['portent'],
  },
  evoker: {
    id: 'evoker',
    name: 'Evoker',
    parentClassId: 'wizard',
    minimumLevel: 3,
    source: src(174),
    featuresByLevel: {
      3: ['evoker-evocationSavant', 'evoker-potentCantrip'],
      6: ['evoker-sculptSpells'],
      10: ['evoker-empoweredEvocation'],
      14: ['evoker-overchannel'],
    },
  },
  illusionist: {
    id: 'illusionist',
    name: 'Illusionist',
    parentClassId: 'wizard',
    minimumLevel: 3,
    source: src(175),
    featuresByLevel: {
      3: ['illusionist-illusionSavant', 'illusionist-improvedIllusions'],
      6: ['illusionist-phantasmalCreatures'],
      10: ['illusionist-illusorySelf'],
      14: ['illusionist-illusoryReality'],
    },
  },
}

export const wizardSubclassResources: Record<string, ResourceDefinition> = {
  // Arcane Ward's max HP = 2x Wizard level + Int modifier. Its mid-combat
  // regen (from casting Abjuration spells, or a Bonus Action slot spend) is
  // documented in the feature summary but not engine-modeled yet — the
  // resource here tracks the pool size/current HP, matching how Rage's
  // duration mechanics are flagged as needing dedicated engine work later.
  arcaneWard: {
    id: 'arcaneWard',
    name: 'Arcane Ward (HP)',
    minimumLevel: 3,
    maximum: { kind: 'sum', terms: [{ kind: 'derived', base: 'classLevel', multiplier: 2, rounding: 'down' }, { kind: 'abilityModifier', ability: 'Intelligence' }] },
    refresh: { default: ['longRest'] },
    source: src(172),
  },
  portent: {
    id: 'portent',
    name: 'Portent (foretelling rolls)',
    minimumLevel: 3,
    maximum: { kind: 'levelTable', table: { 3: 2, 14: 3 } },
    refresh: { default: ['longRest'] },
    source: src(173),
  },
}

export const wizardSubclassFeatures: Record<string, FeatureDefinition> = {
  // --- Abjurer ---
  'abjurer-abjurationSavant': {
    id: 'abjurer-abjurationSavant',
    name: 'Abjuration Savant',
    source: src(172),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Add 2 Abjuration spells (level 2 or lower) to your spellbook for free. Each time you gain a new spell slot level, add another Abjuration spell for free.',
  },
  'abjurer-arcaneWard': {
    id: 'abjurer-arcaneWard',
    name: 'Arcane Ward',
    source: src(172),
    minimumLevel: 3,
    activation: 'special',
    summary: 'Casting an Abjuration spell with a slot creates a ward (HP = 2x Wizard level + Int mod) that absorbs damage to you; regains HP when you cast Abjuration spells or spend a Bonus Action + slot. Recreate once per Long Rest.',
    resourceId: 'arcaneWard',
  },
  'abjurer-projectedWard': {
    id: 'abjurer-projectedWard',
    name: 'Projected Ward',
    source: src(172),
    minimumLevel: 6,
    activation: 'reaction',
    summary: 'When a creature you can see within 30 feet takes damage, your Arcane Ward can absorb it instead.',
    resourceId: 'arcaneWard',
  },
  'abjurer-spellBreaker': {
    id: 'abjurer-spellBreaker',
    name: 'Spell Breaker',
    source: src(172),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'Always have Counterspell and Dispel Magic prepared. Cast Dispel Magic as a Bonus Action, adding your Proficiency Bonus to its ability check. A slot isn\'t expended if either spell fails to stop its target.',
  },
  'abjurer-spellResistance': {
    id: 'abjurer-spellResistance',
    name: 'Spell Resistance',
    source: src(172),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'Advantage on saving throws against spells, and Resistance to spell damage.',
  },

  // --- Diviner ---
  'diviner-divinationSavant': {
    id: 'diviner-divinationSavant',
    name: 'Divination Savant',
    source: src(173),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Add 2 Divination spells (level 2 or lower) to your spellbook for free. Each time you gain a new spell slot level, add another Divination spell for free.',
  },
  'diviner-portent': {
    id: 'diviner-portent',
    name: 'Portent',
    source: src(173),
    minimumLevel: 3,
    activation: 'special',
    summary: 'On finishing a Long Rest, roll 2d20 and record them. Replace any D20 Test (yours or one you can see) with a recorded roll, once per turn, before the roll is made.',
    resourceId: 'portent',
  },
  'diviner-expertDivination': {
    id: 'diviner-expertDivination',
    name: 'Expert Divination',
    source: src(173),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Casting a Divination spell with a level 2+ slot regains one expended slot of a lower level (max level 5).',
  },
  'diviner-thirdEye': {
    id: 'diviner-thirdEye',
    name: 'The Third Eye',
    source: src(173),
    minimumLevel: 10,
    activation: 'bonusAction',
    summary: 'Gain Darkvision 120 ft, read any language, or cast See Invisibility without a slot — lasts until you start a Short/Long Rest. Once per Short/Long Rest.',
  },
  'diviner-greaterPortent': {
    id: 'diviner-greaterPortent',
    name: 'Greater Portent',
    source: src(173),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'Roll three d20s for Portent instead of two.',
  },

  // --- Evoker ---
  'evoker-evocationSavant': {
    id: 'evoker-evocationSavant',
    name: 'Evocation Savant',
    source: src(174),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Add 2 Evocation spells (level 2 or lower) to your spellbook for free. Each time you gain a new spell slot level, add another Evocation spell for free.',
  },
  'evoker-potentCantrip': {
    id: 'evoker-potentCantrip',
    name: 'Potent Cantrip',
    source: src(174),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'A creature that avoids your damaging cantrip (miss or successful save) still takes half damage, but suffers no other effect.',
  },
  'evoker-sculptSpells': {
    id: 'evoker-sculptSpells',
    name: 'Sculpt Spells',
    source: src(174),
    minimumLevel: 6,
    activation: 'passive',
    summary: 'Choose 1 + the spell\'s level creatures when casting an Evocation spell affecting an area; they automatically succeed their save and take no damage on a successful-save-halves effect.',
  },
  'evoker-empoweredEvocation': {
    id: 'evoker-empoweredEvocation',
    name: 'Empowered Evocation',
    source: src(174),
    minimumLevel: 10,
    activation: 'passive',
    summary: 'Add your Intelligence modifier to one damage roll of any Evocation spell you cast.',
  },
  'evoker-overchannel': {
    id: 'evoker-overchannel',
    name: 'Overchannel',
    source: src(174),
    minimumLevel: 14,
    activation: 'special',
    summary: 'Deal maximum damage with a level 1-5 damaging spell you cast. First use per Long Rest is free; further uses before a Long Rest deal 2d12 (+1d12 per further use) Necrotic damage to you per spell slot level, ignoring Resistance/Immunity.',
  },

  // --- Illusionist ---
  'illusionist-illusionSavant': {
    id: 'illusionist-illusionSavant',
    name: 'Illusion Savant',
    source: src(175),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Add 2 Illusion spells (level 2 or lower) to your spellbook for free. Each time you gain a new spell slot level, add another Illusion spell for free.',
  },
  'illusionist-improvedIllusions': {
    id: 'illusionist-improvedIllusions',
    name: 'Improved Illusions',
    source: src(175),
    minimumLevel: 3,
    activation: 'passive',
    summary: 'Cast Illusion spells without Verbal components; their 10+ foot range increases by 60 feet. Know Minor Illusion (doesn\'t count against cantrips known), usable as a Bonus Action with both a sound and an image at once.',
  },
  'illusionist-phantasmalCreatures': {
    id: 'illusionist-phantasmalCreatures',
    name: 'Phantasmal Creatures',
    source: src(175),
    minimumLevel: 6,
    activation: 'passive',
    // Summon Beast / Summon Fey aren't in the spell registry yet (outside
    // the Phase 2 spell subset) — described here, not mechanically wired.
    summary: 'Always have Summon Beast and Summon Fey prepared; cast either as its Illusion version without a slot (creature has half HP) once per Long Rest, appearing spectral.',
  },
  'illusionist-illusorySelf': {
    id: 'illusionist-illusorySelf',
    name: 'Illusory Self',
    source: src(175),
    minimumLevel: 10,
    activation: 'reaction',
    summary: 'When hit by an attack, interpose an illusory duplicate so the attack automatically misses. Once per Short/Long Rest, or restore by expending a level 2+ slot.',
  },
  'illusionist-illusoryReality': {
    id: 'illusionist-illusoryReality',
    name: 'Illusory Reality',
    source: src(175),
    minimumLevel: 14,
    activation: 'passive',
    summary: 'When casting an Illusion spell with a slot, make one inanimate, nonmagical object within it real for 1 minute (no damage or conditions).',
  },
}
