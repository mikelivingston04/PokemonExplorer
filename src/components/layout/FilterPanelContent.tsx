import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoveCombobox } from '@/components/search/MoveCombobox'
import { TYPE_COLORS, ALL_TYPE_NAMES } from '@/lib/constants/typeColors'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { DEFAULT_FILTER_STATE, isFilterActive, type FilterState } from '@/lib/filterEngine/types'
import { cn } from '@/lib/utils'

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

type CategoryKey = 'generation' | 'type' | 'learnsMove' | 'legendary' | 'evolution'

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'generation', label: 'Generation' },
  { key: 'type', label: 'Type' },
  { key: 'learnsMove', label: 'Learns Move' },
  { key: 'legendary', label: 'Legendary Status' },
  { key: 'evolution', label: 'Evolution Stage' },
]

function categoryHasValue(key: CategoryKey, filters: FilterState): boolean {
  switch (key) {
    case 'generation':
      return filters.generations.length > 0
    case 'type':
      return filters.types.length > 0
    case 'learnsMove':
      return !!filters.learnsMove
    case 'legendary':
      return filters.legendaryStatus !== 'any'
    case 'evolution':
      return filters.evolutionStage !== 'any'
  }
}

interface FilterPanelContentProps {
  filters: FilterState
  onChange: (next: FilterState) => void
}

function CategoryToggle({
  label,
  active,
  hasValue,
  onClick,
}: {
  label: string
  active: boolean
  hasValue: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-medium transition-colors',
        hasValue
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
        active && !hasValue && 'border-foreground/40 text-foreground',
      )}
    >
      {label}
    </button>
  )
}

function Pill({
  active,
  onClick,
  children,
  style,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center rounded-full border-2 px-3 py-1 text-sm font-medium transition-colors',
        !style &&
          (active
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground'),
      )}
      style={style}
    >
      {children}
    </button>
  )
}

export function FilterPanelContent({ filters, onChange }: FilterPanelContentProps) {
  const [expanded, setExpanded] = useState<Set<CategoryKey>>(
    () => new Set(CATEGORIES.filter((c) => categoryHasValue(c.key, filters)).map((c) => c.key)),
  )

  // Auto-expand a category the first time it picks up a value (e.g. the
  // Gen-1 default applied after mount), without fighting the user's own
  // manual collapse of a category that already has a value.
  const prevFiltersRef = useRef(filters)
  useEffect(() => {
    const prev = prevFiltersRef.current
    prevFiltersRef.current = filters
    const newlyActive = CATEGORIES.filter(
      (c) => !categoryHasValue(c.key, prev) && categoryHasValue(c.key, filters),
    )
    if (newlyActive.length === 0) return
    setExpanded((current) => {
      const next = new Set(current)
      newlyActive.forEach((c) => next.add(c.key))
      return next
    })
  }, [filters])

  function toggleCategory(key: CategoryKey) {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <CategoryToggle
            key={c.key}
            label={c.label}
            active={expanded.has(c.key)}
            hasValue={categoryHasValue(c.key, filters)}
            onClick={() => toggleCategory(c.key)}
          />
        ))}
        {isFilterActive(filters) && (
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => onChange(DEFAULT_FILTER_STATE)}>
            Clear all
          </Button>
        )}
      </div>

      {expanded.has('generation') && (
        <div className="flex flex-wrap items-center gap-2">
          {GENERATIONS.map((gen) => {
            const active = filters.generations.includes(gen)
            return (
              <Pill
                key={gen}
                active={active}
                onClick={() =>
                  onChange({
                    ...filters,
                    generations: active
                      ? filters.generations.filter((g) => g !== gen)
                      : [...filters.generations, gen],
                  })
                }
              >
                {gen}
              </Pill>
            )
          })}
        </div>
      )}

      {expanded.has('type') && (
        <div className="flex flex-wrap items-center gap-2">
          {ALL_TYPE_NAMES.map((type) => {
            const active = filters.types.includes(type)
            const colors = TYPE_COLORS[type]
            return (
              <Pill
                key={type}
                active={active}
                onClick={() =>
                  onChange({
                    ...filters,
                    types: active ? filters.types.filter((t) => t !== type) : [...filters.types, type],
                  })
                }
                style={{
                  backgroundColor: active ? colors.bg : 'transparent',
                  color: active ? colors.fg : colors.bg,
                  borderColor: colors.bg,
                }}
              >
                {toDisplayName(type)}
              </Pill>
            )
          })}
        </div>
      )}

      {expanded.has('learnsMove') && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-56">
            <MoveCombobox
              value={filters.learnsMove}
              onChange={(move) =>
                onChange({ ...filters, learnsMove: move, learnMethod: move ? filters.learnMethod : 'any' })
              }
            />
          </div>
          {filters.learnsMove && (
            <Select
              value={filters.learnMethod}
              onValueChange={(value) => onChange({ ...filters, learnMethod: value as FilterState['learnMethod'] })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any method</SelectItem>
                <SelectItem value="level-up">Level-up</SelectItem>
                <SelectItem value="machine">TM / HM</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="egg">Egg</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {expanded.has('legendary') && (
        <div className="flex flex-wrap items-center gap-2">
          {(['legendary', 'non-legendary'] as const).map((status) => {
            const active = filters.legendaryStatus === status
            return (
              <Pill
                key={status}
                active={active}
                onClick={() => onChange({ ...filters, legendaryStatus: active ? 'any' : status })}
              >
                {status === 'legendary' ? 'Legendary / Mythical' : 'Non-legendary'}
              </Pill>
            )
          })}
        </div>
      )}

      {expanded.has('evolution') && (
        <div className="flex flex-wrap items-center gap-2">
          {(['basic', 'stage1', 'stage2'] as const).map((stage) => {
            const active = filters.evolutionStage === stage
            const label = stage === 'basic' ? 'Basic' : stage === 'stage1' ? 'Stage 1' : 'Stage 2'
            return (
              <Pill
                key={stage}
                active={active}
                onClick={() => onChange({ ...filters, evolutionStage: active ? 'any' : stage })}
              >
                {label}
              </Pill>
            )
          })}
        </div>
      )}
    </div>
  )
}
