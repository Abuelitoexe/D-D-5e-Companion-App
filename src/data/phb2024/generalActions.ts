import type { GeneralActionDefinition } from '../../domain/types'

const source = { sourceId: 'PHB2024', sourceLabel: 'PHB 2024', page: 15 } as const

// PHB 2024 p.15, "Actions" table — the baseline every character has,
// before class/subclass features add or modify options.
export const generalActions: Record<string, GeneralActionDefinition> = {
  attack: { id: 'attack', name: 'Attack', activation: 'action', summary: 'Attack with a weapon or an Unarmed Strike.', source },
  dash: { id: 'dash', name: 'Dash', activation: 'action', summary: 'For the rest of the turn, gain extra movement equal to your Speed.', source },
  disengage: { id: 'disengage', name: 'Disengage', activation: 'action', summary: 'Your movement doesn\'t provoke Opportunity Attacks for the rest of the turn.', source },
  dodge: { id: 'dodge', name: 'Dodge', activation: 'action', summary: 'Until the start of your next turn, attack rolls against you have Disadvantage and you make Dexterity saves with Advantage (unless Incapacitated or Speed 0).', source },
  help: { id: 'help', name: 'Help', activation: 'action', summary: 'Help another creature\'s ability check or attack roll, or administer first aid.', source },
  hide: { id: 'hide', name: 'Hide', activation: 'action', summary: 'Make a Dexterity (Stealth) check to hide.', source },
  influence: { id: 'influence', name: 'Influence', activation: 'action', summary: 'Make a Charisma (Deception, Intimidation, Performance, or Persuasion) or Wisdom (Animal Handling) check to alter a creature\'s attitude.', source },
  magic: { id: 'magic', name: 'Magic', activation: 'action', summary: 'Cast a spell, use a magic item, or use a magical feature.', source },
  ready: { id: 'ready', name: 'Ready', activation: 'action', summary: 'Prepare to take an action in response to a trigger you define.', source },
  search: { id: 'search', name: 'Search', activation: 'action', summary: 'Make a Wisdom (Insight, Medicine, Perception, or Survival) check.', source },
  study: { id: 'study', name: 'Study', activation: 'action', summary: 'Make an Intelligence (Arcana, History, Investigation, Nature, or Religion) check.', source },
  utilize: { id: 'utilize', name: 'Utilize', activation: 'action', summary: 'Use a nonmagical object.', source },
}
