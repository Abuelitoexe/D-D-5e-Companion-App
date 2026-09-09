import { describe, expect, it } from 'vitest'
import { buildRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import { classTipsModule } from '../data/guidance/classTips'

const registry = buildRegistry([phb2024Module, classTipsModule])

const ALL_CLASS_IDS = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard']

describe('Phase 6 — Class Guidance is a separate registry, populated for all 12 classes', () => {
  it('has exactly 12 guidance records, one per real class, each carrying non-mechanical content', () => {
    expect(Object.keys(registry.guidance)).toHaveLength(12)
    for (const classId of ALL_CLASS_IDS) {
      const guidance = registry.guidance[classId]
      expect(guidance, `${classId} must have a guidance record`).toBeDefined()
      expect(guidance.classId).toBe(classId)
      expect(guidance.classIdentity.length).toBeGreaterThan(0)
      expect(guidance.goodFitFor.length).toBeGreaterThan(0)
      expect(guidance.thingsToWatch.length).toBeGreaterThan(0)
    }
  })

  it('every guidance record is sourced from CLASS_TIPS, not PHB2024, and flags mechanicsVerifiedFor2024 as false', () => {
    for (const guidance of Object.values(registry.guidance)) {
      expect(guidance.source.sourceId).toBe('CLASS_TIPS')
      expect(guidance.mechanicsVerifiedFor2024).toBe(false)
    }
  })

  it('guidance registration does not collide with or duplicate any PHB2024 class/feature/resource id', () => {
    // buildRegistry throws DuplicateIdError on any collision across modules —
    // reaching this line at all (no throw during the describe-level buildRegistry
    // call above) is the real assertion; this just documents why.
    expect(Object.keys(registry.classes)).toHaveLength(12)
    expect(Object.keys(registry.guidance)).toHaveLength(12)
  })
})
