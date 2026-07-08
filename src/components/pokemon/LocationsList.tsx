import { usePokemonEncounters } from '@/lib/queries/usePokemon'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { Skeleton } from '@/components/ui/skeleton'
import { DEFAULT_VERSION_GROUP } from '@/lib/constants/versionGroups'
import styles from './LocationsList.module.scss'

// FireRed/LeafGreen ship as a single "version" pair sharing one version_group;
// PokéAPI's encounter data is keyed by version (e.g. "firered"), not version_group.
const DEFAULT_VERSIONS = ['firered', 'leafgreen']

export function LocationsList({ pokemonId }: { pokemonId: number }) {
  const { data, isLoading } = usePokemonEncounters(pokemonId)

  if (isLoading) {
    return (
      <div className={styles.skeletonList}>
        <Skeleton style={{ height: '2rem', width: '100%' }} />
        <Skeleton style={{ height: '2rem', width: '100%' }} />
        <Skeleton style={{ height: '2rem', width: '75%' }} />
      </div>
    )
  }

  const relevant = (data ?? [])
    .map((entry) => ({
      locationArea: entry.location_area.name,
      versions: entry.version_details.filter((v) => DEFAULT_VERSIONS.includes(v.version.name)),
    }))
    .filter((entry) => entry.versions.length > 0)

  if (relevant.length === 0) {
    return (
      <p className={styles.empty}>
        Not obtainable by catching in {toDisplayName(DEFAULT_VERSION_GROUP)}. It may evolve from
        another Pokémon or require trading/breeding instead.
      </p>
    )
  }

  return (
    <ul className={styles.list}>
      {relevant.map((entry) => (
        <li key={entry.locationArea} className={styles.item}>
          {toDisplayName(entry.locationArea)}
        </li>
      ))}
    </ul>
  )
}
