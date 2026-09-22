import { SPECIES_INDEX, SPECIES_ORDER, type SpeciesId } from "./colors";

export const ID_EMPTY = 255;
export const ID_INK = 254;
export const ID_TRUNK = 253;

const PAPER = [243, 230, 201] as const;

/** Colors in the painted plate — not the display palette. */
const POSTER_HEX: Record<SpeciesId, string> = {
  kiefer: "#2F7FA8",
  fichte: "#C24B2A",
  buche: "#D39A22",
  eiche: "#4F8A45",
  birke: "#7A4A6E",
  tanne: "#C9D6B8",
  douglasie: "#2C6B58",
};

const SWATCHES: Record<SpeciesId, [number, number, number][]> = {
  kiefer: [
    [47, 127, 168],
    [35, 100, 145],
    [70, 155, 195],
    [40, 80, 120],
    [30, 70, 100],
    [55, 140, 170],
    [47, 106, 118],
    [38, 120, 157],
    [23, 91, 102],
    [56, 129, 148],
    [39, 124, 145],
    [28, 69, 71],
    [18, 53, 55],
    [20, 55, 95],
    [25, 45, 80],
    [64, 108, 117],
  ],
  fichte: [
    [194, 75, 42],
    [180, 55, 32],
    [210, 95, 50],
    [165, 48, 28],
    [200, 110, 55],
    [150, 60, 35],
  ],
  buche: [
    [211, 154, 34],
    [196, 140, 28],
    [180, 125, 40],
    [220, 175, 70],
    [170, 110, 35],
    [200, 150, 55],
  ],
  eiche: [
    [79, 138, 69],
    [58, 115, 55],
    [90, 155, 80],
    [46, 90, 48],
    [70, 110, 60],
    [40, 80, 50],
  ],
  birke: [
    [122, 74, 110],
    [100, 50, 90],
    [140, 85, 125],
    [90, 40, 80],
    [96, 74, 94],
    [77, 65, 85],
    [90, 67, 87],
    [80, 45, 100],
    [60, 40, 95],
    [50, 35, 80],
    [112, 90, 111],
  ],
  tanne: [
    [201, 214, 184],
    [185, 200, 165],
    [170, 190, 150],
  ],
  douglasie: [
    [44, 107, 88],
    [36, 90, 75],
    [28, 78, 68],
    [50, 120, 100],
  ],
};

function dist2(r: number, g: number, b: number, c: readonly [number, number, number]): number {
  const dr = r - c[0];
  const dg = g - c[1];
  const db = b - c[2];
  return dr * dr + dg * dg + db * db;
}

function rgbHue(r: number, g: number, b: number, max: number, min: number): number {
  const c = max - min;
  if (c < 1) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / c) % 6;
  else if (max === g) h = (b - r) / c + 2;
  else h = (r - g) / c + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h;
}

/** Cool leftover plate paint: old Kiefer blue or Birke indigo. */
export function salvageCoolPixel(r: number, g: number, b: number): number | null {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const lum = (r * 299 + g * 587 + b * 114) / 1000;
  if (chroma < 12 || lum < 16 || lum > 220) return null;
  const hue = rgbHue(r, g, b, max, min);
  if (hue >= 175 && hue < 255) return SPECIES_INDEX.kiefer;
  if (hue >= 255 && hue <= 335) return SPECIES_INDEX.birke;
  if (b > r + 10 && b > g + 2) return SPECIES_INDEX.kiefer;
  if (b > g + 8 && r > g + 4) return SPECIES_INDEX.birke;
  return null;
}

export function classifyPixel(r: number, g: number, b: number, a: number): number {
  if (a < 20) return ID_EMPTY;
  if (dist2(r, g, b, PAPER) < 1600) return ID_EMPTY;
  if (r > 220 && g > 205 && b > 175 && Math.abs(r - g) < 28) return ID_EMPTY;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (r * 299 + g * 587 + b * 114) / 1000;
  const chroma = max - min;
  const hue = rgbHue(r, g, b, max, min);
  const cool = b > r + 6 || (g > r + 8 && b > r);

  const fromCool = salvageCoolPixel(r, g, b);
  if (fromCool !== null && lum < 95) return fromCool;

  if (!cool) {
    if (max < 42 && chroma < 18) return ID_INK;
    if (lum < 62 && chroma < 16) return ID_INK;
    if (lum < 100 && chroma < 14) return ID_INK;
  }

  const brown =
    r > g &&
    r > b &&
    r - b > 18 &&
    r - g < 85 &&
    g - b < 45 &&
    r < 165 &&
    r > 48 &&
    lum > 40 &&
    lum < 150 &&
    chroma < 95 &&
    g > 28;
  if (brown && b < 90 && g < 120 && !cool) return ID_TRUNK;

  let best = ID_EMPTY;
  let bestD = 4200;
  for (const id of SPECIES_ORDER) {
    const hex = POSTER_HEX[id];
    const n = Number.parseInt(hex.slice(1), 16);
    const main: [number, number, number] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    const dMain = dist2(r, g, b, main);
    if (dMain < bestD) {
      bestD = dMain;
      best = SPECIES_INDEX[id];
    }
    for (const sw of SWATCHES[id]) {
      const d = dist2(r, g, b, sw);
      if (d < bestD) {
        bestD = d;
        best = SPECIES_INDEX[id];
      }
    }
  }
  if (bestD > 5600) {
    if (fromCool !== null) return fromCool;
    if (chroma > 16 && lum > 28 && lum < 220) {
      if (hue >= 175 && hue < 255) return SPECIES_INDEX.kiefer;
      if (hue <= 38 || hue >= 345) return SPECIES_INDEX.fichte;
      if (hue > 38 && hue < 78) return SPECIES_INDEX.buche;
      if (hue >= 255 && hue <= 335) return SPECIES_INDEX.birke;
      if (hue >= 78 && hue < 155) return SPECIES_INDEX.eiche;
    }
    if (!cool && lum < 90) return ID_INK;
    return ID_EMPTY;
  }
  return best;
}
