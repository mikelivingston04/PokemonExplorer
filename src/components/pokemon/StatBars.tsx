import type { PokemonStat } from '@/types/pokeapi'
import { STAT_LABELS } from '@/lib/constants/stats'
import styles from './StatBars.module.scss'

// Theoretical max base stat across all Pokémon (Blissey's HP / Shuckle's Def) —
// used purely to scale bar width consistently, not a claim about the true ceiling.
const MAX_BASE_STAT = 255
// Highest realistic base stat total (e.g. Arceus/Slaking-tier) — same purpose
// for the Total row's bar, just on its own larger scale.
const MAX_TOTAL = 780

function StatRow({
  label,
  value,
  pct,
  barColor,
  bold,
}: {
  label: string
  value: number
  pct: number
  barColor?: string
  bold?: boolean
}) {
  return (
    <div className={styles.row}>
      <span className={bold ? styles.labelBold : styles.label}>{label}</span>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <span className={styles.value}>{value}</span>
    </div>
  )
}

export function StatBars({ stats, barColor }: { stats: PokemonStat[]; barColor?: string }) {
  const total = stats.reduce((sum, s) => sum + s.base_stat, 0)

  return (
    <div className={styles.list}>
      {stats.map((stat) => (
        <StatRow
          key={stat.stat.name}
          label={STAT_LABELS[stat.stat.name] ?? stat.stat.name}
          value={stat.base_stat}
          pct={Math.min(100, (stat.base_stat / MAX_BASE_STAT) * 100)}
          barColor={barColor}
        />
      ))}
      <div className={styles.totalRow}>
        <StatRow
          label="Total"
          value={total}
          pct={Math.min(100, (total / MAX_TOTAL) * 100)}
          barColor={barColor}
          bold
        />
      </div>
    </div>
  )
}
