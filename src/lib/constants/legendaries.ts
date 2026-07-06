// Bundled rather than fetched per-candidate: an unfiltered "legendary" query
// with no generation/type narrowing could otherwise mean checking all ~1300
// species' /pokemon-species data just for one boolean. This combines both
// is_legendary and is_mythical into the single toggle the spec calls for.
// Known-limitation: Ultra Beasts' legendary flag isn't independently verified
// here — treated as non-legendary for now.
export const LEGENDARY_OR_MYTHICAL_SPECIES = new Set([
  // Gen 1
  'articuno', 'zapdos', 'moltres', 'mewtwo', 'mew',
  // Gen 2
  'raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi',
  // Gen 3
  'regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon', 'rayquaza',
  'jirachi', 'deoxys',
  // Gen 4
  'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas', 'giratina',
  'cresselia', 'manaphy', 'darkrai', 'shaymin', 'arceus',
  // Gen 5
  'cobalion', 'terrakion', 'virizion', 'tornadus', 'thundurus', 'reshiram', 'zekrom',
  'landorus', 'kyurem', 'victini', 'keldeo', 'meloetta', 'genesect',
  // Gen 6
  'xerneas', 'yveltal', 'zygarde', 'diancie', 'hoopa', 'volcanion',
  // Gen 7
  'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini', 'cosmog', 'cosmoem', 'solgaleo',
  'lunala', 'necrozma', 'magearna', 'marshadow', 'zeraora', 'meltan', 'melmetal',
  // Gen 8
  'zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu', 'regieleki', 'regidrago',
  'glastrier', 'spectrier', 'calyrex', 'zarude',
  // Gen 9
  'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu', 'koraidon', 'miraidon', 'okidogi',
  'munkidori', 'fezandipiti', 'ogerpon', 'terapagos', 'pecharunt',
])

export function isLegendaryOrMythical(speciesName: string): boolean {
  return LEGENDARY_OR_MYTHICAL_SPECIES.has(speciesName)
}
