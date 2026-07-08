import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePokemon } from '@/lib/queries/usePokemon'
import { usePokemonSpecies } from '@/lib/queries/usePokemonSpecies'
import { useEvolutionChain } from '@/lib/queries/useEvolutionChain'
import { useType } from '@/lib/queries/useType'
import { extractIdFromUrl } from '@/lib/api/client'
import { flattenChain } from '@/lib/evolution/flattenChain'
import { computeTypeEffectiveness } from '@/lib/typeEffectiveness'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { generationLabel } from '@/lib/constants/generations'
import { DEFAULT_VERSION_GROUP } from '@/lib/constants/versionGroups'
import { TYPE_COLORS, isPokemonType } from '@/lib/constants/typeColors'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { StatBars } from '@/components/pokemon/StatBars'
import { EvolutionChainView } from '@/components/pokemon/EvolutionChainView'
import { MoveListTable } from '@/components/pokemon/MoveListTable'
import { TypeEffectivenessChart } from '@/components/types/TypeEffectivenessChart'
import { LocationsList } from '@/components/pokemon/LocationsList'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import styles from './PokemonDetailPage.module.scss'

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statTile}>
      <span className={styles.statTileLabel}>{label}</span>
      <span className={styles.statTileValue}>{value}</span>
    </div>
  )
}

function SectionCard({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn(styles.section, className)}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  )
}

export function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>()
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const { data: pokemon, isLoading, isError } = usePokemon(name)
  // Alt-forms (e.g. "charizard-mega-x") aren't species themselves — the
  // species resource always lives under the base name in pokemon.species.
  const { data: species } = usePokemonSpecies(pokemon?.species.name)

  const evolutionChainId = species ? extractIdFromUrl(species.evolution_chain.url) : undefined
  const { data: evoChain } = useEvolutionChain(evolutionChainId)

  const primaryType = pokemon?.types.find((t) => t.slot === 1)?.type.name
  const secondaryType = pokemon?.types.find((t) => t.slot === 2)?.type.name
  const { data: primaryTypeData } = useType(primaryType)
  const { data: secondaryTypeData } = useType(secondaryType)

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingHeader}>
          <Skeleton style={{ height: '6rem', width: '6rem', borderRadius: '9999px' }} />
          <div className={styles.loadingHeaderText}>
            <Skeleton style={{ height: '2rem', width: '10rem' }} />
            <Skeleton style={{ height: '1.25rem', width: '6rem' }} />
          </div>
        </div>
        <Skeleton style={{ height: '16rem', width: '100%' }} />
      </div>
    )
  }

  if (isError || !pokemon) {
    return <p className={styles.notFound}>Couldn't find a Pokémon named "{name}".</p>
  }

  const artwork = pokemon.sprites.other?.['official-artwork']?.front_default
  const dexNumber = String(pokemon.id).padStart(3, '0')
  const glowColor = primaryType && isPokemonType(primaryType) ? TYPE_COLORS[primaryType].bg : undefined
  const genus = species?.genera.find((g) => g.language.name === 'en')?.genus

  return (
    <div className={styles.page}>
      <div className={styles.topGrid}>
        <div className={styles.column}>
          <div
            className={styles.hero}
            style={
              glowColor
                ? { backgroundImage: `radial-gradient(circle at 20% 25%, ${glowColor}26, transparent 65%)` }
                : undefined
            }
          >
            <div className={styles.heroSpriteWrapper}>
              {glowColor && <div className={styles.heroGlow} style={{ backgroundColor: glowColor }} />}
              <button
                type="button"
                onClick={() => setQuickViewOpen(true)}
                aria-label={`View a larger image of ${toDisplayName(pokemon.name)}`}
                className={styles.heroSpriteButton}
              >
                <SpriteImage
                  src={artwork ?? pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className={styles.heroSprite}
                />
              </button>
            </div>
            <div className={styles.heroInfo}>
              <div className={styles.heroTitleRow}>
                <h1 className={styles.heroTitle}>{toDisplayName(pokemon.name)}</h1>
                <span className={styles.dexNumber}>#{dexNumber}</span>
              </div>
              <div className={styles.badgeRow}>
                {pokemon.types.map((t) => (
                  <TypeBadge key={t.type.name} type={t.type.name} linkTo />
                ))}
                {species && <Badge variant="secondary">{generationLabel(species.generation.name)}</Badge>}
                {species?.is_legendary && <Badge variant="secondary">Legendary</Badge>}
                {species?.is_mythical && <Badge variant="secondary">Mythical</Badge>}
              </div>
            </div>
          </div>

          <SectionCard title="Base Stats">
            <StatBars stats={pokemon.stats} barColor={glowColor} />
          </SectionCard>
        </div>

        <div className={styles.column}>
          <SectionCard title="Evolution Chain">
            {evoChain ? (
              <div className={styles.evolutionScroll}>
                <EvolutionChainView node={flattenChain(evoChain.chain)} />
              </div>
            ) : (
              <Skeleton style={{ height: '6rem', width: '100%' }} />
            )}
          </SectionCard>

          <SectionCard title="Moves">
            <MoveListTable moves={pokemon.moves} versionGroup={DEFAULT_VERSION_GROUP} />
          </SectionCard>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <SectionCard title="Type Matchups">
          <p className={styles.matchupsIntro}>
            How much damage {toDisplayName(pokemon.name)} takes from each attacking type.
          </p>
          {primaryTypeData ? (
            <TypeEffectivenessChart
              perspective="defense"
              multipliers={computeTypeEffectiveness(
                primaryTypeData.damage_relations,
                secondaryTypeData?.damage_relations,
              )}
            />
          ) : (
            <Skeleton style={{ height: '8rem', width: '100%' }} />
          )}
        </SectionCard>

        <SectionCard title="Locations">
          <LocationsList pokemonId={pokemon.id} />
        </SectionCard>
      </div>

      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">{toDisplayName(pokemon.name)}</DialogTitle>
          </DialogHeader>
          <div className={styles.quickViewBody}>
            <div className={styles.quickViewSpriteWrapper}>
              {glowColor && <div className={styles.quickViewGlow} style={{ backgroundColor: glowColor }} />}
              <SpriteImage
                src={artwork ?? pokemon.sprites.front_default}
                alt={pokemon.name}
                className={styles.quickViewSprite}
              />
            </div>
            <div className={styles.quickViewInfo}>
              <span className={styles.dexNumber}>#{dexNumber}</span>
              <h3 className={styles.quickViewName}>{toDisplayName(pokemon.name)}</h3>
              {genus && <p className={styles.quickViewGenus}>{genus}</p>}
              <div className={styles.quickViewBadges}>
                {pokemon.types.map((t) => (
                  <TypeBadge key={t.type.name} type={t.type.name} />
                ))}
              </div>
            </div>
            <div className={styles.quickViewStats}>
              <StatTile label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
              <StatTile label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
