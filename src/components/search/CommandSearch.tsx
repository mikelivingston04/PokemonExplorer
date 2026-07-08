import { useEffect, useMemo, useState } from 'react'
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
import { useSearchIndex, type SearchCategory, type SearchIndexEntry } from '@/lib/queries/useSearchIndex'
import { usePokemon } from '@/lib/queries/usePokemon'
import { useMove } from '@/lib/queries/useMove'
import { useType } from '@/lib/queries/useType'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { TYPE_ICONS } from '@/lib/constants/typeIcons'
import { isPokemonType, TYPE_COLORS } from '@/lib/constants/typeColors'
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

const VISIBLE_CAP = 4

function TileShell({
  onSelect,
  value,
  children,
}: {
  onSelect: () => void
  value: string
  children: React.ReactNode
}) {
  return (
    <CommandItem
      value={value}
      onSelect={onSelect}
      className="w-fit gap-2.5 rounded-lg border bg-card/60 px-2.5 py-2 data-selected:border-foreground/25 data-selected:bg-card"
    >
      {children}
    </CommandItem>
  )
}

function PokemonTile({ entry, onSelect }: { entry: SearchIndexEntry; onSelect: () => void }) {
  const { data: pokemon } = usePokemon(entry.name)
  const sprite = pokemon?.sprites.other?.['official-artwork']?.front_default ?? pokemon?.sprites.front_default

  return (
    <TileShell value={entry.displayName} onSelect={onSelect}>
      <SpriteImage src={sprite} alt="" className="h-9 w-9 object-contain" />
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-sm font-medium leading-none">{entry.displayName}</span>
        {pokemon && (
          <span className="text-xs text-muted-foreground tabular-nums">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
        )}
      </div>
      {pokemon && (
        <div className="flex flex-col gap-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </div>
      )}
    </TileShell>
  )
}

function MoveTile({ entry, onSelect }: { entry: SearchIndexEntry; onSelect: () => void }) {
  const { data: move } = useMove(entry.name)
  const type = move?.type.name
  const Icon = type && isPokemonType(type) ? TYPE_ICONS[type] : null
  const iconColor = type && isPokemonType(type) ? TYPE_COLORS[type].bg : undefined

  return (
    <TileShell value={entry.displayName} onSelect={onSelect}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted/60">
        {Icon && <Icon className="size-4.5" style={{ color: iconColor }} />}
      </span>
      <div className="flex flex-col items-start gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium leading-none">{entry.displayName}</span>
          {type && <TypeBadge type={type} />}
        </div>
        {move && (
          <span className="text-xs text-muted-foreground tabular-nums">
            Power: {move.power ?? '—'} · Acc: {move.accuracy ?? '—'}
          </span>
        )}
      </div>
    </TileShell>
  )
}

function TypeTile({ entry, onSelect }: { entry: SearchIndexEntry; onSelect: () => void }) {
  const { data: type } = useType(entry.name)
  const strongAgainst = type?.damage_relations.double_damage_to.slice(0, 3) ?? []

  return (
    <TileShell value={entry.displayName} onSelect={onSelect}>
      <TypeBadge type={entry.name} className="text-sm" />
      {strongAgainst.length > 0 && (
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-muted-foreground">Strong against</span>
          <div className="flex flex-wrap gap-1">
            {strongAgainst.map((t) => (
              <TypeBadge key={t.name} type={t.name} />
            ))}
          </div>
        </div>
      )}
    </TileShell>
  )
}

function SeeAllTile({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-fit items-center rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
    >
      See all {count} results
    </button>
  )
}

export function CommandSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<SearchCategory>>(new Set())
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

  useEffect(() => {
    if (!open) {
      setQuery('')
      setExpandedCategories(new Set())
    }
  }, [open])

  useEffect(() => {
    setExpandedCategories(new Set())
  }, [query])

  function select(category: SearchCategory, name: string) {
    setOpen(false)
    navigate(`${CATEGORY_ROUTE[category]}/${name}`)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) => e.displayName.toLowerCase().includes(q))
  }, [entries, query])

  const byCategory: Record<SearchCategory, SearchIndexEntry[]> = {
    pokemon: filtered.filter((e) => e.category === 'pokemon'),
    move: filtered.filter((e) => e.category === 'move'),
    type: filtered.filter((e) => e.category === 'type'),
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
      <CommandDialog open={open} onOpenChange={setOpen} className="sm:max-w-2xl">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search Pokémon, moves, or types..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {filtered.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
            {(['pokemon', 'move', 'type'] as const).map((category) => {
              const categoryEntries = byCategory[category]
              if (categoryEntries.length === 0) return null
              const expanded = expandedCategories.has(category)
              const visible = expanded ? categoryEntries : categoryEntries.slice(0, VISIBLE_CAP)
              const remaining = categoryEntries.length - visible.length

              return (
                <CommandGroup
                  key={category}
                  heading={CATEGORY_LABELS[category]}
                  className="**:[[cmdk-group-items]]:flex **:[[cmdk-group-items]]:flex-wrap **:[[cmdk-group-items]]:gap-2"
                >
                  {visible.map((entry) => {
                    const onSelect = () => select(category, entry.name)
                    if (category === 'pokemon') return <PokemonTile key={entry.name} entry={entry} onSelect={onSelect} />
                    if (category === 'move') return <MoveTile key={entry.name} entry={entry} onSelect={onSelect} />
                    return <TypeTile key={entry.name} entry={entry} onSelect={onSelect} />
                  })}
                  {remaining > 0 && (
                    <SeeAllTile
                      count={categoryEntries.length}
                      onClick={() => setExpandedCategories((prev) => new Set(prev).add(category))}
                    />
                  )}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
