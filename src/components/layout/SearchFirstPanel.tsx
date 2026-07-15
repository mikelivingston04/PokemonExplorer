import { forwardRef, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { FilterPanelContent } from '@/components/layout/FilterPanelContent'
import { PokeballIcon } from '@/components/layout/PokeballIcon'
import { cn } from '@/lib/utils'
import type { FilterState } from '@/lib/filterEngine/types'
import styles from './SearchFirstPanel.module.scss'

interface SearchFirstPanelProps {
  searchText: string
  onSearchTextChange: (value: string) => void
  filters: FilterState
  onFiltersChange: (next: FilterState) => void
  onClearAll: () => void
  onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const SearchFirstPanel = forwardRef<HTMLInputElement, SearchFirstPanelProps>(function SearchFirstPanel(
  { searchText, onSearchTextChange, filters, onFiltersChange, onClearAll, onSearchKeyDown },
  inputRef,
) {
  // Mobile only (see the CSS): the on-screen keyboard eats so much vertical
  // space that results end up hidden underneath it. Collapsing the branding
  // and the filter row the instant the input is focused — not waiting for a
  // keystroke, since the keyboard shows up regardless — buys results room to
  // breathe. Desktop is untouched; there's no keyboard problem to solve there.
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={styles.card}>
      <div className={cn(styles.header, isFocused && styles.headerCollapsed)}>
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
          onKeyDown={onSearchKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search Pokémon, moves, types..."
          aria-label="Search Pokémon, moves, types"
          className={styles.searchInput}
        />
        <SearchIcon className={styles.searchIcon} />
      </div>
      <FilterPanelContent
        filters={filters}
        onChange={onFiltersChange}
        onClearAll={onClearAll}
        collapsed={isFocused}
      />
    </div>
  )
})
