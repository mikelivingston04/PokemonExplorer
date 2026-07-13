import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TYPE_COLORS, type PokemonType } from '@/lib/constants/typeColors'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { cn } from '@/lib/utils'
import type { TypeBreakdownEntry } from '@/lib/queries/useCompatibleTypeBreakdown'
import styles from './TypeFilterDropdown.module.scss'

interface TypeFilterDropdownProps {
  entries: TypeBreakdownEntry[]
  selected: PokemonType[]
  onChange: (next: PokemonType[]) => void
}

function triggerLabel(selected: PokemonType[]) {
  if (selected.length === 0) return 'All Types'
  if (selected.length === 1) return toDisplayName(selected[0])
  return `${selected.length} Types`
}

// The actual checkbox rows — shared between the mobile popover (below) and
// the always-visible desktop column (see TypeFilterColumn), so the two
// surfaces can't drift out of sync with each other.
export function TypeCheckboxList({ entries, selected, onChange }: TypeFilterDropdownProps) {
  function toggle(type: PokemonType) {
    onChange(selected.includes(type) ? selected.filter((t) => t !== type) : [...selected, type])
  }

  return (
    <div className={styles.list}>
      {entries.map(({ type, pokemon }) => {
        const active = selected.includes(type)
        const colors = TYPE_COLORS[type]
        return (
          <button
            key={type}
            type="button"
            onClick={() => toggle(type)}
            aria-pressed={active}
            className={styles.option}
          >
            <span
              className={cn(styles.checkbox, active && styles.checkboxChecked)}
              style={active ? { backgroundColor: colors.bg, borderColor: colors.bg } : undefined}
            >
              {active && <CheckIcon className={styles.checkIcon} />}
            </span>
            <span className={styles.optionLabel}>{toDisplayName(type)}</span>
            <span className={styles.optionCount}>{pokemon.length}</span>
          </button>
        )
      })}
    </div>
  )
}

// Mobile: a compact trigger that opens the checklist in a popover.
export function TypeFilterDropdown({ entries, selected, onChange }: TypeFilterDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger className={styles.trigger}>
        <span className={styles.triggerLabel}>{triggerLabel(selected)}</span>
        <ChevronDownIcon className={styles.triggerIcon} />
      </PopoverTrigger>
      <PopoverContent align="start" className={styles.content}>
        <TypeCheckboxList entries={entries} selected={selected} onChange={onChange} />
      </PopoverContent>
    </Popover>
  )
}

// Desktop: the same checklist, but as a permanent column — no dropdown
// needed since there's room to just show it.
export function TypeFilterColumn({ entries, selected, onChange }: TypeFilterDropdownProps) {
  return (
    <div className={styles.column}>
      <TypeCheckboxList entries={entries} selected={selected} onChange={onChange} />
    </div>
  )
}
