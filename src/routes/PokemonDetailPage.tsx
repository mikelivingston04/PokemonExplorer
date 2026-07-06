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
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { StatBars } from '@/components/pokemon/StatBars'
import { EvolutionChainView } from '@/components/pokemon/EvolutionChainView'
import { MoveListTable } from '@/components/pokemon/MoveListTable'
import { TypeEffectivenessChart } from '@/components/types/TypeEffectivenessChart'
import { LocationsList } from '@/components/pokemon/LocationsList'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>()
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
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !pokemon) {
    return <p className="text-sm text-destructive">Couldn't find a Pokémon named "{name}".</p>
  }

  const artwork = pokemon.sprites.other?.['official-artwork']?.front_default
  const dexNumber = String(pokemon.id).padStart(3, '0')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-end gap-1">
          <SpriteImage
            src={artwork ?? pokemon.sprites.front_default}
            alt={pokemon.name}
            className="h-28 w-28"
          />
          <SpriteImage src={pokemon.sprites.back_default} alt="" className="h-16 w-16 opacity-70" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-muted-foreground tabular-nums">#{dexNumber}</span>
          <h1 className="text-3xl font-semibold tracking-tight">{toDisplayName(pokemon.name)}</h1>
          <div className="flex flex-wrap items-center gap-1.5">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} linkTo />
            ))}
            {species && <Badge variant="secondary">{generationLabel(species.generation.name)}</Badge>}
            {species?.is_legendary && <Badge variant="secondary">Legendary</Badge>}
            {species?.is_mythical && <Badge variant="secondary">Mythical</Badge>}
          </div>
        </div>
      </div>

      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
          <TabsTrigger value="moves">Moves</TabsTrigger>
          <TabsTrigger value="matchups">Type Matchups</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <StatBars stats={pokemon.stats} />
        </TabsContent>

        <TabsContent value="evolution">
          {evoChain ? (
            <EvolutionChainView node={flattenChain(evoChain.chain)} />
          ) : (
            <Skeleton className="h-32 w-full" />
          )}
        </TabsContent>

        <TabsContent value="moves">
          <MoveListTable moves={pokemon.moves} versionGroup={DEFAULT_VERSION_GROUP} />
        </TabsContent>

        <TabsContent value="matchups">
          {primaryTypeData ? (
            <TypeEffectivenessChart
              multipliers={computeTypeEffectiveness(
                primaryTypeData.damage_relations,
                secondaryTypeData?.damage_relations,
              )}
            />
          ) : (
            <Skeleton className="h-32 w-full" />
          )}
        </TabsContent>

        <TabsContent value="locations">
          <LocationsList pokemonId={pokemon.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
