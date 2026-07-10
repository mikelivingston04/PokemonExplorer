import { useMemo } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { getEvolutionChain, getEvolutionChainList } from '@/lib/api/evolutionChain'
import { extractIdFromUrl } from '@/lib/api/client'
import { expensiveFetchLimiter } from '@/lib/filterEngine/concurrencyLimiter'
import { collectEvolutionStages } from '@/lib/evolution/findStage'
import type { EvolutionStage } from '@/lib/filterEngine/types'

export interface EvolutionStageIndexResult {
  stageBySpecies: Map<string, EvolutionStage>
  isResolved: boolean
}

// Evolution stage is static game data covered by ~540 total chains, no
// matter how many candidate Pokémon are being filtered — so it's built once
// (fetch every chain, read every species' stage straight out of its own
// chain data) and cached forever, rather than looked up per-candidate. The
// per-candidate approach this replaced also had to 404 for every alt-form
// name (mega/gmax/regional forms don't have their own species page), which
// alone was ~350 wasted round trips on top of being fundamentally the wrong
// shape (up to 1300+ requests instead of ~540, repeated on every scan).
export function useEvolutionStageIndex(enabled: boolean): EvolutionStageIndexResult {
  const chainList = useQuery({
    queryKey: ['evolutionChainList'],
    queryFn: getEvolutionChainList,
    staleTime: Infinity,
    enabled,
  })

  const chainIds = useMemo(
    () => chainList.data?.results.map((r) => extractIdFromUrl(r.url)) ?? [],
    [chainList.data],
  )

  const chainQueries = useQueries({
    queries: chainIds.map((id) => ({
      queryKey: ['evolutionChain', id],
      queryFn: () => expensiveFetchLimiter(() => getEvolutionChain(id)),
      staleTime: Infinity,
    })),
  })

  const stageBySpecies = useMemo(() => {
    const map = new Map<string, EvolutionStage>()
    for (const q of chainQueries) {
      if (!q.data) continue
      collectEvolutionStages(q.data.chain).forEach((stage, name) => map.set(name, stage))
    }
    return map
  }, [chainQueries])

  const isResolved =
    !enabled || (chainList.isSuccess && chainIds.length > 0 && chainQueries.every((q) => q.isSuccess || q.isError))

  return { stageBySpecies, isResolved }
}
