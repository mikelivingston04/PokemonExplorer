import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PokemonTileContent, MoveTileContent, TypeTileContent } from '@/components/search/SearchResultTiles'
import { PokemonGrid } from '@/components/pokemon/PokemonGrid'
import type { SearchIndexEntry } from '@/lib/queries/useSearchIndex'
import styles from './SearchResultsPanel.module.scss'

const TILE_CAP = 6

export function TileLink({ entry, route, children }: { entry: SearchIndexEntry; route: string; children: ReactNode }) {
  return (
    <Link to={`${route}/${entry.name}`} className={styles.tile}>
      {children}
    </Link>
  )
}

function ResultRow({
  label,
  entries,
  route,
  renderContent,
  expanded,
  onExpand,
}: {
  label: string
  entries: SearchIndexEntry[]
  route: string
  renderContent: (entry: SearchIndexEntry) => ReactNode
  expanded: boolean
  onExpand: () => void
}) {
  if (entries.length === 0) return null
  const visible = expanded ? entries : entries.slice(0, TILE_CAP)
  const remaining = entries.length - visible.length

  return (
    <section className={styles.row}>
      <h2 className={styles.rowLabel}>{label}</h2>
      <div className={styles.tileWrap}>
        {visible.map((entry) => (
          <TileLink key={entry.name} entry={entry} route={route}>
            {renderContent(entry)}
          </TileLink>
        ))}
        {remaining > 0 && (
          <button type="button" onClick={onExpand} className={styles.expandBtn}>
            Expand results ({entries.length})
          </button>
        )}
      </div>
    </section>
  )
}

interface SearchResultsPanelProps {
  pokemonEntries: SearchIndexEntry[]
  moveEntries: SearchIndexEntry[]
  typeEntries: SearchIndexEntry[]
  pokemonNames: string[]
  isPokemonLoading: boolean
  checkingStatus?: string
}

export function SearchResultsPanel({
  pokemonEntries,
  moveEntries,
  typeEntries,
  pokemonNames,
  isPokemonLoading,
  checkingStatus,
}: SearchResultsPanelProps) {
  // The Pokémon row's "expand" swaps it for the full rich grid (infinite
  // scroll, bigger cards) rather than just revealing more tiles — a much
  // better way to browse a large result set than an ever-growing tile wrap.
  const [pokemonExpanded, setPokemonExpanded] = useState(false)
  const [moveExpanded, setMoveExpanded] = useState(false)
  const [typeExpanded, setTypeExpanded] = useState(false)

  const hasAnyResults = pokemonEntries.length > 0 || moveEntries.length > 0 || typeEntries.length > 0

  if (!hasAnyResults) {
    return <p className={styles.empty}>No results match your search.</p>
  }

  return (
    <div className={styles.panel}>
      {pokemonEntries.length > 0 &&
        (pokemonExpanded ? (
          <section className={styles.row}>
            <h2 className={styles.rowLabel}>Pokémon</h2>
            <PokemonGrid names={pokemonNames} isLoading={isPokemonLoading} checkingStatus={checkingStatus} />
          </section>
        ) : (
          <ResultRow
            label="Pokémon"
            entries={pokemonEntries}
            route="/pokemon"
            renderContent={(entry) => <PokemonTileContent entry={entry} />}
            expanded={false}
            onExpand={() => setPokemonExpanded(true)}
          />
        ))}
      <ResultRow
        label="Moves"
        entries={moveEntries}
        route="/move"
        renderContent={(entry) => <MoveTileContent entry={entry} />}
        expanded={moveExpanded}
        onExpand={() => setMoveExpanded(true)}
      />
      <ResultRow
        label="Types"
        entries={typeEntries}
        route="/type"
        renderContent={(entry) => <TypeTileContent entry={entry} />}
        expanded={typeExpanded}
        onExpand={() => setTypeExpanded(true)}
      />
    </div>
  )
}
