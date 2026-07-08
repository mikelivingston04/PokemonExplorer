import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { NamedApiResource } from '@/types/pokeapi'
import { usePokemon } from '@/lib/queries/usePokemon'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { Button } from '@/components/ui/button'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { Skeleton } from '@/components/ui/skeleton'

const PAGE_SIZE = 24

function PokemonLinkTile({ name }: { name: string }) {
  const { data: pokemon, isLoading } = usePokemon(name)
  const sprite = pokemon?.sprites.front_default

  return (
    <Link
      to={`/pokemon/${name}`}
      className="flex flex-col items-center gap-1 rounded-lg border bg-card/60 p-2 text-center transition-colors hover:border-foreground/20 hover:bg-card"
    >
      {isLoading ? (
        <Skeleton className="h-10 w-10 rounded-md" />
      ) : (
        <SpriteImage src={sprite} alt="" className="h-10 w-10 object-contain" />
      )}
      <span className="line-clamp-1 text-sm font-medium">{toDisplayName(name)}</span>
    </Link>
  )
}

export function PokemonLinkGrid({ pokemon }: { pokemon: NamedApiResource[] }) {
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [pokemon])

  const totalPages = Math.ceil(pokemon.length / PAGE_SIZE)
  const start = page * PAGE_SIZE
  const visible = pokemon.slice(start, start + PAGE_SIZE)

  if (pokemon.length === 0) {
    return <p className="text-sm text-muted-foreground">No Pokémon found.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {visible.map((p) => (
          <PokemonLinkTile key={p.name} name={p.name} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
