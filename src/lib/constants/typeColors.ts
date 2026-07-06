export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

export const ALL_TYPE_NAMES: PokemonType[] = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

// Canonical Pokémon type colors, used consistently for every type badge/chart in the app.
export const TYPE_COLORS: Record<PokemonType, { bg: string; fg: string }> = {
  normal: { bg: '#A8A878', fg: '#08060d' },
  fire: { bg: '#F08030', fg: '#ffffff' },
  water: { bg: '#6890F0', fg: '#ffffff' },
  electric: { bg: '#F8D030', fg: '#08060d' },
  grass: { bg: '#78C850', fg: '#08060d' },
  ice: { bg: '#98D8D8', fg: '#08060d' },
  fighting: { bg: '#C03028', fg: '#ffffff' },
  poison: { bg: '#A040A0', fg: '#ffffff' },
  ground: { bg: '#E0C068', fg: '#08060d' },
  flying: { bg: '#A890F0', fg: '#08060d' },
  psychic: { bg: '#F85888', fg: '#ffffff' },
  bug: { bg: '#A8B820', fg: '#08060d' },
  rock: { bg: '#B8A038', fg: '#ffffff' },
  ghost: { bg: '#705898', fg: '#ffffff' },
  dragon: { bg: '#7038F8', fg: '#ffffff' },
  dark: { bg: '#705848', fg: '#ffffff' },
  steel: { bg: '#B8B8D0', fg: '#08060d' },
  fairy: { bg: '#EE99AC', fg: '#08060d' },
}

export function isPokemonType(name: string): name is PokemonType {
  return name in TYPE_COLORS
}
