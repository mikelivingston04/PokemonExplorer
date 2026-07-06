export const POKEAPI_BASE = 'https://pokeapi.co/api/v2'

export class PokeApiError extends Error {
  status: number
  constructor(status: number, url: string) {
    super(`PokéAPI request failed (${status}): ${url}`)
    this.status = status
  }
}

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new PokeApiError(res.status, url)
  }
  return res.json() as Promise<T>
}

// Every PokéAPI resource URL ends in /{id}/ — this pulls the numeric id out
// of a reference like https://pokeapi.co/api/v2/machine/754/.
export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  if (!match) throw new Error(`Could not extract id from url: ${url}`)
  return Number(match[1])
}
