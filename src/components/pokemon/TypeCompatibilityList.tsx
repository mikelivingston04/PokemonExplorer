import { ChevronDownIcon } from 'lucide-react'
import { TYPE_COLORS, type PokemonType } from '@/lib/constants/typeColors'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { cn } from '@/lib/utils'
import type { TypeBreakdownEntry } from '@/lib/queries/useCompatibleTypeBreakdown'

interface TypeCompatibilityListProps {
  entries: TypeBreakdownEntry[]
  expanded: PokemonType | null
  onToggle: (type: PokemonType) => void
}

export function TypeCompatibilityList({ entries, expanded, onToggle }: TypeCompatibilityListProps) {
  return (
    <div className="flex flex-col gap-2">
      {entries.map(({ type, pokemon }) => {
        const colors = TYPE_COLORS[type]
        const active = expanded === type
        return (
          <button
            key={type}
            type="button"
            onClick={() => onToggle(type)}
            aria-expanded={active}
            className="flex items-center justify-between gap-2 rounded-lg border-2 px-3 py-1.5 text-sm font-medium transition-colors"
            style={{
              backgroundColor: active ? colors.bg : 'transparent',
              color: active ? colors.fg : colors.bg,
              borderColor: colors.bg,
            }}
          >
            <span>
              {toDisplayName(type)} <span className="tabular-nums opacity-80">({pokemon.length})</span>
            </span>
            <ChevronDownIcon className={cn('size-4 shrink-0 transition-transform', active && 'rotate-180')} />
          </button>
        )
      })}
    </div>
  )
}
