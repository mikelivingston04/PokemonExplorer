import { Link } from 'react-router-dom'
import { usePokemon } from '@/lib/queries/usePokemon'
import { usePokemonSpecies } from '@/lib/queries/usePokemonSpecies'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { generationLabel } from '@/lib/constants/generations'
import { TYPE_COLORS, isPokemonType } from '@/lib/constants/typeColors'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import styles from './PokemonCard.module.scss'

export function PokemonCard({ name }: { name: string }) {
  const { data: pokemon, isLoading } = usePokemon(name)
  // Alt-forms (e.g. "charizard-mega-x") aren't species themselves — the
  // species resource always lives under the base name in pokemon.species.
  const { data: species } = usePokemonSpecies(pokemon?.species.name)

  if (isLoading || !pokemon) {
    return (
      <div className={styles.skeletonCard}>
        <Skeleton style={{ height: 'var(--sprite-size-grid)', width: 'var(--sprite-size-grid)' }} />
        <Skeleton style={{ height: '1rem', width: '5rem' }} />
      </div>
    )
  }

  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default
  const primaryType = pokemon.types.find((t) => t.slot === 1)?.type.name
  const glowColor = primaryType && isPokemonType(primaryType) ? TYPE_COLORS[primaryType].bg : undefined

  return (
    <Link to={`/pokemon/${pokemon.name}`} className={styles.card}>
      <span className={styles.dexNumber}>#{String(pokemon.id).padStart(3, '0')}</span>
      <div className={styles.spriteWrapper}>
        {glowColor && <div className={styles.glow} style={{ backgroundColor: glowColor }} />}
        <SpriteImage src={sprite} alt="" className={styles.sprite} />
      </div>
      <span className={styles.name}>{toDisplayName(pokemon.name)}</span>
      <div className={styles.badges}>
        {pokemon.types.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
        {species && <Badge variant="secondary">{generationLabel(species.generation.name)}</Badge>}
      </div>
    </Link>
  )
}
