import { useParams } from 'react-router-dom'
import { useType } from '@/lib/queries/useType'
import { computeTypeEffectiveness, computeOffensiveEffectiveness } from '@/lib/typeEffectiveness'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { TypeEffectivenessChart } from '@/components/types/TypeEffectivenessChart'
import { PokemonLinkGrid } from '@/components/pokemon/PokemonLinkGrid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import styles from './TypeDetailPage.module.scss'

export function TypeDetailPage() {
  const { name } = useParams<{ name: string }>()
  const { data: type, isLoading, isError } = useType(name)

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Skeleton style={{ height: '2.5rem', width: '8rem' }} />
        <Skeleton style={{ height: '16rem', width: '100%' }} />
      </div>
    )
  }

  if (isError || !type) {
    return <p className={styles.notFound}>Couldn't find a type named "{name}".</p>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <TypeBadge type={type.name} className={styles.headerBadge} />
        <h1 className={styles.title}>{toDisplayName(type.name)}-type</h1>
      </div>

      <Tabs defaultValue="offense">
        <TabsList>
          <TabsTrigger value="offense">Offense</TabsTrigger>
          <TabsTrigger value="defense">Defense</TabsTrigger>
          <TabsTrigger value="pokemon">Pokémon</TabsTrigger>
        </TabsList>

        <TabsContent value="offense">
          <p className={styles.tabIntro}>
            Damage dealt by {toDisplayName(type.name)}-type moves against each type.
          </p>
          <TypeEffectivenessChart perspective="offense" multipliers={computeOffensiveEffectiveness(type.damage_relations)} />
        </TabsContent>

        <TabsContent value="defense">
          <p className={styles.tabIntro}>
            Damage taken by {toDisplayName(type.name)}-type Pokémon from each type.
          </p>
          <TypeEffectivenessChart perspective="defense" multipliers={computeTypeEffectiveness(type.damage_relations)} />
        </TabsContent>

        <TabsContent value="pokemon">
          <PokemonLinkGrid pokemon={type.pokemon.map((p) => p.pokemon)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
