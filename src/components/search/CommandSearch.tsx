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
import { useSearchIndex, type SearchCategory, type SearchIndexEntry } from '@/lib/queries/useSearchIndex'
import { usePokemon } from '@/lib/queries/usePokemon'
import { useMove } from '@/lib/queries/useMove'
import { useType } from '@/lib/queries/useType'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { TYPE_ICONS } from '@/lib/constants/typeIcons'
import { isPokemonType, TYPE_COLORS } from '@/lib/constants/typeColors'
import { SearchIcon } from 'lucide-react'
import styles from './CommandSearch.module.scss'

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
    <CommandItem value={value} onSelect={onSelect} className={styles.tile}>
      {children}
    </CommandItem>
  )
}

function PokemonTile({ entry, onSelect }: { entry: SearchIndexEntry; onSelect: () => void }) {
  const { data: pokemon } = usePokemon(entry.name)
  const sprite = pokemon?.sprites.other?.['official-artwork']?.front_default ?? pokemon?.sprites.front_default

  return (
    <TileShell value={entry.displayName} onSelect={onSelect}>
      <SpriteImage src={sprite} alt="" className={styles.pokemonSprite} />
      <div className={styles.tileText}>
        <span className={styles.tileName}>{entry.displayName}</span>
        {pokemon && <span className={styles.tileMeta}>#{String(pokemon.id).padStart(3, '0')}</span>}
      </div>
      {pokemon && (
        <div className={styles.tileTypeStack}>
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
      <span className={styles.moveIcon}>
        {Icon && <Icon className={styles.moveIconSvg} style={{ color: iconColor }} />}
      </span>
      <div className={styles.tileText}>
        <div className={styles.moveNameRow}>
          <span className={styles.tileName}>{entry.displayName}</span>
          {type && <TypeBadge type={type} />}
        </div>
        {move && (
          <span className={styles.tileMeta}>
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
      <TypeBadge type={entry.name} className={styles.typeTileBadge} />
      {strongAgainst.length > 0 && (
        <div className={styles.tileText}>
          <span className={styles.strongAgainstLabel}>Strong against</span>
          <div className={styles.strongAgainstBadges}>
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
    <button type="button" onClick={onClick} className={styles.seeAll}>
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search Pokémon, moves, or types"
        className={styles.trigger}
      >
        <SearchIcon className={styles.triggerIcon} />
        <span className={styles.triggerLabel}>Search Pokémon, moves, or types...</span>
        <kbd className={styles.kbd}>⌘K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} className={styles.dialog}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search Pokémon, moves, or types..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className={styles.list}>
            {filtered.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
            {(['pokemon', 'move', 'type'] as const).map((category) => {
              const categoryEntries = byCategory[category]
              if (categoryEntries.length === 0) return null
              const expanded = expandedCategories.has(category)
              const visible = expanded ? categoryEntries : categoryEntries.slice(0, VISIBLE_CAP)
              const remaining = categoryEntries.length - visible.length

              return (
                <CommandGroup key={category} heading={CATEGORY_LABELS[category]} className={styles.tileGroup}>
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
