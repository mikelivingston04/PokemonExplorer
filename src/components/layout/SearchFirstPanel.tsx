import { forwardRef } from 'react'
import { SearchIcon } from 'lucide-react'
import { FilterPanelContent } from '@/components/layout/FilterPanelContent'
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
      <div className={styles.searchRow}>
        <input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Search Pokémon, moves, types, abilities..."
          aria-label="Search Pokémon, moves, types, abilities"
          className={styles.searchInput}
        />
        <SearchIcon className={styles.searchIcon} />
      </div>
      <FilterPanelContent filters={filters} onChange={onFiltersChange} onClearAll={onClearAll} />
    </div>
  )
})
