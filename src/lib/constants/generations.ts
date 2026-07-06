const GENERATION_NUMBER: Record<string, number> = {
  'generation-i': 1,
  'generation-ii': 2,
  'generation-iii': 3,
  'generation-iv': 4,
  'generation-v': 5,
  'generation-vi': 6,
  'generation-vii': 7,
  'generation-viii': 8,
  'generation-ix': 9,
}

export function generationNumber(name: string): number | undefined {
  return GENERATION_NUMBER[name]
}

export function generationLabel(name: string): string {
  const n = GENERATION_NUMBER[name]
  return n ? `Gen ${n}` : name
}
