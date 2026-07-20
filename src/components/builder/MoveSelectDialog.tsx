import { useMemo } from 'react'
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { useMove } from '@/lib/queries/useMove'
import { getEffectiveDamageClass, DAMAGE_CLASS_LABELS } from '@/lib/legacyDamageClass'
import { DEFAULT_VERSION_GROUP } from '@/lib/constants/versionGroups'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { TYPE_COLORS, isPokemonType } from '@/lib/constants/typeColors'
import type { PokemonMove } from '@/types/pokeapi'
import styles from './MoveSelectDialog.module.scss'

function MoveOption({ moveName, onSelect }: { moveName: string; onSelect: (name: string) => void }) {
  const { data: move } = useMove(moveName)
  const damageClass = move ? getEffectiveDamageClass(move) : undefined
  const typeColor = move && isPokemonType(move.type.name) ? TYPE_COLORS[move.type.name].bg : undefined

  return (
    <CommandItem value={toDisplayName(moveName)} onSelect={() => onSelect(moveName)} className={styles.option}>
      <div className={styles.optionHeader}>
        {damageClass && (
          <span className={styles.optionClass} data-class={damageClass.name}>
            {DAMAGE_CLASS_LABELS[damageClass.name] ?? damageClass.name}
          </span>
        )}
        <span className={styles.optionName} style={{ color: typeColor }}>
          {toDisplayName(moveName)}
        </span>
      </div>
      <div className={styles.optionStats}>
        <span>
          PWR <b>{move?.power ?? '—'}</b>
        </span>
        <span>
          ACC <b>{move?.accuracy ? `${move.accuracy}%` : '—'}</b>
        </span>
        <span>
          PP <b>{move?.pp ?? '—'}</b>
        </span>
      </div>
    </CommandItem>
  )
}

interface MoveSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pokemonMoves: PokemonMove[]
  onSelect: (moveName: string) => void
}

// Scoped to FireRed/LeafGreen for now — the same default every other page
// already uses, and a Pokémon's full movepool across every game would swamp
// this list far worse than the "too many moves" problem it's meant to fix.
export function MoveSelectDialog({ open, onOpenChange, pokemonMoves, onSelect }: MoveSelectDialogProps) {
  const learnableNames = useMemo(() => {
    const names = new Set<string>()
    for (const m of pokemonMoves) {
      const learnable = m.version_group_details.some((d) => d.version_group.name === DEFAULT_VERSION_GROUP)
      if (learnable) names.add(m.move.name)
    }
    return [...names].sort((a, b) => toDisplayName(a).localeCompare(toDisplayName(b)))
  }, [pokemonMoves])

  function handleSelect(name: string) {
    onSelect(name)
    onOpenChange(false)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Select a move"
      description="Search this Pokémon's FireRed/LeafGreen movepool"
    >
      <CommandInput placeholder="Search this Pokémon's moves..." />
      <CommandList>
        <CommandEmpty>No moves found.</CommandEmpty>
        {learnableNames.map((name) => (
          <MoveOption key={name} moveName={name} onSelect={handleSelect} />
        ))}
      </CommandList>
    </CommandDialog>
  )
}
