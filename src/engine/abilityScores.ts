import type { AbilityName } from '../domain/types'

/**
 * One Ability Score Improvement pick, per PHB 2024 p.202: increase one
 * ability score by 2 (a 1-element allocation), or two different ability
 * scores by 1 each (a 2-element allocation). Neither can raise a score
 * above 20.
 */
export type AsiAllocation = AbilityName[]

export function applyAbilityScoreIncreases(
  scores: Record<AbilityName, number>,
  allocations: AsiAllocation[],
): Record<AbilityName, number> {
  const next = { ...scores }
  for (const allocation of allocations) {
    const amount = allocation.length === 1 ? 2 : 1
    for (const ability of allocation) {
      next[ability] = Math.min(20, next[ability] + amount)
    }
  }
  return next
}

/** A single allocation is only valid once every slot is filled and, for a
 * 2-ability allocation, the two abilities are different. */
export function isAllocationComplete(allocation: AsiAllocation, mode: 'single' | 'double'): boolean {
  if (mode === 'single') return allocation.length === 1
  return allocation.length === 2 && allocation[0] !== allocation[1]
}
