import type { ChainLink } from '@/types/pokeapi'
import type { EvolutionStage } from '@/lib/filterEngine/types'

export function findEvolutionStage(chain: ChainLink, speciesName: string): EvolutionStage | undefined {
  function walk(node: ChainLink, depth: number): EvolutionStage | undefined {
    if (node.species.name === speciesName) {
      if (depth === 0) return 'basic'
      if (depth === 1) return 'stage1'
      return 'stage2' // depth 2+ — no mainline chain goes deeper
    }
    for (const child of node.evolves_to) {
      const found = walk(child, depth + 1)
      if (found) return found
    }
    return undefined
  }
  return walk(chain, 0)
}
