import { NavLink, useParams } from 'react-router-dom'

const DESTINATIONS = [
  { to: 'play', label: 'Play' },
  { to: 'abilities', label: 'Abilities' },
  { to: 'spells', label: 'Spells' },
  { to: 'level-up', label: 'Level Up' },
  { to: 'character', label: 'Character' },
] as const

/** Fixed bottom nav bar, the only navigation surface once a character is
 * open — deliberately flat (no nesting) per the spec's "avoid nested
 * navigation" guidance. */
export function BottomNav() {
  const { characterId } = useParams<{ characterId: string }>()

  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-border bg-surface">
      <ul className="mx-auto flex max-w-[960px]">
        {DESTINATIONS.map((dest) => (
          <li key={dest.to} className="flex-1">
            <NavLink
              to={`/character/${characterId}/${dest.to}`}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 text-xs ${
                  isActive ? 'text-accent font-medium' : 'text-text-secondary'
                }`
              }
            >
              {dest.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
