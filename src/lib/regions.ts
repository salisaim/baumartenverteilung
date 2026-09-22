import type { SpeciesId } from "./colors";

export type RegionLabel = {
  name: string;
  x: number;
  y: number;
  species?: SpeciesId;
};

/** Positions are 0–1 across the cropped atlas plate. */
export const REGION_LABELS: RegionLabel[] = [
  { name: "Schleswig", x: 0.40, y: 0.15 },
  { name: "Brandenburg", x: 0.70, y: 0.30, species: "kiefer" },
  { name: "Harz", x: 0.50, y: 0.40 },
  { name: "Spessart", x: 0.36, y: 0.50, species: "buche" },
  { name: "Schwarzwald", x: 0.27, y: 0.68 },
  { name: "Bayern", x: 0.55, y: 0.76, species: "fichte" },
  { name: "Bayerischer Wald", x: 0.72, y: 0.68, species: "fichte" },
];
