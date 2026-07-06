import { POKEAPI_BASE, fetchJson } from './client'
import type { Move } from '@/types/pokeapi'

export function getMove(name: string) {
  return fetchJson<Move>(`${POKEAPI_BASE}/move/${name}`)
}
