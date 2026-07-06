import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { NamedApiResource } from '@/types/pokeapi'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 24

export function PokemonLinkGrid({ pokemon }: { pokemon: NamedApiResource[] }) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(pokemon.length / PAGE_SIZE)
  const start = page * PAGE_SIZE
  const visible = pokemon.slice(start, start + PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {visible.map((p) => (
          <Link
            key={p.name}
            to={`/pokemon/${p.name}`}
            className="rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            {toDisplayName(p.name)}
          </Link>
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
