import { useParams } from 'react-router-dom'
import { useType } from '@/lib/queries/useType'
import { computeTypeEffectiveness, computeOffensiveEffectiveness } from '@/lib/typeEffectiveness'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { TypeEffectivenessChart } from '@/components/types/TypeEffectivenessChart'
import { PokemonLinkGrid } from '@/components/pokemon/PokemonLinkGrid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

export function TypeDetailPage() {
  const { name } = useParams<{ name: string }>()
  const { data: type, isLoading, isError } = useType(name)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !type) {
    return <p className="text-sm text-destructive">Couldn't find a type named "{name}".</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <TypeBadge type={type.name} className="px-4 py-1 text-base" />
        <h1 className="text-2xl font-semibold tracking-tight">{toDisplayName(type.name)}-type</h1>
      </div>

      <Tabs defaultValue="offense">
        <TabsList>
          <TabsTrigger value="offense">Offense</TabsTrigger>
          <TabsTrigger value="defense">Defense</TabsTrigger>
          <TabsTrigger value="pokemon">Pokémon</TabsTrigger>
        </TabsList>

        <TabsContent value="offense">
          <p className="mb-3 text-sm text-muted-foreground">
            Damage dealt by {toDisplayName(type.name)}-type moves against each type.
          </p>
          <TypeEffectivenessChart multipliers={computeOffensiveEffectiveness(type.damage_relations)} />
        </TabsContent>

        <TabsContent value="defense">
          <p className="mb-3 text-sm text-muted-foreground">
            Damage taken by {toDisplayName(type.name)}-type Pokémon from each type.
          </p>
          <TypeEffectivenessChart multipliers={computeTypeEffectiveness(type.damage_relations)} />
        </TabsContent>

        <TabsContent value="pokemon">
          <PokemonLinkGrid pokemon={type.pokemon.map((p) => p.pokemon)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
