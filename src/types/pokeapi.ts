// Minimal typed slices of PokéAPI responses — only the fields this app reads.

export interface NamedApiResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  results: NamedApiResource[]
}

export interface PokemonMoveVersionGroupDetail {
  level_learned_at: number
  move_learn_method: NamedApiResource
  version_group: NamedApiResource
  order: number | null
}

export interface PokemonMove {
  move: NamedApiResource
  version_group_details: PokemonMoveVersionGroupDetail[]
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: NamedApiResource
}

export interface PokemonTypeSlot {
  slot: number
  type: NamedApiResource
}

export interface PokemonSprites {
  front_default: string | null
  back_default: string | null
  other?: {
    'official-artwork'?: {
      front_default: string | null
    }
  }
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  species: NamedApiResource
  sprites: PokemonSprites
  stats: PokemonStat[]
  types: PokemonTypeSlot[]
  moves: PokemonMove[]
}

export interface PokemonSpecies {
  id: number
  name: string
  is_legendary: boolean
  is_mythical: boolean
  generation: NamedApiResource
  evolution_chain: { url: string }
  genera: { genus: string; language: NamedApiResource }[]
}

export interface EvolutionDetail {
  trigger: NamedApiResource | null
  min_level: number | null
  item: NamedApiResource | null
  held_item: NamedApiResource | null
  known_move: NamedApiResource | null
  known_move_type: NamedApiResource | null
  min_happiness: number | null
  min_affection: number | null
  min_beauty: number | null
  gender: number | null
  location: NamedApiResource | null
  needs_overworld_rain: boolean
  party_species: NamedApiResource | null
  party_type: NamedApiResource | null
  relative_physical_stats: number | null
  time_of_day: string
  trade_species: NamedApiResource | null
  turn_upside_down: boolean
  version_group: NamedApiResource
}

export interface ChainLink {
  is_baby: boolean
  species: NamedApiResource
  evolution_details: EvolutionDetail[]
  evolves_to: ChainLink[]
}

export interface EvolutionChain {
  id: number
  chain: ChainLink
}

export interface TypeDamageRelations {
  double_damage_from: NamedApiResource[]
  double_damage_to: NamedApiResource[]
  half_damage_from: NamedApiResource[]
  half_damage_to: NamedApiResource[]
  no_damage_from: NamedApiResource[]
  no_damage_to: NamedApiResource[]
}

export interface PokemonType {
  id: number
  name: string
  damage_relations: TypeDamageRelations
  pokemon: { slot: number; pokemon: NamedApiResource }[]
}

export interface MoveMachineRef {
  machine: { url: string }
  version_group: NamedApiResource
}

export interface Move {
  id: number
  name: string
  power: number | null
  pp: number | null
  accuracy: number | null
  damage_class: NamedApiResource
  type: NamedApiResource
  machines: MoveMachineRef[]
  generation: NamedApiResource
  learned_by_pokemon: NamedApiResource[]
}

export interface Machine {
  id: number
  item: NamedApiResource
  move: NamedApiResource
  version_group: NamedApiResource
}

export interface Generation {
  id: number
  name: string
  main_region: NamedApiResource
  pokemon_species: NamedApiResource[]
  moves: NamedApiResource[]
  types: NamedApiResource[]
  version_groups: NamedApiResource[]
}

export interface EncounterVersionDetail {
  max_chance: number
  version: NamedApiResource
  encounter_details: {
    min_level: number
    max_level: number
    chance: number
    method: NamedApiResource
  }[]
}

export interface LocationAreaEncounter {
  location_area: NamedApiResource
  version_details: EncounterVersionDetail[]
}
