import type { ChainLink } from '@/types/pokeapi'
import type { EvolutionStage } from '@/lib/filterEngine/types'

// One chain response already contains every species in that family — walking
// it once yields stages for all of them, rather than needing a separate
// per-species lookup (which also 404s for alt-forms that share a base
// species' chain but aren't a species of their own, like "charizard-mega-x").
export function collectEvolutionStages(chain: ChainLink): Map<string, EvolutionStage> {
  const stages = new Map<string, EvolutionStage>()
  function walk(node: ChainLink, depth: number) {
    stages.set(node.species.name, depth === 0 ? 'basic' : depth === 1 ? 'stage1' : 'stage2')
    node.evolves_to.forEach((child) => walk(child, depth + 1))
  }
  walk(chain, 0)
  return stages
}
