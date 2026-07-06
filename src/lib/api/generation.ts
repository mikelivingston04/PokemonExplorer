import { POKEAPI_BASE, fetchJson } from './client'
import type { Generation } from '@/types/pokeapi'

export function getGeneration(id: number) {
  return fetchJson<Generation>(`${POKEAPI_BASE}/generation/${id}`)
}
