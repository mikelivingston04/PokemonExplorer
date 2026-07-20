import { createContext } from 'react'

export const MOVE_SLOT_COUNT = 4
// A real team caps at 6 — the Builder still lets you hold more than that as
// overflow/bench space, it just stops counting past the 6th for anything
// team-wide (type coverage, the eventual "your team" summary, etc).
export const TEAM_CAP = 6

export interface BuilderContextValue {
  team: string[]
  isInBuilder: (name: string) => boolean
  addToBuilder: (name: string) => void
  removeFromBuilder: (name: string) => void
  // Move slots are addressed by Pokémon name, not team position — simplest
  // fit for "just a holding pen" with no notion of ordered team slots yet.
  getMoves: (pokemonName: string) => (string | null)[]
  setMove: (pokemonName: string, slotIndex: number, moveName: string | null) => void
}

export const BuilderContext = createContext<BuilderContextValue | null>(null)
