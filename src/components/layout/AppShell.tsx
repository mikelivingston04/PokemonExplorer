import { useEffect, useMemo, useRef } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { filterStateFromSearchParams, filterStateToSearchParams } from '@/lib/urlState'
import { useFilteredPokemon } from '@/lib/queries/useFilteredPokemon'
import { useExpensiveFilteredPokemon } from '@/lib/queries/useExpensiveFilteredPokemon'
import { useSearchIndex } from '@/lib/queries/useSearchIndex'
import { isFilterActive, type FilterState } from '@/lib/filterEngine/types'
import { SearchFirstPanel } from '@/components/layout/SearchFirstPanel'
import { SearchResultsPanel } from '@/components/layout/SearchResultsPanel'
import styles from './AppShell.module.scss'

// The search box (input + filters) is a permanent fixture at the top of
// every page, not a modal or a page-specific widget — typing or picking a
// filter swaps whatever page you're on for search results; clearing both
// (or navigating to a result, which drops the params) brings back the page
// underneath.
export function AppShell() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const searchText = searchParams.get('q') ?? ''
  const genParam = searchParams.get('gen')
  const typeParam = searchParams.get('type')
  const moveParam = searchParams.get('move')
  const methodParam = searchParams.get('method')
  const legendaryParam = searchParams.get('legendary')
  const stageParam = searchParams.get('stage')
  const versionParam = searchParams.get('version')

  // Memoized on everything except `q` — typing changes the URL too, and
  // without this, every keystroke produced a brand-new filters object
  // (new arrays and all), which defeated the memoization inside
  // useExpensiveFilteredPokemon and re-ran its per-Pokémon evolution-stage
  // fetch pipeline on every character typed, badly lagging the input.
  const filters = useMemo(() => {
    const params = new URLSearchParams()
    if (genParam) params.set('gen', genParam)
    if (typeParam) params.set('type', typeParam)
    if (moveParam) params.set('move', moveParam)
    if (methodParam) params.set('method', methodParam)
    if (legendaryParam) params.set('legendary', legendaryParam)
    if (stageParam) params.set('stage', stageParam)
    if (versionParam) params.set('version', versionParam)
    return filterStateFromSearchParams(params)
  }, [genParam, typeParam, moveParam, methodParam, legendaryParam, stageParam, versionParam])
  const isActivated = searchText.trim() !== '' || isFilterActive(filters)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function buildParams(nextFilters: FilterState, nextSearchText: string) {
    const params = filterStateToSearchParams(nextFilters) as Record<string, string>
    if (nextSearchText.trim()) params.q = nextSearchText
    return params
  }

  function updateFilters(next: FilterState) {
    setSearchParams(buildParams(next, searchText))
  }

  function updateSearchText(next: string) {
    setSearchParams(buildParams(filters, next), { replace: true })
  }

  // Clears filters and search text together and drops back to "/" — a
  // plain path with no query string, so it doubles as a home button.
  function clearAll() {
    navigate('/')
  }

  const { names: tier1Names, isLoading: tier1Loading } = useFilteredPokemon(filters)
  const { names: filteredNames, isChecking, candidateCount, showLargeSetWarning } = useExpensiveFilteredPokemon(
    tier1Names,
    filters,
  )
  const { entries } = useSearchIndex()

  // Pokémon row uses combined AND semantics: must pass the active filters
  // AND match the typed text. Moves/Types are text-only — filters don't
  // apply to them (there's no meaningful "generation" for a Move).
  const searchMatchedPokemonNames = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    if (!q) return null
    const set = new Set<string>()
    entries.forEach((e) => {
      if (e.category === 'pokemon' && e.displayName.toLowerCase().includes(q)) set.add(e.name)
    })
    return set
  }, [entries, searchText])

  const pokemonNames = useMemo(() => {
    if (searchMatchedPokemonNames === null) return filteredNames
    return filteredNames.filter((name) => searchMatchedPokemonNames.has(name))
  }, [filteredNames, searchMatchedPokemonNames])

  const pokemonEntries = useMemo(() => {
    const nameSet = new Set(pokemonNames)
    return entries.filter((e) => e.category === 'pokemon' && nameSet.has(e.name))
  }, [entries, pokemonNames])

  const moveEntries = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    if (!q) return []
    return entries.filter((e) => e.category === 'move' && e.displayName.toLowerCase().includes(q))
  }, [entries, searchText])

  const typeEntries = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    if (!q) return []
    return entries.filter((e) => e.category === 'type' && e.displayName.toLowerCase().includes(q))
  }, [entries, searchText])

  const checkingStatus = isChecking
    ? showLargeSetWarning
      ? `Checking ${candidateCount} Pokémon — this may take a moment...`
      : 'Checking...'
    : undefined

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SearchFirstPanel
          ref={inputRef}
          searchText={searchText}
          onSearchTextChange={updateSearchText}
          filters={filters}
          onFiltersChange={updateFilters}
          onClearAll={clearAll}
        />
        {isActivated ? (
          <SearchResultsPanel
            pokemonEntries={pokemonEntries}
            moveEntries={moveEntries}
            typeEntries={typeEntries}
            pokemonNames={pokemonNames}
            isPokemonLoading={tier1Loading}
            checkingStatus={checkingStatus}
          />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
