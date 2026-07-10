import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { useMove } from '@/lib/queries/useMove'
import type { PokemonMove } from '@/types/pokeapi'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { cn } from '@/lib/utils'
import styles from './MoveListTable.module.scss'

const PAGE_SIZE = 4

const METHOD_ORDER = ['level-up', 'machine', 'tutor', 'egg']
const METHOD_LABELS: Record<string, string> = {
  'level-up': 'Level-up',
  machine: 'TM / HM',
  tutor: 'Tutor',
  egg: 'Egg',
}

interface MethodEntry {
  moveName: string
  level: number
}

function MoveTile({ moveName, level }: { moveName: string; level?: number }) {
  const { data: move } = useMove(moveName)

  return (
    <Link to={`/move/${moveName}`} className={styles.tile}>
      <div className={styles.tileHeader}>
        <span className={styles.tileName}>{toDisplayName(moveName)}</span>
        <div className={styles.tileBadges}>
          {level !== undefined && (
            <Badge variant="secondary">{level === 0 ? 'Evolve' : `Lv. ${level}`}</Badge>
          )}
          {move && <TypeBadge type={move.type.name} />}
        </div>
      </div>
      {move ? (
        <div className={styles.stats}>
          <div className={styles.statBlock}>
            <span className={styles.statLabel}>Power</span>
            <span>{move.power ?? '—'}</span>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statLabel}>Accuracy</span>
            <span>{move.accuracy ? `${move.accuracy}%` : '—'}</span>
          </div>
          <div className={styles.statBlockEnd}>
            <span className={styles.statLabel}>PP</span>
            <span>{move.pp ?? '—'}</span>
          </div>
        </div>
      ) : (
        <Skeleton style={{ height: '1rem', width: '10rem' }} />
      )}
    </Link>
  )
}

function PaginatedMoveGrid({ entries, showLevel }: { entries: MethodEntry[]; showLevel: boolean }) {
  const pages = useMemo(() => {
    const chunks: MethodEntry[][] = []
    for (let i = 0; i < entries.length; i += PAGE_SIZE) chunks.push(entries.slice(i, i + PAGE_SIZE))
    return chunks
  }, [entries])

  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePage, setActivePage] = useState(0)

  // Switching method tabs swaps `entries` entirely — jump back to page 1
  // rather than stranding the view on a page index that may not exist.
  useEffect(() => {
    setActivePage(0)
    scrollRef.current?.scrollTo({ left: 0 })
  }, [entries])

  function goToPage(index: number) {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }

  function handleScroll() {
    const el = scrollRef.current
    if (!el || el.clientWidth === 0) return
    setActivePage(Math.round(el.scrollLeft / el.clientWidth))
  }

  if (pages.length === 0) return null

  return (
    <div className={styles.carousel}>
      <div className={styles.scrollArea} ref={scrollRef} onScroll={handleScroll}>
        {pages.map((page, i) => (
          <div key={i} className={styles.page}>
            {page.map((entry) => (
              <MoveTile key={entry.moveName} moveName={entry.moveName} level={showLevel ? entry.level : undefined} />
            ))}
          </div>
        ))}
      </div>

      {pages.length > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            onClick={() => goToPage(activePage - 1)}
            disabled={activePage === 0}
            aria-label="Previous page of moves"
            className={styles.arrow}
          >
            <ChevronLeftIcon />
          </button>
          <div className={styles.dots}>
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`Go to move page ${i + 1}`}
                aria-current={i === activePage}
                className={cn(styles.dot, i === activePage && styles.dotActive)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goToPage(activePage + 1)}
            disabled={activePage === pages.length - 1}
            aria-label="Next page of moves"
            className={styles.arrow}
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  )
}

export function MoveListTable({
  moves,
  versionGroup,
}: {
  moves: PokemonMove[]
  versionGroup: string
}) {
  const byMethod = new Map<string, MethodEntry[]>()

  for (const m of moves) {
    const detail = m.version_group_details.find((d) => d.version_group.name === versionGroup)
    if (!detail) continue
    const method = detail.move_learn_method.name
    const list = byMethod.get(method) ?? []
    list.push({ moveName: m.move.name, level: detail.level_learned_at })
    byMethod.set(method, list)
  }

  const availableMethods = METHOD_ORDER.filter((m) => byMethod.has(m))

  if (availableMethods.length === 0) {
    return <p className={styles.empty}>No move data for this game version.</p>
  }

  return (
    <Tabs defaultValue={availableMethods[0]}>
      <TabsList>
        {availableMethods.map((method) => (
          <TabsTrigger key={method} value={method}>
            {METHOD_LABELS[method] ?? toDisplayName(method)}
          </TabsTrigger>
        ))}
      </TabsList>
      {availableMethods.map((method) => {
        const entries = [...(byMethod.get(method) ?? [])]
        if (method === 'level-up') {
          entries.sort((a, b) => a.level - b.level)
        } else {
          entries.sort((a, b) => a.moveName.localeCompare(b.moveName))
        }
        return (
          <TabsContent key={method} value={method}>
            <PaginatedMoveGrid entries={entries} showLevel={method === 'level-up'} />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
