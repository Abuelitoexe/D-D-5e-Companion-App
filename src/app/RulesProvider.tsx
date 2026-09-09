import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { buildRegistry, type RulesRegistry } from '../data/registry'
import { phb2024Module } from '../data/phb2024'
import { classTipsModule } from '../data/guidance/classTips'

const RulesContext = createContext<RulesRegistry | null>(null)

/** Builds the rules registry once for the app's lifetime. Adding a new
 * source later (Ravenloft, Heroes of Faerûn) means adding its module to this
 * array — no other app code changes. */
export function RulesProvider({ children }: { children: ReactNode }) {
  const registry = useMemo(() => buildRegistry([phb2024Module, classTipsModule]), [])
  return <RulesContext.Provider value={registry}>{children}</RulesContext.Provider>
}

export function useRules(): RulesRegistry {
  const registry = useContext(RulesContext)
  if (!registry) throw new Error('useRules must be used within a RulesProvider')
  return registry
}
