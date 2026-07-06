import { EFFECTIVENESS_BUCKETS, bucketLabel, type Multiplier } from '@/lib/typeEffectiveness'
import type { PokemonType } from '@/lib/constants/typeColors'
import { TypeBadge } from '@/components/pokemon/TypeBadge'

interface TypeEffectivenessChartProps {
  multipliers: Record<PokemonType, Multiplier>
  // Neutral (1x) matchups are rarely useful to scan — hide by default.
  showNeutral?: boolean
}

export function TypeEffectivenessChart({ multipliers, showNeutral = false }: TypeEffectivenessChartProps) {
  const buckets = EFFECTIVENESS_BUCKETS.filter((m) => m !== 1 || showNeutral)
    .map((m) => ({
      multiplier: m,
      types: (Object.keys(multipliers) as PokemonType[]).filter((t) => multipliers[t] === m),
    }))
    .filter((b) => b.types.length > 0)

  if (buckets.length === 0) {
    return <p className="text-sm text-muted-foreground">No notable matchups.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {buckets.map((bucket) => (
        <div key={bucket.multiplier} className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
            {bucketLabel(bucket.multiplier)}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {bucket.types.map((t) => (
              <TypeBadge key={t} type={t} linkTo />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
