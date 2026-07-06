import { POKEAPI_BASE, fetchJson } from './client'
import type { PokemonType } from '@/types/pokeapi'

export function getType(name: string) {
  return fetchJson<PokemonType>(`${POKEAPI_BASE}/type/${name}`)
}
