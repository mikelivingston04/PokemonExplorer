import type { PokemonSprites } from '@/types/pokeapi'

export interface SpriteTimelineEntry {
  generation: string
  generationLabel: string
  versionLabel: string
  sprite: string
  isFireRed: boolean
}

const GENERATION_ORDER = [
  'generation-i',
  'generation-ii',
  'generation-iii',
  'generation-iv',
  'generation-v',
  'generation-vi',
  'generation-vii',
  'generation-viii',
  'generation-ix',
]

const GENERATION_LABELS: Record<string, string> = {
  'generation-i': 'Gen 1',
  'generation-ii': 'Gen 2',
  'generation-iii': 'Gen 3',
  'generation-iv': 'Gen 4',
  'generation-v': 'Gen 5',
  'generation-vi': 'Gen 6',
  'generation-vii': 'Gen 7',
  'generation-viii': 'Gen 8',
  'generation-ix': 'Gen 9',
}

// A generation can ship several games' worth of sprites (Gen 3 alone has
// Ruby/Sapphire, Emerald, and this app's own FireRed/LeafGreen) — this picks
// one representative per generation, preferring FireRed/LeafGreen where it
// exists and otherwise whichever tends to be the most visually polished.
const PREFERRED_VERSION_GROUPS: Record<string, string[]> = {
  'generation-i': ['red-blue', 'yellow'],
  'generation-ii': ['crystal', 'gold', 'silver'],
  'generation-iii': ['firered-leafgreen', 'emerald', 'ruby-sapphire'],
  'generation-iv': ['platinum', 'diamond-pearl', 'heartgold-soulsilver'],
  'generation-v': ['black-white'],
  'generation-vi': ['omegaruby-alphasapphire', 'x-y'],
  'generation-vii': ['ultra-sun-ultra-moon', 'icons'],
  'generation-viii': ['brilliant-diamond-shining-pearl', 'icons'],
  'generation-ix': ['scarlet-violet'],
}

const VERSION_GROUP_LABELS: Record<string, string> = {
  'red-blue': 'Red / Blue',
  yellow: 'Yellow',
  crystal: 'Crystal',
  gold: 'Gold',
  silver: 'Silver',
  emerald: 'Emerald',
  'firered-leafgreen': 'FireRed / LeafGreen',
  'ruby-sapphire': 'Ruby / Sapphire',
  'diamond-pearl': 'Diamond / Pearl',
  'heartgold-soulsilver': 'HeartGold / SoulSilver',
  platinum: 'Platinum',
  'black-white': 'Black / White',
  'omegaruby-alphasapphire': 'Omega Ruby / Alpha Sapphire',
  'x-y': 'X / Y',
  'ultra-sun-ultra-moon': 'Ultra Sun / Ultra Moon',
  icons: 'Icon',
  'brilliant-diamond-shining-pearl': 'Brilliant Diamond / Shining Pearl',
  'scarlet-violet': 'Scarlet / Violet',
}

// One tile per generation this Pokémon has appeared in, oldest first — a
// Pokémon introduced later (e.g. Gen 6+) simply has a shorter timeline.
//
// `debutGeneration` (the species' own generation, e.g. "generation-vi")
// filters out anything earlier — PokeAPI's sprite pack backfills a
// "generation-v black-white" battle sprite for every Pokémon regardless of
// when it actually debuted (fan tools reuse that folder as a shared battle
// sprite set), which would otherwise make e.g. Greninja look like it
// existed in Black/White a generation before it was introduced.
export function buildSpriteTimeline(sprites: PokemonSprites, debutGeneration?: string): SpriteTimelineEntry[] {
  const versions = sprites.versions
  if (!versions) return []

  const debutIndex = debutGeneration ? GENERATION_ORDER.indexOf(debutGeneration) : 0

  const entries: SpriteTimelineEntry[] = []
  for (const generation of GENERATION_ORDER) {
    if (debutIndex > 0 && GENERATION_ORDER.indexOf(generation) < debutIndex) continue
    const groups = versions[generation]
    if (!groups) continue

    const candidates = PREFERRED_VERSION_GROUPS[generation] ?? Object.keys(groups)
    const versionGroup =
      candidates.find((g) => groups[g]?.front_default) ?? Object.keys(groups).find((g) => groups[g]?.front_default)
    const sprite = versionGroup ? groups[versionGroup].front_default : null
    if (!versionGroup || !sprite) continue

    entries.push({
      generation,
      generationLabel: GENERATION_LABELS[generation] ?? generation,
      versionLabel: VERSION_GROUP_LABELS[versionGroup] ?? versionGroup,
      sprite,
      isFireRed: versionGroup === 'firered-leafgreen',
    })
  }
  return entries
}
