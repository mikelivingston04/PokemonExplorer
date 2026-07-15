import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMove } from '@/lib/queries/useMove'
import { useTmNumber } from '@/lib/queries/useTmNumber'
import { useType } from '@/lib/queries/useType'
import { useCompatibleTypeBreakdown } from '@/lib/queries/useCompatibleTypeBreakdown'
import { computeOffensiveEffectiveness } from '@/lib/typeEffectiveness'
import { pickFlavorText } from '@/lib/flavorText'
import { getEffectiveDamageClass } from '@/lib/legacyDamageClass'
import { DEFAULT_VERSION_GROUP } from '@/lib/constants/versionGroups'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import type { PokemonType } from '@/lib/constants/typeColors'
import type { NamedApiResource } from '@/types/pokeapi'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { TypeFilterDropdown, TypeFilterColumn } from '@/components/pokemon/TypeFilterDropdown'
import { PokemonLinkGrid } from '@/components/pokemon/PokemonLinkGrid'
import { TypeEffectivenessChart } from '@/components/types/TypeEffectivenessChart'
import { SectionCard } from '@/components/layout/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import styles from './MoveDetailPage.module.scss'

const DAMAGE_CLASS_LABELS: Record<string, string> = {
  physical: 'Physical',
  special: 'Special',
  status: 'Status',
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statTile}>
      <span className={styles.statTileLabel}>{label}</span>
      <span className={styles.statTileValue}>{value}</span>
    </div>
  )
}

export function MoveDetailPage() {
  const { name } = useParams<{ name: string }>()
  const { data: move, isLoading, isError } = useMove(name)
  const { tmName, isLoading: tmLoading, hasNoMachine } = useTmNumber(name, DEFAULT_VERSION_GROUP)
  const { data: moveTypeData } = useType(move?.type.name)
  const { breakdown, isLoading: breakdownLoading } = useCompatibleTypeBreakdown(move?.learned_by_pokemon ?? [])
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([])

  // Union across selected types (a dual-type Pokémon can appear under both
  // of its types' entries, so dedupe by name rather than concatenating).
  const visiblePokemon = useMemo(() => {
    if (selectedTypes.length === 0) return []
    const byName = new Map<string, NamedApiResource>()
    for (const entry of breakdown) {
      if (!selectedTypes.includes(entry.type)) continue
      for (const p of entry.pokemon) byName.set(p.name, p)
    }
    return [...byName.values()]
  }, [breakdown, selectedTypes])

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Skeleton style={{ height: '2.5rem', width: '12rem' }} />
        <Skeleton style={{ height: '10rem', width: '100%' }} />
      </div>
    )
  }

  if (isError || !move) {
    return <p className={styles.notFound}>Couldn't find a move named "{name}".</p>
  }

  const description = pickFlavorText(move.flavor_text_entries, (e) => e.version_group.name === DEFAULT_VERSION_GROUP)
  const effectiveDamageClass = getEffectiveDamageClass(move)

  return (
    <div className={styles.page}>
      {/* Same self-sizing, flows-into-whichever-column-has-room approach as
          the Pokémon detail page — Compatible Pokémon stays outside this,
          as its own full-width section below (see .compatibleSection). */}
      <div className={styles.sections}>
        <div className={styles.moveCard}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{toDisplayName(move.name)}</h1>
            <div className={styles.badgeRow}>
              <TypeBadge type={move.type.name} linkTo />
              <Badge
                variant="secondary"
                className={effectiveDamageClass.isLegacyOverride ? styles.legacyBadge : undefined}
                title={
                  effectiveDamageClass.isLegacyOverride
                    ? `Move category was determined by type before Generation IV — ${toDisplayName(move.type.name)}-type moves were ${DAMAGE_CLASS_LABELS[effectiveDamageClass.name]} in Generation I–III games like FireRed. PokéAPI only reports the current (post-Gen-IV) category, which is ${DAMAGE_CLASS_LABELS[move.damage_class.name]}.`
                    : undefined
                }
              >
                {DAMAGE_CLASS_LABELS[effectiveDamageClass.name] ?? effectiveDamageClass.name}
              </Badge>
              {tmLoading ? (
                <Skeleton style={{ height: '1.25rem', width: '3.5rem' }} />
              ) : !hasNoMachine ? (
                <Badge variant="secondary">{tmName?.toUpperCase()}</Badge>
              ) : null}
            </div>
          </div>
          <div className={styles.statTiles}>
            <StatTile label="Power" value={move.power !== null ? String(move.power) : '—'} />
            <StatTile label="Accuracy" value={move.accuracy !== null ? `${move.accuracy}%` : '—'} />
            <StatTile label="PP" value={move.pp !== null ? String(move.pp) : '—'} />
          </div>
        </div>

        {description && (
          <SectionCard title="Description">
            <p className={styles.descriptionText}>{description}</p>
          </SectionCard>
        )}

        <SectionCard title="Type Matchups">
          <p className={styles.matchupsIntro}>How much damage this move deals to each defending type.</p>
          {moveTypeData ? (
            <TypeEffectivenessChart
              perspective="offense"
              multipliers={computeOffensiveEffectiveness(moveTypeData.damage_relations)}
            />
          ) : (
            <Skeleton style={{ height: '6rem', width: '100%' }} />
          )}
        </SectionCard>
      </div>

      <div className={styles.compatibleSection}>
        {/* Mobile: title above a dropdown, both full width. Desktop: the
            dropdown is replaced by an always-visible type column, and the
            title moves to sit above the results column next to it — same
            underlying state either way, just two different surfaces for
            picking a type (see TypeFilterDropdown/TypeFilterColumn). */}
        <h2 className={styles.compatibleTitleMobile}>Compatible Pokémon ({move.learned_by_pokemon.length})</h2>

        <div className={styles.dropdownWrapper}>
          {breakdownLoading ? (
            <Skeleton style={{ height: '2.25rem', width: '100%', borderRadius: '9999px' }} />
          ) : (
            <TypeFilterDropdown entries={breakdown} selected={selectedTypes} onChange={setSelectedTypes} />
          )}
        </div>

        <div className={styles.compatibleLayout}>
          {!breakdownLoading && (
            <TypeFilterColumn entries={breakdown} selected={selectedTypes} onChange={setSelectedTypes} />
          )}

          <div className={styles.resultsColumn}>
            <h2 className={styles.compatibleTitleDesktop}>Compatible Pokémon ({move.learned_by_pokemon.length})</h2>

            {breakdownLoading ? (
              <Skeleton style={{ height: '16rem', width: '100%' }} />
            ) : selectedTypes.length === 0 ? (
              <p className={styles.compatibleEmpty}>Select a type above to see which compatible Pokémon share it.</p>
            ) : (
              <PokemonLinkGrid pokemon={visiblePokemon} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
