import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { filterStateFromSearchParams, filterStateToSearchParams } from '@/lib/urlState'
import { useFilteredPokemon } from '@/lib/queries/useFilteredPokemon'
import { useExpensiveFilteredPokemon } from '@/lib/queries/useExpensiveFilteredPokemon'
import { FilterPanelContent } from '@/components/layout/FilterPanelContent'
import { FilterSheet } from '@/components/layout/FilterSheet'
import { PokemonGrid } from '@/components/pokemon/PokemonGrid'
import type { FilterState } from '@/lib/filterEngine/types'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Fresh visit, no filters in the URL yet — default to Gen 1 (this app's
  // primary use case) by writing it into the URL, since the URL is the only
  // source of truth for filter state.
  useEffect(() => {
    if (searchParams.toString() === '') {
      setSearchParams({ gen: '1' }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filters = filterStateFromSearchParams(searchParams)
  const { names: tier1Names, isLoading } = useFilteredPokemon(filters)
  const { names, isChecking, candidateCount, showLargeSetWarning } = useExpensiveFilteredPokemon(
    tier1Names,
    filters,
  )

  const checkingStatus = isChecking
    ? showLargeSetWarning
      ? `Checking ${candidateCount} Pokémon — this may take a moment...`
      : 'Checking...'
    : undefined

  function updateFilters(next: FilterState) {
    setSearchParams(filterStateToSearchParams(next))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Search &amp; Filter</h1>
          <p className="text-sm text-muted-foreground">
            Find Pokémon, moves, TMs, and types.
          </p>
        </div>
        <FilterSheet filters={filters} onChange={updateFilters} />
      </div>

      <div className="flex gap-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterPanelContent filters={filters} onChange={updateFilters} />
        </aside>
        <div className="min-w-0 flex-1">
          <PokemonGrid names={names} isLoading={isLoading} checkingStatus={checkingStatus} />
        </div>
      </div>
    </div>
  )
}
