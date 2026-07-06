import { useMemo } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import { getAllPokemonNames } from '@/lib/api/lists'
import { getGeneration } from '@/lib/api/generation'
import { getType } from '@/lib/api/type'
import { getMove } from '@/lib/api/move'
import type { FilterState } from '@/lib/filterEngine/types'

export interface FilteredPokemonResult {
  names: string[]
  isLoading: boolean
}

// Free tier: every constraint here comes from a single list-endpoint fetch
// (generation roster, type roster, or a move's learned_by_pokemon) — no
// per-Pokémon fetch is needed to narrow the candidate set this far.
export function useFilteredPokemon(filters: FilterState): FilteredPokemonResult {
  const allPokemon = useQuery({
    queryKey: ['searchIndex', 'pokemon'],
    queryFn: getAllPokemonNames,
    staleTime: Infinity,
  })

  const generationQueries = useQueries({
    queries: filters.generations.map((id) => ({
      queryKey: ['generation', id],
      queryFn: () => getGeneration(id),
      staleTime: Infinity,
    })),
  })

  const typeQueries = useQueries({
    queries: filters.types.map((name) => ({
      queryKey: ['type', name],
      queryFn: () => getType(name),
      staleTime: Infinity,
    })),
  })

  const moveQuery = useQuery({
    queryKey: ['move', filters.learnsMove],
    queryFn: () => getMove(filters.learnsMove as string),
    enabled: !!filters.learnsMove,
    staleTime: Infinity,
  })

  const generationsLoading = generationQueries.some((q) => q.isLoading)
  const typesLoading = typeQueries.some((q) => q.isLoading)

  const genSet = useMemo(() => {
    if (filters.generations.length === 0) return null
    const set = new Set<string>()
    for (const q of generationQueries) {
      q.data?.pokemon_species.forEach((s) => set.add(s.name))
    }
    return set
  }, [generationQueries, filters.generations.length])

  const typeSet = useMemo(() => {
    if (filters.types.length === 0) return null
    const set = new Set<string>()
    for (const q of typeQueries) {
      q.data?.pokemon.forEach((p) => set.add(p.pokemon.name))
    }
    return set
  }, [typeQueries, filters.types.length])

  const moveSet = useMemo(() => {
    if (!filters.learnsMove) return null
    return new Set(moveQuery.data?.learned_by_pokemon.map((p) => p.name) ?? [])
  }, [moveQuery.data, filters.learnsMove])

  const names = useMemo(() => {
    const universe = allPokemon.data?.results ?? []
    return universe
      .map((r) => r.name)
      .filter((name) => {
        // Generation rosters only ever list base-species names — a form like
        // "charizard-mega-x" was introduced generations after Gen 1's
        // Charizard, so it must NOT pass a Gen 1 filter just because its base
        // species does. Exact match only, no base-name fallback.
        if (genSet && !genSet.has(name)) return false
        if (typeSet && !typeSet.has(name)) return false
        if (moveSet && !moveSet.has(name)) return false
        return true
      })
  }, [allPokemon.data, genSet, typeSet, moveSet])

  return {
    names,
    isLoading:
      allPokemon.isLoading ||
      generationsLoading ||
      typesLoading ||
      (!!filters.learnsMove && moveQuery.isLoading),
  }
}
