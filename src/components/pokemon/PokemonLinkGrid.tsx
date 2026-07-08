import { Link } from 'react-router-dom'
import type { NamedApiResource } from '@/types/pokeapi'
import { usePokemon } from '@/lib/queries/usePokemon'
import { useInfiniteReveal } from '@/lib/useInfiniteReveal'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import styles from './PokemonLinkGrid.module.scss'

const PAGE_SIZE = 24

function PokemonLinkTile({ name }: { name: string }) {
  const { data: pokemon, isLoading } = usePokemon(name)
  const sprite = pokemon?.sprites.front_default

  return (
    <Link to={`/pokemon/${name}`} className={styles.tile}>
      {isLoading ? (
        <Skeleton style={{ height: '2.5rem', width: '2.5rem' }} />
      ) : (
        <SpriteImage src={sprite} alt="" className={styles.sprite} />
      )}
      <span className={styles.name}>{toDisplayName(name)}</span>
    </Link>
  )
}

interface PokemonLinkGridProps {
  pokemon: NamedApiResource[]
  // When set, the grid becomes its own fixed-height scroll pane with
  // infinite scroll bound to that pane instead of the whole page — for
  // layouts where sibling content must stay in place while only this grid
  // scrolls. Omit for normal whole-page infinite scroll.
  scrollPaneClassName?: string
}

export function PokemonLinkGrid({ pokemon, scrollPaneClassName }: PokemonLinkGridProps) {
  const { visible, scrollRef, sentinelRef, hasMore } = useInfiniteReveal(pokemon, PAGE_SIZE)

  if (pokemon.length === 0) {
    return <p className={styles.empty}>No Pokémon found.</p>
  }

  const content = (
    <div className={styles.content}>
      <div className={styles.grid}>
        {visible.map((p) => (
          <PokemonLinkTile key={p.name} name={p.name} />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} aria-hidden className={styles.sentinel} />}
    </div>
  )

  if (!scrollPaneClassName) return content

  return (
    <div ref={scrollRef} className={cn(styles.scrollPane, scrollPaneClassName)}>
      {content}
    </div>
  )
}
