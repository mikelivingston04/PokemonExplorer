import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoveCombobox } from '@/components/search/MoveCombobox'
import { TYPE_COLORS, ALL_TYPE_NAMES } from '@/lib/constants/typeColors'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import type { FilterState } from '@/lib/filterEngine/types'
import { cn } from '@/lib/utils'
import styles from './FilterPanelContent.module.scss'

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Passed as base-ui Select's `items` map so the trigger's collapsed
// SelectValue can resolve a value like "level-up" back to its label —
// without it, SelectValue falls back to rendering the raw value string.
const LEARN_METHOD_LABELS: Record<string, string> = {
  any: 'Any method',
  'level-up': 'Level-up',
  machine: 'TM / HM',
  tutor: 'Tutor',
  egg: 'Egg',
}

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
      return !!filters.learnsMove || filters.learnMethod !== 'any'
    case 'legendary':
      return filters.legendaryStatus !== 'any'
    case 'evolution':
      return filters.evolutionStage !== 'any'
  }
}

interface FilterPanelContentProps {
  filters: FilterState
  onChange: (next: FilterState) => void
  // "Clear all" also needs to drop any active search text and jump back
  // home — both live outside this component, so the caller owns the action.
  // Always rendered (not gated on whether anything's active) since it
  // doubles as a home button on every page, including detail pages.
  onClearAll: () => void
}

function CategoryToggle({
  label,
  active,
  hasValue,
  onToggle,
}: {
  label: string
  active: boolean
  hasValue: boolean
  onToggle: (next: boolean) => void
}) {
  return (
    <label className={styles.toggle}>
      <Switch checked={active} onCheckedChange={onToggle} />
      <span className={hasValue ? styles.toggleLabelActive : styles.toggleLabel}>{label}</span>
    </label>
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
      className={cn(styles.pill, !style && (active ? styles.pillActive : styles.pillNeutral))}
      style={style}
    >
      {children}
    </button>
  )
}

// The options content for a single category — shared between the desktop
// inline-expand row and the mobile popover, so the two surfaces can't drift.
function CategoryOptions({
  categoryKey,
  filters,
  onChange,
}: {
  categoryKey: CategoryKey
  filters: FilterState
  onChange: (next: FilterState) => void
}) {
  switch (categoryKey) {
    case 'generation':
      return (
        <div className={styles.optionsRow}>
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
      )

    case 'type':
      return (
        <div className={styles.optionsRow}>
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
      )

    case 'learnsMove':
      return (
        <div className={styles.learnsMoveBlock}>
          <p className={styles.hint}>Pick a specific move, a learn method, or both together.</p>
          <div className={styles.optionsRow}>
            <div className={styles.moveComboboxWrapper}>
              <MoveCombobox
                value={filters.learnsMove}
                onChange={(move) => onChange({ ...filters, learnsMove: move })}
              />
            </div>
            <Select
              items={LEARN_METHOD_LABELS}
              value={filters.learnMethod}
              onValueChange={(value) => onChange({ ...filters, learnMethod: value as FilterState['learnMethod'] })}
            >
              <SelectTrigger className={styles.methodSelect}>
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
          </div>
        </div>
      )

    case 'legendary':
      return (
        <div className={styles.optionsRow}>
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
      )

    case 'evolution':
      return (
        <div className={styles.optionsRow}>
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
      )
  }
}

export function FilterPanelContent({ filters, onChange, onClearAll }: FilterPanelContentProps) {
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

  // Expand/collapse is otherwise deliberately independent of filter values,
  // but "Clear all" is meant to reset everything back to the untouched
  // starting state — including collapsing every toggle row.
  function handleClearAll() {
    setExpanded(new Set())
    onClearAll()
  }

  return (
    <div className={styles.panel}>
      {/* Desktop: a Switch per category expands an inline options row below —
          there's enough width that stacking rows doesn't cost much space. */}
      <div className={styles.categoryRow}>
        {CATEGORIES.map((c) => (
          <CategoryToggle
            key={c.key}
            label={c.label}
            active={expanded.has(c.key)}
            hasValue={categoryHasValue(c.key, filters)}
            onToggle={() => toggleCategory(c.key)}
          />
        ))}
        <Button variant="ghost" size="sm" className={styles.clearAll} onClick={handleClearAll}>
          Clear all
        </Button>
      </div>

      <div className={styles.desktopOptions}>
        {CATEGORIES.map(
          (c) => expanded.has(c.key) && <CategoryOptions key={c.key} categoryKey={c.key} filters={filters} onChange={onChange} />,
        )}
      </div>

      {/* Mobile: an inline row would grow taller every time a category is
          picked (5 toggles, each adding a wrapped options row of its own) —
          a popover per category keeps the box's height constant instead. */}
      <div className={styles.mobileCategoryRow}>
        {CATEGORIES.map((c) => (
          <Popover key={c.key}>
            <PopoverTrigger
              className={cn(styles.mobileTrigger, categoryHasValue(c.key, filters) && styles.mobileTriggerActive)}
            >
              {c.label}
              <ChevronDownIcon className={styles.mobileTriggerIcon} />
            </PopoverTrigger>
            <PopoverContent align="start" className={styles.mobilePopoverContent}>
              <CategoryOptions categoryKey={c.key} filters={filters} onChange={onChange} />
            </PopoverContent>
          </Popover>
        ))}
        <Button variant="ghost" size="sm" className={styles.clearAll} onClick={handleClearAll}>
          Clear all
        </Button>
      </div>
    </div>
  )
}
