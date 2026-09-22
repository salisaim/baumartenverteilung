# Locked design (do not restyle)

This is a parchment **map that is a tree**, not a GIS choropleth and not a cartoon tree.

## Look

- Cream paper `#F3E6C9`, ink `#2B2118`
- Display type: Fraunces. Body: Source Sans 3
- Forest pigments only: olive, umber, leaf green, oak, lime, sage, fir
- No eggs, no red/blue/indigo legends, no dark-mode, no dashboard chrome

## Map behaviour

- `public/baumarten.jpg` is the designed plate (1264×1568). Crop the bottom legend band at `0.892` of height.
- Recolor classified pixels to the display hex in `src/lib/colors.ts`. Keep paper, ink outline, and trunk grain.
- Isolate a species on hover/focus of a leaf row. **Germany outline and region names stay visible.**
- Neighbor country **pills stay**. Do not cover Denmark (or any pill) with a rectangle. Pointer lines from pills to the border were trimmed; do not draw new leader lines.
- Leftover plate-blue = Kiefer. Leftover indigo = Birke. Lift crushed shadows so canopy does not go black.

## Data

| Role | Source | File / access |
|---|---|---|
| Painted plate (prototype) | Designed atlas | `public/baumarten.jpg` |
| Neighbor outlines (reference) | Natural Earth-style GeoJSON | `public/data/atlas.json` |
| Species + shares + poster hues | BWI 2022 + plate swatches | `public/data/species.json`, `src/lib/colors.ts` |
| Production raster | DLR Tree Species Germany 2022, 10 m, CC BY 4.0 | WMS `TREE_SPECIES_DE_2022` — DOI 10.15489/smh8w3j8i962 |
| Official shares | Bundeswaldinventur 2022 | https://www.bundeswaldinventur.de/ |

Do not invent a new palette. Match the live prototype: Kiefer olive, Fichte umber, Buche yellow-green, Eiche oak, Birke lime, Tanne sage, Douglasie fir.
