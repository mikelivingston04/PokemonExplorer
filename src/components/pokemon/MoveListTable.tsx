import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { useMove } from '@/lib/queries/useMove'
import type { PokemonMove } from '@/types/pokeapi'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import styles from './MoveListTable.module.scss'

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
            <div className={styles.grid}>
              {entries.map((entry) => (
                <MoveTile
                  key={entry.moveName}
                  moveName={entry.moveName}
                  level={method === 'level-up' ? entry.level : undefined}
                />
              ))}
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
