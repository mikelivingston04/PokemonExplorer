import type { TypeDamageRelations } from '@/types/pokeapi'
import { ALL_TYPE_NAMES, type PokemonType } from '@/lib/constants/typeColors'

export type SingleMultiplier = 0 | 0.5 | 1 | 2
export type Multiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4

export function multiplierFor(attackingType: string, relations: TypeDamageRelations): SingleMultiplier {
  if (relations.no_damage_from.some((t) => t.name === attackingType)) return 0
  if (relations.half_damage_from.some((t) => t.name === attackingType)) return 0.5
  if (relations.double_damage_from.some((t) => t.name === attackingType)) return 2
  return 1
}

// Combines one or two defending types' damage relations into a single
// multiplier per attacking type — matches actual game mechanics (4x/0.25x
// stacking for dual-type weaknesses/resistances, 0x from either type dominates).
export function computeTypeEffectiveness(
  primary: TypeDamageRelations,
  secondary?: TypeDamageRelations,
): Record<PokemonType, Multiplier> {
  return Object.fromEntries(
    ALL_TYPE_NAMES.map((t) => {
      const primaryMultiplier = multiplierFor(t, primary)
      const secondaryMultiplier = secondary ? multiplierFor(t, secondary) : 1
      return [t, (primaryMultiplier * secondaryMultiplier) as Multiplier]
    }),
  ) as Record<PokemonType, Multiplier>
}

// Offense: what this type deals to others (double_damage_to/half_damage_to/no_damage_to) —
// distinct from multiplierFor/computeTypeEffectiveness, which answer the defensive question.
export function computeOffensiveEffectiveness(
  relations: TypeDamageRelations,
): Record<PokemonType, SingleMultiplier> {
  return Object.fromEntries(
    ALL_TYPE_NAMES.map((t) => {
      if (relations.no_damage_to.some((r) => r.name === t)) return [t, 0]
      if (relations.half_damage_to.some((r) => r.name === t)) return [t, 0.5]
      if (relations.double_damage_to.some((r) => r.name === t)) return [t, 2]
      return [t, 1]
    }),
  ) as Record<PokemonType, SingleMultiplier>
}

export const EFFECTIVENESS_BUCKETS: Multiplier[] = [4, 2, 1, 0.5, 0.25, 0]

export function bucketLabel(m: Multiplier): string {
  if (m === 0) return 'No effect'
  return `${m}×`
}
