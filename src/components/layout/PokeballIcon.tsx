// The faint pokéball-outline motif — used large on the empty landing state
// and small next to the app title in the search box header.
export function PokeballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="12 8" />
      <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="8" />
      <line x1="20" y1="100" x2="80" y2="100" stroke="currentColor" strokeWidth="8" />
      <line x1="120" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="8" />
    </svg>
  )
}
