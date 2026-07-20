import { useState } from 'react'
import { PlusIcon, XIcon } from 'lucide-react'
import { useMove } from '@/lib/queries/useMove'
import { getEffectiveDamageClass, DAMAGE_CLASS_LABELS } from '@/lib/legacyDamageClass'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { TYPE_COLORS, isPokemonType } from '@/lib/constants/typeColors'
import { MoveSelectDialog } from '@/components/builder/MoveSelectDialog'
import type { PokemonMove } from '@/types/pokeapi'
import styles from './MoveSlot.module.scss'

interface MoveSlotProps {
  moveName: string | null
  pokemonMoves: PokemonMove[]
  onSelect: (moveName: string) => void
  onClear: () => void
}

export function MoveSlot({ moveName, pokemonMoves, onSelect, onClear }: MoveSlotProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: move } = useMove(moveName ?? undefined)
  const damageClass = move ? getEffectiveDamageClass(move) : undefined
  const typeColor = move && isPokemonType(move.type.name) ? TYPE_COLORS[move.type.name].bg : undefined

  return (
    <>
      {moveName ? (
        <div className={styles.filled}>
          <button type="button" className={styles.filledMain} onClick={() => setDialogOpen(true)}>
            <div className={styles.filledHeader}>
              {damageClass && (
                <span className={styles.filledClass} data-class={damageClass.name}>
                  {DAMAGE_CLASS_LABELS[damageClass.name] ?? damageClass.name}
                </span>
              )}
              <span className={styles.filledName} style={{ color: typeColor }}>
                {toDisplayName(moveName)}
              </span>
            </div>
            <div className={styles.filledStats}>
              <div className={styles.filledStat}>
                <span className={styles.filledStatLabel}>Pwr</span>
                <span>{move?.power ?? '—'}</span>
              </div>
              <div className={styles.filledStat}>
                <span className={styles.filledStatLabel}>Acc</span>
                <span>{move?.accuracy ? `${move.accuracy}%` : '—'}</span>
              </div>
              <div className={styles.filledStat}>
                <span className={styles.filledStatLabel}>PP</span>
                <span>{move?.pp ?? '—'}</span>
              </div>
            </div>
          </button>
          <button
            type="button"
            className={styles.filledClear}
            onClick={onClear}
            aria-label={`Remove ${toDisplayName(moveName)}`}
          >
            <XIcon />
          </button>
        </div>
      ) : (
        <button type="button" className={styles.empty} onClick={() => setDialogOpen(true)}>
          <span className={styles.emptyIcon}>
            <PlusIcon />
          </span>
          <span className={styles.emptyLabel}>Select move</span>
        </button>
      )}

      <MoveSelectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pokemonMoves={pokemonMoves}
        onSelect={onSelect}
      />
    </>
  )
}
