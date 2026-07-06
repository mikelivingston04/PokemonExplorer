import type { URLSearchParamsInit } from 'react-router-dom'
import {
  DEFAULT_FILTER_STATE,
  type EvolutionStage,
  type FilterState,
  type LearnMethod,
  type LegendaryStatus,
} from '@/lib/filterEngine/types'

// The URL is the single source of truth for filter state — this is what makes
// back-navigation from a Detail page restore filters for free, with no extra
// component state or Context.
export function filterStateFromSearchParams(params: URLSearchParams): FilterState {
  const gen = params.get('gen')
  const type = params.get('type')
  return {
    generations: gen ? gen.split(',').map(Number).filter(Boolean) : [],
    types: type ? type.split(',').filter(Boolean) : [],
    learnsMove: params.get('move') ?? undefined,
    learnMethod: (params.get('method') as LearnMethod) ?? 'any',
    legendaryStatus: (params.get('legendary') as LegendaryStatus) ?? 'any',
    evolutionStage: (params.get('stage') as EvolutionStage) ?? 'any',
    versionGroup: params.get('version') ?? DEFAULT_FILTER_STATE.versionGroup,
  }
}

export function filterStateToSearchParams(filters: FilterState): URLSearchParamsInit {
  const params: Record<string, string> = {}
  if (filters.generations.length > 0) params.gen = filters.generations.join(',')
  if (filters.types.length > 0) params.type = filters.types.join(',')
  if (filters.learnsMove) params.move = filters.learnsMove
  if (filters.learnMethod !== 'any') params.method = filters.learnMethod
  if (filters.legendaryStatus !== 'any') params.legendary = filters.legendaryStatus
  if (filters.evolutionStage !== 'any') params.stage = filters.evolutionStage
  if (filters.versionGroup !== DEFAULT_FILTER_STATE.versionGroup) params.version = filters.versionGroup
  return params
}
