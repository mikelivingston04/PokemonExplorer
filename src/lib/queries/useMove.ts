import { useQuery } from '@tanstack/react-query'
import { getMove } from '@/lib/api/move'

export function useMove(name: string | undefined) {
  return useQuery({
    queryKey: ['move', name],
    queryFn: () => getMove(name as string),
    enabled: !!name,
  })
}
