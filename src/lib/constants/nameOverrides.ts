// PokéAPI names are kebab-case and some don't survive naive title-casing.
const NAME_OVERRIDES: Record<string, string> = {
  'nidoran-f': 'Nidoran♀',
  'nidoran-m': 'Nidoran♂',
  'mr-mime': 'Mr. Mime',
  'mr-rime': 'Mr. Rime',
  'mime-jr': 'Mime Jr.',
  farfetchd: "Farfetch'd",
  'sirfetchd': "Sirfetch'd",
  'ho-oh': 'Ho-Oh',
  'porygon-z': 'Porygon-Z',
  'type-null': 'Type: Null',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
  'tapu-koko': 'Tapu Koko',
  'tapu-lele': 'Tapu Lele',
  'tapu-bulu': 'Tapu Bulu',
  'tapu-fini': 'Tapu Fini',
  'will-o-wisp': 'Will-O-Wisp',
  'x-scissor': 'X-Scissor',
  'firered-leafgreen': 'FireRed / LeafGreen',
}

export function toDisplayName(name: string): string {
  if (NAME_OVERRIDES[name]) return NAME_OVERRIDES[name]
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
