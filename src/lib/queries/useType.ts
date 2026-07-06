import { useQuery } from '@tanstack/react-query'
import { getType } from '@/lib/api/type'

export function useType(name: string | undefined) {
  return useQuery({
    queryKey: ['type', name],
    queryFn: () => getType(name as string),
    enabled: !!name,
  })
}
