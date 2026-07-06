import { usePokemonEncounters } from '@/lib/queries/usePokemon'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { Skeleton } from '@/components/ui/skeleton'
import { DEFAULT_VERSION_GROUP } from '@/lib/constants/versionGroups'

// FireRed/LeafGreen ship as a single "version" pair sharing one version_group;
// PokéAPI's encounter data is keyed by version (e.g. "firered"), not version_group.
const DEFAULT_VERSIONS = ['firered', 'leafgreen']

export function LocationsList({ pokemonId }: { pokemonId: number }) {
  const { data, isLoading } = usePokemonEncounters(pokemonId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
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
      <p className="text-sm text-muted-foreground">
        Not obtainable by catching in {toDisplayName(DEFAULT_VERSION_GROUP)}. It may evolve from
        another Pokémon or require trading/breeding instead.
      </p>
    )
  }

  return (
    <ul className="flex flex-col divide-y">
      {relevant.map((entry) => (
        <li key={entry.locationArea} className="py-2 text-sm">
          {toDisplayName(entry.locationArea)}
        </li>
      ))}
    </ul>
  )
}
