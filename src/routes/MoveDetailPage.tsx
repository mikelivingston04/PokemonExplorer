import { useParams } from 'react-router-dom'
import { useMove } from '@/lib/queries/useMove'
import { useTmNumber } from '@/lib/queries/useTmNumber'
import { DEFAULT_VERSION_GROUP } from '@/lib/constants/versionGroups'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { PokemonLinkGrid } from '@/components/pokemon/PokemonLinkGrid'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const DAMAGE_CLASS_LABELS: Record<string, string> = {
  physical: 'Physical',
  special: 'Special',
  status: 'Status',
}

export function MoveDetailPage() {
  const { name } = useParams<{ name: string }>()
  const { data: move, isLoading, isError } = useMove(name)
  const { tmName, isLoading: tmLoading, hasNoMachine } = useTmNumber(name, DEFAULT_VERSION_GROUP)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (isError || !move) {
    return <p className="text-sm text-destructive">Couldn't find a move named "{name}".</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">{toDisplayName(move.name)}</h1>
        <div className="flex flex-wrap items-center gap-1.5">
          <TypeBadge type={move.type.name} linkTo />
          <Badge variant="secondary">
            {DAMAGE_CLASS_LABELS[move.damage_class.name] ?? move.damage_class.name}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-lg border p-4 sm:max-w-md">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Power</span>
          <span className="text-lg font-semibold tabular-nums">{move.power ?? '—'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Accuracy</span>
          <span className="text-lg font-semibold tabular-nums">
            {move.accuracy ? `${move.accuracy}%` : '—'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">PP</span>
          <span className="text-lg font-semibold tabular-nums">{move.pp ?? '—'}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          TM Info — {toDisplayName(DEFAULT_VERSION_GROUP)}
        </h2>
        {tmLoading ? (
          <Skeleton className="h-8 w-40" />
        ) : hasNoMachine ? (
          <p className="text-sm text-muted-foreground">
            Not available as a TM/HM in {toDisplayName(DEFAULT_VERSION_GROUP)}.
          </p>
        ) : (
          <Badge className="w-fit text-sm">{tmName?.toUpperCase()}</Badge>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Compatible Pokémon ({move.learned_by_pokemon.length})
        </h2>
        <PokemonLinkGrid pokemon={move.learned_by_pokemon} />
      </div>
    </div>
  )
}
