import { EFFECTIVENESS_BUCKETS, perspectiveLabel, type EffectivenessPerspective, type Multiplier } from '@/lib/typeEffectiveness'
import type { PokemonType } from '@/lib/constants/typeColors'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import styles from './TypeEffectivenessChart.module.scss'

interface TypeEffectivenessChartProps {
  multipliers: Record<PokemonType, Multiplier>
  // 'defense' = "this takes N× damage from...", 'offense' = "this deals N×
  // damage to..." — same multipliers, opposite plain-language framing.
  perspective: EffectivenessPerspective
  // Neutral (1x) matchups are rarely useful to scan — hide by default.
  showNeutral?: boolean
}

export function TypeEffectivenessChart({ multipliers, perspective, showNeutral = false }: TypeEffectivenessChartProps) {
  const buckets = EFFECTIVENESS_BUCKETS.filter((m) => m !== 1 || showNeutral)
    .map((m) => ({
      multiplier: m,
      types: (Object.keys(multipliers) as PokemonType[]).filter((t) => multipliers[t] === m),
    }))
    .filter((b) => b.types.length > 0)

  if (buckets.length === 0) {
    return <p className={styles.empty}>No notable matchups.</p>
  }

  return (
    <div className={styles.list}>
      {buckets.map((bucket) => (
        <div key={bucket.multiplier} className={styles.row}>
          <span className={styles.label}>{perspectiveLabel(bucket.multiplier, perspective)}</span>
          <div className={styles.badges}>
            {bucket.types.map((t) => (
              <TypeBadge key={t} type={t} linkTo />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
