import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllPokemonNames, getAllMoveNames, getAllTypeNames } from '@/lib/api/lists'
import { toDisplayName } from '@/lib/constants/nameOverrides'

export type SearchCategory = 'pokemon' | 'move' | 'type'

export interface SearchIndexEntry {
  name: string
  displayName: string
  category: SearchCategory
}

// Fetched once, cached forever — powers instant client-side search with no
// per-keystroke network round trip. ~2200 entries total, well under 100KB.
export function useSearchIndex() {
  const pokemonQuery = useQuery({
    queryKey: ['searchIndex', 'pokemon'],
    queryFn: getAllPokemonNames,
    staleTime: Infinity,
  })
  const moveQuery = useQuery({
    queryKey: ['searchIndex', 'move'],
    queryFn: getAllMoveNames,
    staleTime: Infinity,
  })
  const typeQuery = useQuery({
    queryKey: ['searchIndex', 'type'],
    queryFn: getAllTypeNames,
    staleTime: Infinity,
  })

  const entries = useMemo<SearchIndexEntry[]>(() => {
    if (!pokemonQuery.data || !moveQuery.data || !typeQuery.data) return []
    const toEntries = (results: { name: string }[], category: SearchCategory) =>
      results.map((r) => ({ name: r.name, displayName: toDisplayName(r.name), category }))
    return [
      ...toEntries(pokemonQuery.data.results, 'pokemon'),
      ...toEntries(moveQuery.data.results, 'move'),
      ...toEntries(typeQuery.data.results, 'type'),
    ]
  }, [pokemonQuery.data, moveQuery.data, typeQuery.data])

  return {
    entries,
    isLoading: pokemonQuery.isLoading || moveQuery.isLoading || typeQuery.isLoading,
  }
}
