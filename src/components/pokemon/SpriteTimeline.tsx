import { buildSpriteTimeline } from '@/lib/spriteTimeline'
import type { PokemonSprites } from '@/types/pokeapi'
import { cn } from '@/lib/utils'
import styles from './SpriteTimeline.module.scss'

export function SpriteTimeline({ sprites, debutGeneration }: { sprites: PokemonSprites; debutGeneration?: string }) {
  const entries = buildSpriteTimeline(sprites, debutGeneration)
  if (entries.length === 0) return null

  return (
    <div className={styles.row}>
      {entries.map((entry) => (
        <div key={entry.generation} className={cn(styles.card, entry.isFireRed && styles.cardFireRed)}>
          {/* Literal in-game sprites vary a lot in resolution/quality release
              to release — plain <img> rather than SpriteImage since there's
              no single fixed size to fit them all into cleanly. */}
          <img src={entry.sprite} alt="" className={styles.sprite} />
          <div className={styles.labels}>
            <span className={styles.generationLabel}>{entry.generationLabel}</span>
            <span className={styles.versionLabel}>{entry.versionLabel}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
