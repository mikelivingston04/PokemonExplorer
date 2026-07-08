import { Link } from 'react-router-dom'
import { usePokemon } from '@/lib/queries/usePokemon'
import { usePokemonSpecies } from '@/lib/queries/usePokemonSpecies'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { generationLabel } from '@/lib/constants/generations'
import { TYPE_COLORS, isPokemonType } from '@/lib/constants/typeColors'
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
      <div className="flex h-full flex-col items-center gap-2 rounded-xl border bg-card/60 p-3">
        <Skeleton className="h-20 w-20 rounded-md" />
        <Skeleton className="h-4 w-20" />
      </div>
    )
  }

  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default
  const primaryType = pokemon.types.find((t) => t.slot === 1)?.type.name
  const glowColor = primaryType && isPokemonType(primaryType) ? TYPE_COLORS[primaryType].bg : undefined

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className="group flex h-full flex-col items-center gap-1.5 rounded-xl border bg-card/60 p-3 text-center transition-colors hover:border-foreground/20 hover:bg-card"
    >
      <span className="self-start text-xs text-muted-foreground tabular-nums">
        #{String(pokemon.id).padStart(3, '0')}
      </span>
      <div className="relative flex h-20 w-20 items-center justify-center">
        {glowColor && (
          <div
            className="absolute inset-0 -z-0 rounded-full opacity-40 blur-xl transition-opacity group-hover:opacity-60"
            style={{ backgroundColor: glowColor }}
          />
        )}
        <SpriteImage src={sprite} alt="" className="relative z-10 h-20 w-20 object-contain" />
      </div>
      <span className="line-clamp-1 font-medium">{toDisplayName(pokemon.name)}</span>
      <div className="flex min-h-[1.375rem] flex-wrap items-center justify-center gap-1">
        {pokemon.types.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
        {species && <Badge variant="secondary">{generationLabel(species.generation.name)}</Badge>}
      </div>
    </Link>
  )
}
