import { POKEAPI_BASE, fetchJson } from './client'
import type { EvolutionChain } from '@/types/pokeapi'

export function getEvolutionChain(id: number) {
  return fetchJson<EvolutionChain>(`${POKEAPI_BASE}/evolution-chain/${id}`)
}
