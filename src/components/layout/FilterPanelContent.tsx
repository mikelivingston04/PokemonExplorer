import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoveCombobox } from '@/components/search/MoveCombobox'
import { TYPE_COLORS, ALL_TYPE_NAMES } from '@/lib/constants/typeColors'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { DEFAULT_FILTER_STATE, isFilterActive, type FilterState } from '@/lib/filterEngine/types'

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

interface FilterPanelContentProps {
  filters: FilterState
  onChange: (next: FilterState) => void
}

export function FilterPanelContent({ filters, onChange }: FilterPanelContentProps) {
  return (
    <div className="flex flex-col gap-6">
      {isFilterActive(filters) && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onChange(DEFAULT_FILTER_STATE)}>
            Clear all
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Generation</label>
        <ToggleGroup
          multiple
          value={filters.generations.map(String)}
          onValueChange={(values) => onChange({ ...filters, generations: values.map(Number) })}
          className="flex-wrap"
        >
          {GENERATIONS.map((gen) => (
            <ToggleGroupItem key={gen} value={String(gen)} size="sm" variant="outline">
              {gen}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Type</label>
        <ToggleGroup
          multiple
          value={filters.types}
          onValueChange={(values) => onChange({ ...filters, types: values })}
          orientation="horizontal"
          className="flex-wrap"
        >
          {ALL_TYPE_NAMES.map((type) => {
            const active = filters.types.includes(type)
            const colors = TYPE_COLORS[type]
            return (
              <ToggleGroupItem
                key={type}
                value={type}
                size="sm"
                className="rounded-full border-2 px-2.5"
                style={{
                  backgroundColor: active ? colors.bg : 'transparent',
                  color: active ? colors.fg : undefined,
                  borderColor: colors.bg,
                }}
              >
                {toDisplayName(type)}
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Learns move</label>
        <MoveCombobox
          value={filters.learnsMove}
          onChange={(move) =>
            onChange({ ...filters, learnsMove: move, learnMethod: move ? filters.learnMethod : 'any' })
          }
        />
        {filters.learnsMove && (
          <Select
            value={filters.learnMethod}
            onValueChange={(value) => onChange({ ...filters, learnMethod: value as FilterState['learnMethod'] })}
          >
            <SelectTrigger className="w-full">
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

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Legendary status</label>
        <Select
          value={filters.legendaryStatus}
          onValueChange={(value) => onChange({ ...filters, legendaryStatus: value as FilterState['legendaryStatus'] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="legendary">Legendary / Mythical only</SelectItem>
            <SelectItem value="non-legendary">Non-legendary only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Evolution stage</label>
        <Select
          value={filters.evolutionStage}
          onValueChange={(value) => onChange({ ...filters, evolutionStage: value as FilterState['evolutionStage'] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="stage1">Stage 1</SelectItem>
            <SelectItem value="stage2">Stage 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
