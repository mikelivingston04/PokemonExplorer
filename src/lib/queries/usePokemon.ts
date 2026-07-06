import { useQuery } from '@tanstack/react-query'
import { getPokemon, getPokemonEncounters } from '@/lib/api/pokemon'

export function usePokemon(name: string | undefined) {
  return useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => getPokemon(name as string),
    enabled: !!name,
  })
}

export function usePokemonEncounters(idOrName: number | string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['pokemonEncounters', idOrName],
    queryFn: () => getPokemonEncounters(idOrName as number | string),
    enabled: !!idOrName && enabled,
  })
}
