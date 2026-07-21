import type { SearchIndexEntry } from '@/lib/queries/useSearchIndex'
import { useMove } from '@/lib/queries/useMove'
import { useType } from '@/lib/queries/useType'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { TYPE_ICONS } from '@/lib/constants/typeIcons'
import { isPokemonType, TYPE_COLORS } from '@/lib/constants/typeColors'
import styles from './SearchResultTiles.module.scss'

// Presentational-only content for each result category — deliberately has no
// opinion on what wraps it (a cmdk CommandItem in the ⌘K modal, a plain Link
// in the inline search-first results). Callers own navigation/selection.
// Pokémon results use PokemonCard instead (see SearchResultsPanel) — the
// full "taller card" look, not a short tile.

export function MoveTileContent({ entry }: { entry: SearchIndexEntry }) {
  const { data: move } = useMove(entry.name)
  const type = move?.type.name
  const Icon = type && isPokemonType(type) ? TYPE_ICONS[type] : null
  const iconColor = type && isPokemonType(type) ? TYPE_COLORS[type].bg : undefined

  return (
    <>
      <span className={styles.moveIcon}>
        {Icon && <Icon className={styles.moveIconSvg} style={{ color: iconColor }} />}
      </span>
      <div className={styles.tileText}>
        <div className={styles.moveNameRow}>
          <span className={styles.tileName}>{entry.displayName}</span>
          {type && <TypeBadge type={type} />}
        </div>
        {move && (
          <span className={styles.tileMeta}>
            Power: {move.power ?? '—'} · Acc: {move.accuracy ?? '—'}
          </span>
        )}
      </div>
    </>
  )
}

export function TypeTileContent({ entry }: { entry: SearchIndexEntry }) {
  const { data: type } = useType(entry.name)
  const strongAgainst = type?.damage_relations.double_damage_to.slice(0, 3) ?? []

  return (
    <>
      <TypeBadge type={entry.name} className={styles.typeTileBadge} />
      {strongAgainst.length > 0 && (
        <div className={styles.tileText}>
          <span className={styles.strongAgainstLabel}>Strong against</span>
          <div className={styles.strongAgainstBadges}>
            {strongAgainst.map((t) => (
              <TypeBadge key={t.name} type={t.name} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
