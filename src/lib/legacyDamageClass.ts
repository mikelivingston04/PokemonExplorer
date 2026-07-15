import type { Move } from '@/types/pokeapi'

// Move category (Physical vs. Special) wasn't a per-move property until
// Generation IV — before that, it was determined entirely by the move's
// TYPE. FireRed/LeafGreen are Generation III, so any move that existed by
// then actually used its type's category in that game, not whatever
// PokeAPI's single `damage_class` field reports (which is always the
// current, post-Gen-IV classification — e.g. Shadow Ball shows as Special,
// but every Ghost-type move was Physical in FireRed).
const PRE_SPLIT_GENERATIONS = new Set(['generation-i', 'generation-ii', 'generation-iii'])

// The complete Gen I–III type roster (everything except Fairy, which didn't
// exist yet) split into the two old categories.
const LEGACY_PHYSICAL_TYPES = new Set([
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
])
const LEGACY_SPECIAL_TYPES = new Set(['fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark'])

export interface EffectiveDamageClass {
  name: string
  isLegacyOverride: boolean
}

// Status moves don't use Attack/Defense/Special stats regardless of era, so
// there's nothing to reclassify — the override only matters for moves that
// actually deal damage.
export function getEffectiveDamageClass(move: Move): EffectiveDamageClass {
  const current = move.damage_class.name
  if (current === 'status' || !PRE_SPLIT_GENERATIONS.has(move.generation.name)) {
    return { name: current, isLegacyOverride: false }
  }

  const type = move.type.name
  const legacyName = LEGACY_PHYSICAL_TYPES.has(type) ? 'physical' : LEGACY_SPECIAL_TYPES.has(type) ? 'special' : null
  if (!legacyName || legacyName === current) {
    return { name: current, isLegacyOverride: false }
  }
  return { name: legacyName, isLegacyOverride: true }
}
