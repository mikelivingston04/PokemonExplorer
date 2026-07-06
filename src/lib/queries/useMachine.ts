import { useQuery } from '@tanstack/react-query'
import { getMachine } from '@/lib/api/machine'

export function useMachine(id: number | undefined) {
  return useQuery({
    queryKey: ['machine', id],
    queryFn: () => getMachine(id as number),
    enabled: !!id,
  })
}
