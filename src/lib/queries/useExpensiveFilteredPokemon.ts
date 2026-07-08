import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getPokemonSpecies } from '@/lib/api/species'
import { getEvolutionChain } from '@/lib/api/evolutionChain'
import { getPokemon } from '@/lib/api/pokemon'
import { extractIdFromUrl, PokeApiError } from '@/lib/api/client'
import { expensiveFetchLimiter } from '@/lib/filterEngine/concurrencyLimiter'
import { isLegendaryOrMythical } from '@/lib/constants/legendaries'
import { findEvolutionStage } from '@/lib/evolution/findStage'
import type { FilterState } from '@/lib/filterEngine/types'

const LARGE_CANDIDATE_THRESHOLD = 150

export interface ExpensiveFilterResult {
  names: string[]
  isChecking: boolean
  candidateCount: number
  showLargeSetWarning: boolean
}

// Runs only over the already-narrowed free-tier candidate set. Legendary
// status is a synchronous lookup (no fetch); evolution stage and
// version/method-specific move-learn each require per-candidate fetches,
// throttled through a shared concurrency limiter since the candidate set can
// still be large (e.g. an evolution-stage filter with no generation/type
// narrowing applied).
export function useExpensiveFilteredPokemon(
  tier1Names: string[],
  filters: FilterState,
): ExpensiveFilterResult {
  const needsLegendaryCheck = filters.legendaryStatus !== 'any'
  const needsStageCheck = filters.evolutionStage !== 'any'
  // A method filter is meaningful on its own ("learns anything via TM") or
  // paired with a specific move ("learns Flamethrower via TM specifically") —
  // either combination requires each candidate's full moveset.
  const needsMethodCheck = filters.learnMethod !== 'any'

  const afterLegendary = useMemo(() => {
    if (!needsLegendaryCheck) return tier1Names
    return tier1Names.filter((name) => {
      const legendary = isLegendaryOrMythical(name)
      return filters.legendaryStatus === 'legendary' ? legendary : !legendary
    })
  }, [tier1Names, needsLegendaryCheck, filters.legendaryStatus])

  // Evolution stage: species -> evolution_chain id -> chain, each step
  // throttled. A candidate whose name isn't a real species (a small number of
  // alt-forms slip through when no generation filter narrows them out first)
  // 404s fast and is simply excluded rather than crashing the page.
  const speciesQueries = useQueries({
    queries: needsStageCheck
      ? afterLegendary.map((name) => ({
          queryKey: ['pokemonSpecies', name],
          queryFn: () => expensiveFetchLimiter(() => getPokemonSpecies(name)),
          staleTime: Infinity,
          retry: false,
        }))
      : [],
  })

  const chainIds = useMemo(() => {
    if (!needsStageCheck) return []
    const ids = new Set<number>()
    for (const q of speciesQueries) {
      if (q.data) ids.add(extractIdFromUrl(q.data.evolution_chain.url))
    }
    return [...ids]
  }, [speciesQueries, needsStageCheck])

  const chainQueries = useQueries({
    queries: chainIds.map((id) => ({
      queryKey: ['evolutionChain', id],
      queryFn: () => expensiveFetchLimiter(() => getEvolutionChain(id)),
      staleTime: Infinity,
    })),
  })

  const stageBySpecies = useMemo(() => {
    const map = new Map<string, string>()
    if (!needsStageCheck) return map
    const chainById = new Map(chainIds.map((id, i) => [id, chainQueries[i]]))
    for (const q of speciesQueries) {
      if (!q.data) continue
      const chainQuery = chainById.get(extractIdFromUrl(q.data.evolution_chain.url))
      if (!chainQuery?.data) continue
      const stage = findEvolutionStage(chainQuery.data.chain, q.data.name)
      if (stage) map.set(q.data.name, stage)
    }
    return map
  }, [speciesQueries, chainQueries, chainIds, needsStageCheck])

  const stageResolved = !needsStageCheck || speciesQueries.every((q) => q.isSuccess || q.isError)
  const chainsResolved = chainQueries.every((q) => q.isSuccess || q.isError)

  const afterStage = useMemo(() => {
    if (!needsStageCheck) return afterLegendary
    return afterLegendary.filter((name) => stageBySpecies.get(name) === filters.evolutionStage)
  }, [afterLegendary, needsStageCheck, stageBySpecies, filters.evolutionStage])

  // Version/method-specific move-learn: needs each candidate's full moveset.
  const pokemonQueries = useQueries({
    queries: needsMethodCheck
      ? afterLegendary.map((name) => ({
          queryKey: ['pokemon', name],
          queryFn: () => expensiveFetchLimiter(() => getPokemon(name)),
          staleTime: Infinity,
          retry: (count: number, err: unknown) =>
            err instanceof PokeApiError && err.status === 404 ? false : count < 2,
        }))
      : [],
  })

  const methodResolved = !needsMethodCheck || pokemonQueries.every((q) => q.isSuccess || q.isError)

  const afterMethod = useMemo(() => {
    if (!needsMethodCheck) return afterStage
    const passing = new Set<string>()
    for (const q of pokemonQueries) {
      const p = q.data
      if (!p) continue
      // With no specific move selected, any move learned via this method
      // counts; with a move selected, that move must be the one learned via it.
      const matches = p.moves.some((m) => {
        if (filters.learnsMove && m.move.name !== filters.learnsMove) return false
        return m.version_group_details.some(
          (d) => d.version_group.name === filters.versionGroup && d.move_learn_method.name === filters.learnMethod,
        )
      })
      if (matches) passing.add(p.name)
    }
    return afterStage.filter((name) => passing.has(name))
  }, [afterStage, pokemonQueries, needsMethodCheck, filters.learnsMove, filters.versionGroup, filters.learnMethod])

  const isChecking =
    (needsStageCheck && (!stageResolved || !chainsResolved)) || (needsMethodCheck && !methodResolved)

  return {
    names: afterMethod,
    isChecking,
    candidateCount: afterLegendary.length,
    showLargeSetWarning: (needsStageCheck || needsMethodCheck) && afterLegendary.length > LARGE_CANDIDATE_THRESHOLD,
  }
}
