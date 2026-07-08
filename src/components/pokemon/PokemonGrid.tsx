import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { useInfiniteReveal } from '@/lib/useInfiniteReveal'
import styles from './PokemonGrid.module.scss'

const PAGE_SIZE = 24

interface PokemonGridProps {
  names: string[]
  isLoading: boolean
  checkingStatus?: string
}

export function PokemonGrid({ names, isLoading, checkingStatus }: PokemonGridProps) {
  const { visible, sentinelRef, hasMore } = useInfiniteReveal(names, PAGE_SIZE)

  if (isLoading) {
    return (
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonSprite} />
            <div className={styles.skeletonName} />
          </div>
        ))}
      </div>
    )
  }

  if (names.length === 0) {
    return (
      <p className={styles.empty}>
        {checkingStatus ?? 'No Pokémon match these filters. Try loosening a constraint.'}
      </p>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.count}>
        {names.length} Pokémon
        {checkingStatus && <span> — {checkingStatus}</span>}
      </p>
      <div className={styles.grid}>
        {visible.map((name) => (
          <PokemonCard key={name} name={name} />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} aria-hidden className={styles.sentinel} />}
    </div>
  )
}
