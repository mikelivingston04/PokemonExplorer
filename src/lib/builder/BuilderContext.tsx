import { useEffect, useState, type ReactNode } from 'react'
import { BuilderContext, MOVE_SLOT_COUNT } from '@/lib/builder/context'

const TEAM_STORAGE_KEY = 'pokemon-explorer:builder-team'
const MOVES_STORAGE_KEY = 'pokemon-explorer:builder-moves'

function readStoredTeam(): string[] {
  try {
    const raw = window.localStorage.getItem(TEAM_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function readStoredMoves(): Record<string, (string | null)[]> {
  try {
    const raw = window.localStorage.getItem(MOVES_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, (string | null)[]>) : {}
  } catch {
    return {}
  }
}

function emptySlots(): (string | null)[] {
  return Array.from({ length: MOVE_SLOT_COUNT }, () => null)
}

// Just a holding pen for now — add/remove by Pokémon name, persisted to
// localStorage so the team survives a refresh. No team-size cap or ordered
// slot structure yet; move selections are keyed by Pokémon name too.
export function BuilderProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<string[]>(readStoredTeam)
  const [moveSlots, setMoveSlots] = useState<Record<string, (string | null)[]>>(readStoredMoves)

  useEffect(() => {
    window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team))
  }, [team])

  useEffect(() => {
    window.localStorage.setItem(MOVES_STORAGE_KEY, JSON.stringify(moveSlots))
  }, [moveSlots])

  function addToBuilder(name: string) {
    setTeam((current) => (current.includes(name) ? current : [...current, name]))
  }

  function removeFromBuilder(name: string) {
    setTeam((current) => current.filter((n) => n !== name))
    setMoveSlots((current) => {
      if (!(name in current)) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function isInBuilder(name: string) {
    return team.includes(name)
  }

  function getMoves(pokemonName: string) {
    return moveSlots[pokemonName] ?? emptySlots()
  }

  function setMove(pokemonName: string, slotIndex: number, moveName: string | null) {
    setMoveSlots((current) => {
      const slots = current[pokemonName] ?? emptySlots()
      const next = [...slots]
      next[slotIndex] = moveName
      return { ...current, [pokemonName]: next }
    })
  }

  return (
    <BuilderContext.Provider
      value={{ team, isInBuilder, addToBuilder, removeFromBuilder, getMoves, setMove }}
    >
      {children}
    </BuilderContext.Provider>
  )
}
