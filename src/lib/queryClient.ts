import { QueryClient, type Query } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PokeApiError } from './api/client'

// PokéAPI data is immutable for this app's purposes (game data doesn't change),
// so we cache aggressively and never refetch in the background.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // A 404 means the resource doesn't exist — retrying it can only waste
      // time before an error state shows. Only retry on transient failures.
      retry: (failureCount, error) => {
        if (error instanceof PokeApiError && error.status === 404) return false
        return failureCount < 2
      },
    },
  },
})

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'pokemon-explorer-cache',
})

export const persistOptions = {
  persister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  buster: 'v1', // bump to invalidate all persisted cache after a data-shape change
  dehydrateOptions: {
    shouldDehydrateQuery: (query: Query) => query.state.status === 'success',
  },
}
