import { useQuery } from '@tanstack/react-query'
import { getEvolutionChain } from '@/lib/api/evolutionChain'

export function useEvolutionChain(id: number | undefined) {
  return useQuery({
    queryKey: ['evolutionChain', id],
    queryFn: () => getEvolutionChain(id as number),
    enabled: !!id,
  })
}
