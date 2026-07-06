import { POKEAPI_BASE, fetchJson } from './client'
import type { Machine } from '@/types/pokeapi'

export function getMachine(id: number) {
  return fetchJson<Machine>(`${POKEAPI_BASE}/machine/${id}`)
}
