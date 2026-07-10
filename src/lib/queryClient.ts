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

// 'pokemonSpecies' is only fetched one-off per Pokémon's own detail page
// (for its Evolution Chain card) — cheap to refetch on revisit, so it's not
// worth persisting. 'evolutionChain' used to be excluded too, back when the
// Evolution Stage filter fetched species+chain per candidate (up to the
// whole ~1300-Pokémon roster at once); that made every throttled localStorage
// write — which fires roughly once a second while a scan is in flight —
// synchronously JSON.stringify a multi-megabyte payload, freezing the page.
// Evolution stage is now looked up from a shared ~540-chain index built once
// (see useEvolutionStageIndex), so 'evolutionChain' data is small and bounded
// — it's worth persisting now, so that index only has to be fetched once ever.
const NOT_PERSISTED_QUERY_KEYS = new Set(['pokemonSpecies'])

export const persistOptions = {
  persister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  buster: 'v1', // bump to invalidate all persisted cache after a data-shape change
  dehydrateOptions: {
    shouldDehydrateQuery: (query: Query) =>
      query.state.status === 'success' && !NOT_PERSISTED_QUERY_KEYS.has(query.queryKey[0] as string),
  },
}
