import type { PokemonStat } from '@/types/pokeapi'

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

// Theoretical max base stat across all Pokémon (Blissey's HP / Shuckle's Def) —
// used purely to scale bar width consistently, not a claim about the true ceiling.
const MAX_BASE_STAT = 255

export function StatBars({ stats }: { stats: PokemonStat[] }) {
  const total = stats.reduce((sum, s) => sum + s.base_stat, 0)

  return (
    <div className="flex flex-col gap-2.5">
      {stats.map((stat) => {
        const pct = Math.min(100, (stat.base_stat / MAX_BASE_STAT) * 100)
        return (
          <div key={stat.stat.name} className="grid grid-cols-[6rem_2.5rem_1fr] items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {STAT_LABELS[stat.stat.name] ?? stat.stat.name}
            </span>
            <span className="text-right text-sm font-medium tabular-nums">{stat.base_stat}</span>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
      <div className="grid grid-cols-[6rem_2.5rem_1fr] items-center gap-3 pt-1">
        <span className="text-sm font-medium">Total</span>
        <span className="text-right text-sm font-semibold tabular-nums">{total}</span>
        <span />
      </div>
    </div>
  )
}
