import { describe, expect, it } from 'vitest'
import {
  buildRegistry,
  DuplicateIdError,
  getEnabledClasses,
  getEnabledSubclassesForClass,
  mergeIntoRegistry,
} from '../data/registry'
import type { RegistryModule } from '../data/registry'
import type { ClassDefinition, SubclassDefinition } from '../domain/types'

// Minimal, deliberately fake records — NOT real game data. They exist only to
// prove the registry treats every source identically: PHB2024 content today,
// and a not-yet-populated expansion source (Ravenloft) that must behave the
// same way once it has real content, with zero engine changes.

const fakePhbClass: ClassDefinition = {
  id: 'test-phb-class',
  name: 'Test PHB Class',
  source: { sourceId: 'PHB2024', sourceLabel: 'PHB 2024', needsVerification: false },
  primaryAbilities: ['Strength'],
  hitDie: 10,
  subclassLevel: 3,
  featuresByLevel: { 1: [] },
}

const fakeRavenloftClass: ClassDefinition = {
  id: 'test-ravenloft-class',
  name: 'Test Ravenloft Class (stub)',
  source: { sourceId: 'RAVENLOFT', sourceLabel: 'Ravenloft', needsVerification: true },
  primaryAbilities: ['Intelligence'],
  hitDie: 8,
  subclassLevel: 3,
  featuresByLevel: { 1: [] },
}

const fakeRavenloftSubclass: SubclassDefinition = {
  id: 'test-ravenloft-subclass',
  name: 'Test Ravenloft Subclass (stub)',
  parentClassId: 'test-phb-class',
  minimumLevel: 3,
  source: { sourceId: 'RAVENLOFT', sourceLabel: 'Ravenloft', needsVerification: true },
  featuresByLevel: { 3: [] },
}

const phbModule: RegistryModule = { classes: { [fakePhbClass.id]: fakePhbClass } }
const ravenloftModule: RegistryModule = {
  classes: { [fakeRavenloftClass.id]: fakeRavenloftClass },
  subclasses: { [fakeRavenloftSubclass.id]: fakeRavenloftSubclass },
}

describe('registry: source-generic filtering', () => {
  it('a content source with no data yet contributes nothing, without special-casing', () => {
    const registry = buildRegistry([phbModule])
    expect(getEnabledClasses(registry, ['PHB2024'])).toHaveLength(1)
    expect(getEnabledClasses(registry, ['PHB2024', 'RAVENLOFT'])).toHaveLength(1) // Ravenloft enabled, but has no content
  })

  it('once a deferred source (Ravenloft) gains real data, enabling it surfaces content with zero registry/engine changes', () => {
    const registry = buildRegistry([phbModule, ravenloftModule])
    expect(getEnabledClasses(registry, ['PHB2024'])).toHaveLength(1) // Ravenloft disabled -> its class hidden
    expect(getEnabledClasses(registry, ['PHB2024', 'RAVENLOFT'])).toHaveLength(2) // enabled -> appears
  })

  it('disabling a source hides its subclasses too, without deleting them from the registry', () => {
    const registry = buildRegistry([phbModule, ravenloftModule])
    expect(getEnabledSubclassesForClass(registry, 'test-phb-class', ['PHB2024'])).toHaveLength(0)
    expect(getEnabledSubclassesForClass(registry, 'test-phb-class', ['PHB2024', 'RAVENLOFT'])).toHaveLength(1)
    // the record itself is never deleted — merely filtered from the enabled view
    expect(registry.subclasses['test-ravenloft-subclass']).toBeDefined()
  })

  it('rejects two sources that accidentally define the same id, catching cross-source content collisions early', () => {
    const clashingModule: RegistryModule = { classes: { [fakePhbClass.id]: fakePhbClass } }
    expect(() => mergeIntoRegistry(buildRegistry([phbModule]), clashingModule)).toThrow(DuplicateIdError)
  })
})
