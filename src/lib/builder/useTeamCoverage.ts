import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getMove } from '@/lib/api/move'
import { getType } from '@/lib/api/type'
import { computeOffensiveEffectiveness } from '@/lib/typeEffectiveness'
import { ALL_TYPE_NAMES, type PokemonType } from '@/lib/constants/typeColors'
import { useBuilder } from '@/lib/builder/useBuilder'

// Offensive coverage, purely from selected moves — not each Pokémon's own
// type. A Lapras with Thunderbolt taped on for Electric coverage should
// count, even though Lapras itself isn't Electric-type.
export function useTeamCoverage() {
  const { team, getMoves } = useBuilder()

  const moveNames = useMemo(() => {
    const names = new Set<string>()
    for (const pokemonName of team) {
      for (const moveName of getMoves(pokemonName)) {
        if (moveName) names.add(moveName)
      }
    }
    return [...names]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team.join(','), team.map((n) => getMoves(n).join('|')).join(',')])

  const moveResults = useQueries({
    queries: moveNames.map((name) => ({
      queryKey: ['move', name],
      queryFn: () => getMove(name),
      staleTime: Infinity,
    })),
  })

  // Status moves deal no damage, so their type can't "combat" anything —
  // Toxic is nominally Poison-typed but shouldn't count as Poison coverage.
  const attackingTypes = useMemo(() => {
    const types = new Set<string>()
    for (const r of moveResults) {
      if (r.data && r.data.damage_class.name !== 'status') types.add(r.data.type.name)
    }
    return [...types]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveResults.map((r) => r.data?.name).join(',')])

  const typeResults = useQueries({
    queries: attackingTypes.map((type) => ({
      queryKey: ['type', type],
      queryFn: () => getType(type),
      staleTime: Infinity,
    })),
  })

  // Cheap enough (≤18 attacking types × 18 defending types) to just compute
  // on every render — memoizing it would mean spreading typeResults into a
  // dependency array whose length tracks attackingTypes.length, which
  // changes over time and breaks React's "stable hook dependency count" rule.
  const covered = new Set<PokemonType>()
  for (const r of typeResults) {
    if (!r.data) continue
    const offense = computeOffensiveEffectiveness(r.data.damage_relations)
    for (const type of ALL_TYPE_NAMES) {
      if (offense[type] === 2) covered.add(type)
    }
  }

  return { covered }
}
