import { useEffect, useState } from 'react'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 24

interface PokemonGridProps {
  names: string[]
  isLoading: boolean
  checkingStatus?: string
}

export function PokemonGrid({ names, isLoading, checkingStatus }: PokemonGridProps) {
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [names])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 rounded-lg border p-3">
            <div className="h-16 w-16 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (names.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        {checkingStatus ?? 'No Pokémon match these filters. Try loosening a constraint.'}
      </p>
    )
  }

  const totalPages = Math.ceil(names.length / PAGE_SIZE)
  const start = page * PAGE_SIZE
  const visible = names.slice(start, start + PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {names.length} Pokémon
        {checkingStatus && <span> — {checkingStatus}</span>}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {visible.map((name) => (
          <PokemonCard key={name} name={name} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
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
