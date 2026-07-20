import { Link } from 'react-router-dom'
import { Trash2Icon } from 'lucide-react'
import { usePokemon } from '@/lib/queries/usePokemon'
import { useBuilder } from '@/lib/builder/useBuilder'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { MoveSlot } from '@/components/builder/MoveSlot'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { STAT_LABELS } from '@/lib/constants/stats'
import styles from './BuilderPokemonRow.module.scss'

export function BuilderPokemonRow({ name, onRemove }: { name: string; onRemove: () => void }) {
  const { data: pokemon, isLoading } = usePokemon(name)
  const { getMoves, setMove } = useBuilder()

  if (isLoading || !pokemon) {
    return <Skeleton className={styles.loadingRow} />
  }

  const artwork = pokemon.sprites.other?.['official-artwork']?.front_default
  const displayName = toDisplayName(pokemon.name)

  return (
    <div className={styles.row}>
      <div className={styles.top}>
        <Link to={`/pokemon/${pokemon.name}`} className={styles.identity}>
          <SpriteImage src={artwork ?? pokemon.sprites.front_default} alt="" className={styles.sprite} />
          <div className={styles.identityText}>
            <span className={styles.dexNumber}>#{String(pokemon.id).padStart(3, '0')}</span>
            <span className={styles.name}>{displayName}</span>
            <div className={styles.typeRow}>
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
          </div>
        </Link>

        <div className={styles.stats}>
          {pokemon.stats.map((s) => (
            <div key={s.stat.name} className={styles.statTile}>
              <span className={styles.statLabel}>{STAT_LABELS[s.stat.name] ?? s.stat.name}</span>
              <span className={styles.statValue}>{s.base_stat}</span>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${displayName} from Builder`}
          onClick={onRemove}
          className={styles.removeButton}
        >
          <Trash2Icon />
        </Button>
      </div>

      <div className={styles.moveSlots}>
        {getMoves(pokemon.name).map((moveName, i) => (
          <MoveSlot
            key={i}
            moveName={moveName}
            pokemonMoves={pokemon.moves}
            onSelect={(selected) => setMove(pokemon.name, i, selected)}
            onClear={() => setMove(pokemon.name, i, null)}
          />
        ))}
      </div>
    </div>
  )
}
