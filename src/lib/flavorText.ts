interface FlavorTextEntry {
  flavor_text: string
  language: { name: string }
}

// PokéAPI ships flavor text with the original games' literal line breaks and
// page-break characters (form feed, where the in-game textbox would pause
// for the player to advance) — collapse those into normal prose spacing.
function cleanFlavorText(text: string): string {
  return text
    .replace(/[\n\f\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Picks the best English entry: one matching `isPreferred` (e.g. this app's
// FireRed theming) if there is one, otherwise whichever English entry comes
// first — some Pokémon/moves postdate FireRed and simply have no entry for it.
export function pickFlavorText<T extends FlavorTextEntry>(
  entries: T[],
  isPreferred: (entry: T) => boolean,
): string | undefined {
  const english = entries.filter((e) => e.language.name === 'en')
  const chosen = english.find(isPreferred) ?? english[0]
  return chosen ? cleanFlavorText(chosen.flavor_text) : undefined
}
