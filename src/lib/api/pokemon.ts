import { POKEAPI_BASE, fetchJson } from './client'
import type { Pokemon, LocationAreaEncounter } from '@/types/pokeapi'

export function getPokemon(name: string) {
  return fetchJson<Pokemon>(`${POKEAPI_BASE}/pokemon/${name}`)
}

export function getPokemonEncounters(idOrName: number | string) {
  return fetchJson<LocationAreaEncounter[]>(`${POKEAPI_BASE}/pokemon/${idOrName}/encounters`)
}
