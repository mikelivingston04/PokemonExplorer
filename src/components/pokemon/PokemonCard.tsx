import { Link } from 'react-router-dom'
import { usePokemon } from '@/lib/queries/usePokemon'
import { usePokemonSpecies } from '@/lib/queries/usePokemonSpecies'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { generationLabel } from '@/lib/constants/generations'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function PokemonCard({ name }: { name: string }) {
  const { data: pokemon, isLoading } = usePokemon(name)
  // Alt-forms (e.g. "charizard-mega-x") aren't species themselves — the
  // species resource always lives under the base name in pokemon.species.
  const { data: species } = usePokemonSpecies(pokemon?.species.name)

  if (isLoading || !pokemon) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border p-3">
        <Skeleton className="h-16 w-16 rounded-md" />
        <Skeleton className="h-4 w-20" />
      </div>
    )
  }

  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors hover:bg-accent"
    >
      <span className="self-start text-xs text-muted-foreground tabular-nums">
        #{String(pokemon.id).padStart(3, '0')}
      </span>
      <SpriteImage src={sprite} alt="" className="h-16 w-16 object-contain" />
      <span className="font-medium">{toDisplayName(pokemon.name)}</span>
      <div className="flex flex-wrap justify-center gap-1">
        {pokemon.types.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </div>
      {species && <Badge variant="secondary">{generationLabel(species.generation.name)}</Badge>}
    </Link>
  )
}
