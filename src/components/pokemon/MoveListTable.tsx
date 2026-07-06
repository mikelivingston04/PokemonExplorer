import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PokemonMove } from '@/types/pokeapi'
import { toDisplayName } from '@/lib/constants/nameOverrides'

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
    return <p className="text-sm text-muted-foreground">No move data for this game version.</p>
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
            <ul className="flex flex-col divide-y">
              {entries.map((entry) => (
                <li
                  key={entry.moveName}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <Link to={`/move/${entry.moveName}`} className="font-medium hover:underline">
                    {toDisplayName(entry.moveName)}
                  </Link>
                  {method === 'level-up' && (
                    <span className="tabular-nums text-muted-foreground">
                      {entry.level === 0 ? 'Evolve' : `Lv. ${entry.level}`}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
