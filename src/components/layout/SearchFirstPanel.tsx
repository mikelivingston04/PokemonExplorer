import { forwardRef } from 'react'
import { SearchIcon } from 'lucide-react'
import { FilterPanelContent } from '@/components/layout/FilterPanelContent'
import { PokeballIcon } from '@/components/layout/PokeballIcon'
import type { FilterState } from '@/lib/filterEngine/types'
import styles from './SearchFirstPanel.module.scss'

interface SearchFirstPanelProps {
  searchText: string
  onSearchTextChange: (value: string) => void
  filters: FilterState
  onFiltersChange: (next: FilterState) => void
  onClearAll: () => void
}

export const SearchFirstPanel = forwardRef<HTMLInputElement, SearchFirstPanelProps>(function SearchFirstPanel(
  { searchText, onSearchTextChange, filters, onFiltersChange, onClearAll },
  inputRef,
) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <PokeballIcon className={styles.titleIcon} />
          {/* Not an <h1> — this box appears on every page, and each page
              (Pokémon/Move/Type names) owns the real page heading. This is
              persistent site branding, closer to a logo than a heading. */}
          <p className={styles.title}>Pokémon explorer</p>
        </div>
        <p className={styles.subtitle}>a personal Pokédex, built to poke around in</p>
      </div>

      <div className={styles.searchRow}>
        <input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Search Pokémon, moves, types..."
          aria-label="Search Pokémon, moves, types"
          className={styles.searchInput}
        />
        <SearchIcon className={styles.searchIcon} />
      </div>
      <FilterPanelContent filters={filters} onChange={onFiltersChange} onClearAll={onClearAll} />
    </div>
  )
})
