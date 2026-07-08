import { ChevronDownIcon } from 'lucide-react'
import { TYPE_COLORS, type PokemonType } from '@/lib/constants/typeColors'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { cn } from '@/lib/utils'
import type { TypeBreakdownEntry } from '@/lib/queries/useCompatibleTypeBreakdown'
import styles from './TypeCompatibilityList.module.scss'

interface TypeCompatibilityListProps {
  entries: TypeBreakdownEntry[]
  expanded: PokemonType | null
  onToggle: (type: PokemonType) => void
}

export function TypeCompatibilityList({ entries, expanded, onToggle }: TypeCompatibilityListProps) {
  return (
    <div className={styles.list}>
      {entries.map(({ type, pokemon }) => {
        const colors = TYPE_COLORS[type]
        const active = expanded === type
        return (
          <button
            key={type}
            type="button"
            onClick={() => onToggle(type)}
            aria-expanded={active}
            className={styles.pill}
            style={{
              backgroundColor: active ? colors.bg : 'transparent',
              color: active ? colors.fg : colors.bg,
              borderColor: colors.bg,
            }}
          >
            <span>
              {toDisplayName(type)} <span className={styles.count}>({pokemon.length})</span>
            </span>
            <ChevronDownIcon className={cn(styles.chevron, active && styles.chevronOpen)} />
          </button>
        )
      })}
    </div>
  )
}
