import { useQuery } from '@tanstack/react-query'
import { getPokemonSpecies } from '@/lib/api/species'

export function usePokemonSpecies(name: string | undefined) {
  return useQuery({
    queryKey: ['pokemonSpecies', name],
    queryFn: () => getPokemonSpecies(name as string),
    enabled: !!name,
  })
}
