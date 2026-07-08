import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMove } from '@/lib/queries/useMove'
import { useTmNumber } from '@/lib/queries/useTmNumber'
import { useType } from '@/lib/queries/useType'
import { useCompatibleTypeBreakdown } from '@/lib/queries/useCompatibleTypeBreakdown'
import { computeOffensiveEffectiveness } from '@/lib/typeEffectiveness'
import { DEFAULT_VERSION_GROUP } from '@/lib/constants/versionGroups'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import type { PokemonType } from '@/lib/constants/typeColors'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { TypeCompatibilityList } from '@/components/pokemon/TypeCompatibilityList'
import { PokemonLinkGrid } from '@/components/pokemon/PokemonLinkGrid'
import { TypeEffectivenessChart } from '@/components/types/TypeEffectivenessChart'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const DAMAGE_CLASS_LABELS: Record<string, string> = {
  physical: 'Physical',
  special: 'Special',
  status: 'Status',
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border bg-card/60 px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </div>
  )
}

export function MoveDetailPage() {
  const { name } = useParams<{ name: string }>()
  const { data: move, isLoading, isError } = useMove(name)
  const { tmName, isLoading: tmLoading, hasNoMachine } = useTmNumber(name, DEFAULT_VERSION_GROUP)
  const { data: moveTypeData } = useType(move?.type.name)
  const { breakdown, isLoading: breakdownLoading } = useCompatibleTypeBreakdown(move?.learned_by_pokemon ?? [])
  const [expandedType, setExpandedType] = useState<PokemonType | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (isError || !move) {
    return <p className="text-sm text-destructive">Couldn't find a move named "{name}".</p>
  }

  function toggleType(type: PokemonType) {
    setExpandedType((current) => (current === type ? null : type))
  }

  const leftEntries = breakdown.filter((_, i) => i % 2 === 0)
  const rightEntries = breakdown.filter((_, i) => i % 2 === 1)
  const expandedEntry = breakdown.find((e) => e.type === expandedType)
  const visiblePokemon = expandedEntry ? expandedEntry.pokemon : move.learned_by_pokemon

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-5 rounded-2xl border bg-card/60 p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-4xl font-semibold tracking-tight">{toDisplayName(move.name)}</h1>
            <div className="flex flex-wrap items-center gap-1.5">
              <TypeBadge type={move.type.name} linkTo />
              <Badge variant="secondary">
                {DAMAGE_CLASS_LABELS[move.damage_class.name] ?? move.damage_class.name}
              </Badge>
              {tmLoading ? (
                <Skeleton className="h-5 w-14" />
              ) : !hasNoMachine ? (
                <Badge variant="secondary">{tmName?.toUpperCase()}</Badge>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatTile label="Power" value={move.power !== null ? String(move.power) : '—'} />
            <StatTile label="Accuracy" value={move.accuracy !== null ? `${move.accuracy}%` : '—'} />
            <StatTile label="PP" value={move.pp !== null ? String(move.pp) : '—'} />
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:min-w-56">
          <h2 className="text-sm font-semibold text-muted-foreground">Type Matchups</h2>
          {moveTypeData ? (
            <TypeEffectivenessChart multipliers={computeOffensiveEffectiveness(moveTypeData.damage_relations)} />
          ) : (
            <Skeleton className="h-24 w-full" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-center text-lg font-semibold tracking-tight">
          Compatible Pokémon ({move.learned_by_pokemon.length})
        </h2>
        {breakdownLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr_200px]">
            <TypeCompatibilityList entries={leftEntries} expanded={expandedType} onToggle={toggleType} />
            <PokemonLinkGrid pokemon={visiblePokemon} />
            <TypeCompatibilityList entries={rightEntries} expanded={expandedType} onToggle={toggleType} />
          </div>
        )}
      </div>
    </div>
  )
}
