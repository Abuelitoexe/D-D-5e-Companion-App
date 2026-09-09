import { describe, expect, it } from 'vitest'
import { phb2024Module } from '../data/phb2024'
import { barbarianResources } from '../data/phb2024/classes/barbarian'
import { bardResources } from '../data/phb2024/classes/bard'
import { clericResources } from '../data/phb2024/classes/cleric'
import { druidResources } from '../data/phb2024/classes/druid'
import { fighterResources } from '../data/phb2024/classes/fighter'
import { monkResources } from '../data/phb2024/classes/monk'
import { paladinResources } from '../data/phb2024/classes/paladin'
import { rangerResources } from '../data/phb2024/classes/ranger'
import { wizardResources } from '../data/phb2024/classes/wizard'
import { rogueResources } from '../data/phb2024/classes/rogue'
import { sorcererResources } from '../data/phb2024/classes/sorcerer'
import { warlockResources } from '../data/phb2024/classes/warlock'
import { barbarianSubclassResources } from '../data/phb2024/subclasses/barbarianSubclasses'
import { bardSubclassResources } from '../data/phb2024/subclasses/bardSubclasses'
import { clericSubclassResources } from '../data/phb2024/subclasses/clericSubclasses'
import { druidSubclassResources } from '../data/phb2024/subclasses/druidSubclasses'
import { fighterSubclassResources } from '../data/phb2024/subclasses/fighterSubclasses'
import { monkSubclassResources } from '../data/phb2024/subclasses/monkSubclasses'
import { paladinSubclassResources } from '../data/phb2024/subclasses/paladinSubclasses'
import { rangerSubclassResources } from '../data/phb2024/subclasses/rangerSubclasses'
import { wizardSubclassResources } from '../data/phb2024/subclasses/wizardSubclasses'
import { rogueSubclassResources } from '../data/phb2024/subclasses/rogueSubclasses'
import { sorcererSubclassResources } from '../data/phb2024/subclasses/sorcererSubclasses'
import { warlockSubclassResources } from '../data/phb2024/subclasses/warlockSubclasses'

/**
 * data/phb2024/index.ts assembles every collection with plain object spread
 * (`{...a, ...b}`), not the registry's own strict-duplicate `mergeIntoRegistry`
 * — so a resource id reused across two classes (e.g. both Cleric and Paladin
 * naming their Channel Divinity resource `channelDivinity`) silently loses
 * one definition instead of erroring. This happened for real during Phase 4
 * pair 4 (caught by a resource-value test failing, not by any structural
 * check) — this test exists so a repeat is caught immediately and
 * self-evidently, without needing a coincidental value assertion to trip on it.
 */
describe('phb2024Module resource aggregation has no silent id collisions', () => {
  it('total resource count equals the sum of every individual module\'s resource count', () => {
    const perModuleCounts = [
      barbarianResources, barbarianSubclassResources,
      bardResources, bardSubclassResources,
      clericResources, clericSubclassResources,
      druidResources, druidSubclassResources,
      fighterResources, fighterSubclassResources,
      monkResources, monkSubclassResources,
      paladinResources, paladinSubclassResources,
      rangerResources, rangerSubclassResources,
      wizardResources, wizardSubclassResources,
      rogueResources, rogueSubclassResources,
      sorcererResources, sorcererSubclassResources,
      warlockResources, warlockSubclassResources,
    ].map((r) => Object.keys(r).length)

    const expectedTotal = perModuleCounts.reduce((sum, n) => sum + n, 0)
    expect(Object.keys(phb2024Module.resources ?? {}).length).toBe(expectedTotal)
  })
})
