import { POKEAPI_BASE, fetchJson } from './client'
import type { EvolutionChain } from '@/types/pokeapi'

export function getEvolutionChain(id: number) {
  return fetchJson<EvolutionChain>(`${POKEAPI_BASE}/evolution-chain/${id}`)
}

interface EvolutionChainListResponse {
  count: number
  results: { url: string }[]
}

// The whole game's evolution-chain roster is small (~540 entries) and never
// changes — listing it once lets us fetch every chain directly by id instead
// of discovering chain ids indirectly through per-species lookups.
export function getEvolutionChainList() {
  return fetchJson<EvolutionChainListResponse>(`${POKEAPI_BASE}/evolution-chain?limit=100000`)
}
