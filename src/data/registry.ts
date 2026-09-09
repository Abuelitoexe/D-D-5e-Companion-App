import type {
  ArmorDefinition,
  BackgroundDefinition,
  ChoiceDefinition,
  ChoiceOptionDefinition,
  ClassDefinition,
  ClassGuidance,
  ConditionalModifierDefinition,
  DurationRule,
  EquipmentPackOption,
  FeatDefinition,
  FeatureDefinition,
  GeneralActionDefinition,
  ResourceDefinition,
  SourceId,
  SourceRef,
  SpeciesDefinition,
  SpellDefinition,
  SubclassDefinition,
  WeaponDefinition,
  WeaponMasteryPropertyDefinition,
} from '../domain/types'

/**
 * The single aggregation point every content source (PHB2024 today;
 * Ravenloft/Heroes of Faerûn later) registers into. Screens and the rule
 * engine only ever read from a RulesRegistry — never from a source-specific
 * module directly — so adding a new source is purely a data change.
 */
export interface RulesRegistry {
  classes: Record<string, ClassDefinition>
  subclasses: Record<string, SubclassDefinition>
  features: Record<string, FeatureDefinition>
  resources: Record<string, ResourceDefinition>
  durationRules: Record<string, DurationRule>
  conditionalModifiers: Record<string, ConditionalModifierDefinition>
  choices: Record<string, ChoiceDefinition>
  choiceOptions: Record<string, ChoiceOptionDefinition>
  backgrounds: Record<string, BackgroundDefinition>
  species: Record<string, SpeciesDefinition>
  feats: Record<string, FeatDefinition>
  spells: Record<string, SpellDefinition>
  generalActions: Record<string, GeneralActionDefinition>
  guidance: Record<string, ClassGuidance>
  weapons: Record<string, WeaponDefinition>
  armor: Record<string, ArmorDefinition>
  weaponMasteryProperties: Record<string, WeaponMasteryPropertyDefinition>
  equipmentPacks: Record<string, EquipmentPackOption>
}

export function createEmptyRegistry(): RulesRegistry {
  return {
    classes: {},
    subclasses: {},
    features: {},
    resources: {},
    durationRules: {},
    conditionalModifiers: {},
    choices: {},
    choiceOptions: {},
    backgrounds: {},
    species: {},
    feats: {},
    spells: {},
    generalActions: {},
    guidance: {},
    weapons: {},
    armor: {},
    weaponMasteryProperties: {},
    equipmentPacks: {},
  }
}

/** A content source contributes a partial registry; keys are merged in, later
 * sources never silently overwrite an existing id (see mergeIntoRegistry). */
export type RegistryModule = Partial<RulesRegistry>

export class DuplicateIdError extends Error {
  constructor(collection: string, id: string) {
    super(`Duplicate id "${id}" in registry collection "${collection}" — every record's id must be globally unique within its collection.`)
    this.name = 'DuplicateIdError'
  }
}

export function mergeIntoRegistry(base: RulesRegistry, addition: RegistryModule): RulesRegistry {
  const merged = { ...base }
  for (const key of Object.keys(addition) as (keyof RulesRegistry)[]) {
    const additionCollection = addition[key] as Record<string, unknown> | undefined
    if (!additionCollection) continue
    const baseCollection = merged[key] as Record<string, unknown>
    for (const id of Object.keys(additionCollection)) {
      if (id in baseCollection) throw new DuplicateIdError(key, id)
    }
    merged[key] = { ...baseCollection, ...additionCollection } as never
  }
  return merged
}

export function buildRegistry(modules: RegistryModule[]): RulesRegistry {
  return modules.reduce(mergeIntoRegistry, createEmptyRegistry())
}

/** Filters any collection of source-tagged records down to only those whose
 * source is currently enabled. This one function is what makes "disable
 * Ravenloft and its content disappears" true for every record type at once. */
export function filterBySource<T extends { source: SourceRef }>(
  records: Record<string, T>,
  enabledSourceIds: SourceId[],
): T[] {
  return Object.values(records).filter((record) => enabledSourceIds.includes(record.source.sourceId))
}

export function getEnabledClasses(registry: RulesRegistry, enabledSourceIds: SourceId[]): ClassDefinition[] {
  return filterBySource(registry.classes, enabledSourceIds)
}

export function getEnabledSubclassesForClass(
  registry: RulesRegistry,
  classId: string,
  enabledSourceIds: SourceId[],
): SubclassDefinition[] {
  return filterBySource(registry.subclasses, enabledSourceIds).filter((sub) => sub.parentClassId === classId)
}
