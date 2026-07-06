import type { ChainLink, EvolutionDetail } from '@/types/pokeapi'
import { toDisplayName } from '@/lib/constants/nameOverrides'

export interface EvolutionNode {
  speciesName: string
  conditions: string[]
  children: EvolutionNode[]
}

export function flattenChain(chain: ChainLink): EvolutionNode {
  return {
    speciesName: chain.species.name,
    conditions: [],
    children: chain.evolves_to.map((child) => ({
      speciesName: child.species.name,
      // Many version-group-specific detail entries collapse to the same
      // human-readable string (e.g. every game's "high friendship" trigger) —
      // dedupe so branches like Sylveon don't repeat themselves.
      conditions: [...new Set(child.evolution_details.map(summarizeEvolutionDetail))],
      children: flattenChain(child).children,
    })),
  }
}

// Priority-ordered: most specific/common conditions first, generic fallback last.
export function summarizeEvolutionDetail(d: EvolutionDetail): string {
  if (d.trigger?.name === 'level-up' && d.min_level) {
    return `Level ${d.min_level}`
  }
  if (d.trigger?.name === 'trade') {
    if (d.held_item) return `Trade holding ${toDisplayName(d.held_item.name)}`
    return 'Trade'
  }
  if (d.trigger?.name === 'use-item' && d.item) {
    return `Use ${toDisplayName(d.item.name)}`
  }
  if (d.known_move) {
    return `Know move ${toDisplayName(d.known_move.name)}`
  }
  if (d.known_move_type) {
    return `Know a ${toDisplayName(d.known_move_type.name)}-type move`
  }
  if (d.min_happiness) {
    return `High friendship${d.time_of_day ? ` (${d.time_of_day})` : ''}`
  }
  if (d.min_affection) {
    return 'High affection'
  }
  if (d.min_beauty) {
    return 'High beauty'
  }
  if (d.location) {
    return `Level up near ${toDisplayName(d.location.name)}`
  }
  if (d.party_species) {
    return `Level up with ${toDisplayName(d.party_species.name)} in party`
  }
  if (d.trigger?.name === 'level-up') {
    return 'Level up'
  }
  return d.trigger ? toDisplayName(d.trigger.name) : 'Special condition'
}
