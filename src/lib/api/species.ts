import { POKEAPI_BASE, fetchJson } from './client'
import type { PokemonSpecies } from '@/types/pokeapi'

export function getPokemonSpecies(name: string) {
  return fetchJson<PokemonSpecies>(`${POKEAPI_BASE}/pokemon-species/${name}`)
}
