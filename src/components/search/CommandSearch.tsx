import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { useSearchIndex, type SearchCategory } from '@/lib/queries/useSearchIndex'
import { SearchIcon } from 'lucide-react'

const CATEGORY_LABELS: Record<SearchCategory, string> = {
  pokemon: 'Pokémon',
  move: 'Moves',
  type: 'Types',
}

const CATEGORY_ROUTE: Record<SearchCategory, string> = {
  pokemon: '/pokemon',
  move: '/move',
  type: '/type',
}

export function CommandSearch() {
  const [open, setOpen] = useState(false)
  const { entries } = useSearchIndex()
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function select(category: SearchCategory, name: string) {
    setOpen(false)
    navigate(`${CATEGORY_ROUTE[category]}/${name}`)
  }

  const byCategory: Record<SearchCategory, typeof entries> = {
    pokemon: entries.filter((e) => e.category === 'pokemon'),
    move: entries.filter((e) => e.category === 'move'),
    type: entries.filter((e) => e.category === 'type'),
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="text-muted-foreground sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <SearchIcon className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="hidden w-56 justify-start gap-2 text-muted-foreground sm:flex"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4" />
        Search Pokémon, moves...
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search Pokémon, moves, or types..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {(['pokemon', 'move', 'type'] as const).map((category) => (
              <CommandGroup key={category} heading={CATEGORY_LABELS[category]}>
                {byCategory[category].map((entry) => (
                  <CommandItem
                    key={`${category}-${entry.name}`}
                    value={entry.displayName}
                    onSelect={() => select(category, entry.name)}
                  >
                    {entry.displayName}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
