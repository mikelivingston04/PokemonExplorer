export type LegendaryStatus = 'any' | 'legendary' | 'non-legendary'
export type EvolutionStage = 'any' | 'basic' | 'stage1' | 'stage2'
export type LearnMethod = 'any' | 'level-up' | 'machine' | 'tutor' | 'egg'

export interface FilterState {
  generations: number[]
  types: string[]
  learnsMove?: string
  // Version/method-specific refinement of learnsMove — requires per-Pokémon
  // data (expensive tier), added in a later milestone.
  learnMethod: LearnMethod
  legendaryStatus: LegendaryStatus
  evolutionStage: EvolutionStage
  versionGroup: string
}

export const DEFAULT_FILTER_STATE: FilterState = {
  generations: [],
  types: [],
  learnsMove: undefined,
  learnMethod: 'any',
  legendaryStatus: 'any',
  evolutionStage: 'any',
  versionGroup: 'firered-leafgreen',
}

export function isFilterActive(filters: FilterState): boolean {
  return (
    filters.generations.length > 0 ||
    filters.types.length > 0 ||
    !!filters.learnsMove ||
    filters.legendaryStatus !== 'any' ||
    filters.evolutionStage !== 'any'
  )
}
