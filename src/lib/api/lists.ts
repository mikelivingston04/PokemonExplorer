import { POKEAPI_BASE, fetchJson } from './client'
import type { PokemonListResponse } from '@/types/pokeapi'

export function getAllPokemonNames() {
  return fetchJson<PokemonListResponse>(`${POKEAPI_BASE}/pokemon?limit=100000`)
}

export function getAllMoveNames() {
  return fetchJson<PokemonListResponse>(`${POKEAPI_BASE}/move?limit=100000`)
}

export function getAllTypeNames() {
  return fetchJson<PokemonListResponse>(`${POKEAPI_BASE}/type?limit=100000`)
}
