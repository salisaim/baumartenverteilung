export const SPECIES = {
  kiefer: { id: "kiefer", name: "Kiefer", latin: "Pinus sylvestris", hex: "#5E7344" },
  fichte: { id: "fichte", name: "Fichte", latin: "Picea abies", hex: "#6B4A30" },
  buche: { id: "buche", name: "Buche", latin: "Fagus sylvatica", hex: "#8A9640" },
  eiche: { id: "eiche", name: "Eiche", latin: "Quercus", hex: "#4A6B3C" },
  birke: { id: "birke", name: "Birke", latin: "Betula", hex: "#A8B070" },
  tanne: { id: "tanne", name: "Tanne", latin: "Abies alba", hex: "#8B9A7A" },
  douglasie: { id: "douglasie", name: "Douglasie", latin: "Pseudotsuga", hex: "#3A5E48" },
} as const;

export type SpeciesId = keyof typeof SPECIES;

export const SPECIES_ORDER = [
  "kiefer",
  "fichte",
  "buche",
  "eiche",
  "birke",
  "tanne",
  "douglasie",
] as const satisfies readonly SpeciesId[];

export const SPECIES_INDEX: Record<SpeciesId, number> = {
  kiefer: 0,
  fichte: 1,
  buche: 2,
  eiche: 3,
  birke: 4,
  tanne: 5,
  douglasie: 6,
};

export const SPECIES_BY_INDEX = SPECIES_ORDER;

/** BWI 2022 area shares of stocked timberland (approx.). */
export const FOREST_SHARE: Record<SpeciesId, number> = {
  kiefer: 21.8,
  fichte: 20.9,
  buche: 16.6,
  eiche: 11.5,
  birke: 4.7,
  douglasie: 2.4,
  tanne: 1.9,
};

export const NEIGHBORS = [
  { code: "DK", name: "Denmark", iso: "208", lon: 9.5, lat: 56.15 },
  { code: "NL", name: "Netherlands", iso: "528", lon: 4.7, lat: 52.35 },
  { code: "BE", name: "Belgium", iso: "056", lon: 4.15, lat: 50.5 },
  { code: "FR", name: "France", iso: "250", lon: 4.9, lat: 48.15 },
  { code: "PL", name: "Poland", iso: "616", lon: 16.85, lat: 52.05 },
  { code: "CZ", name: "Czechia", iso: "203", lon: 16.15, lat: 49.65 },
  { code: "AT", name: "Austria", iso: "040", lon: 14.35, lat: 47.15 },
] as const;

export const CALLOUTS = [
  { id: "kiefer" as const, label: "Kiefer belt", lon: 13.55, lat: 53.15 },
  { id: "buche" as const, label: "Buche heartland", lon: 9.55, lat: 50.55 },
  { id: "fichte" as const, label: "Fichte in the southeast", lon: 12.85, lat: 48.55 },
] as const;

export const BRANCHES: [number, number][][] = [
  [
    [11.35, 47.52],
    [10.85, 48.35],
    [10.15, 49.25],
    [9.35, 50.35],
    [8.45, 51.25],
    [7.85, 51.95],
  ],
  [
    [11.65, 47.58],
    [12.05, 48.55],
    [12.45, 49.55],
    [12.85, 50.45],
    [13.45, 51.35],
    [13.95, 52.05],
  ],
];
