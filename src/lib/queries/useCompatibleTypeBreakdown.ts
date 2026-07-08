import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getType } from '@/lib/api/type'
import { ALL_TYPE_NAMES, type PokemonType } from '@/lib/constants/typeColors'
import type { NamedApiResource } from '@/types/pokeapi'

export interface TypeBreakdownEntry {
  type: PokemonType
  pokemon: NamedApiResource[]
}

// A Move resource only lists which Pokémon learn it, not their types. Rather
// than fetching all (sometimes 400+) of those Pokémon individually, we fetch
// each type's full roster (18 requests, cached forever) and intersect with
// the move's compatible-Pokémon set — far cheaper and reuses the same cache
// other pages already warm via useType.
export function useCompatibleTypeBreakdown(learnedBy: NamedApiResource[]) {
  const compatibleNames = useMemo(() => new Set(learnedBy.map((p) => p.name)), [learnedBy])

  const results = useQueries({
    queries: ALL_TYPE_NAMES.map((type) => ({
      queryKey: ['type', type],
      queryFn: () => getType(type),
      staleTime: Infinity,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)

  const breakdown = useMemo<TypeBreakdownEntry[]>(() => {
    return ALL_TYPE_NAMES.map((type, i) => {
      const data = results[i]?.data
      const pokemon = (data?.pokemon ?? [])
        .map((p) => p.pokemon)
        .filter((p) => compatibleNames.has(p.name))
      return { type, pokemon }
    }).filter((entry) => entry.pokemon.length > 0)
      .sort((a, b) => b.pokemon.length - a.pokemon.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compatibleNames, ...results.map((r) => r.data)])

  return { breakdown, isLoading }
}
