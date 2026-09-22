# Codex prompt — finish and ship on Cloudflare

Copy everything below the line into Codex. Work only in this repo.

---

You are building **Baumartenverteilung**, an illustrated atlas of tree species across Germany, as an **Astro static site on Cloudflare Pages**.

This repo already contains a working prototype. Do not start over. Do not restyle. Do not add auth, a CMS, or a database.

## Product (locked)

- A parchment **map that is also a tree**. Germany’s geography is the canopy + trunk. Neighbor pills (Denmark, Czechia, Poland, …) stay. No new leader lines from those pills.
- Palette is **naturally occurring greens and browns only** (`src/lib/colors.ts`). Never put blue, red, indigo, or purple on the map or in the legend.
- Hover/focus a species leaf → isolate that species. **Germany’s outline and region names stay visible.**
- Waldanteil stacked bar uses BWI 2022 shares. Data-sources panel cites DLR 2022, BWI 2022, Thünen.
- Fonts: Fraunces + Source Sans 3. Paper `#F3E6C9`, ink `#2B2118`.

Read `DESIGN.md` before changing any pixel.

## Stack (locked)

- Astro 5, `output: "static"`
- `@astrojs/cloudflare` adapter
- One React island (`src/components/App.tsx` with `client:load`) for the atlas
- Tailwind v4 via `@tailwindcss/vite`
- Wrangler: `wrangler.jsonc`, Pages output `dist`
- No TanStack Start, no Vercel, no Node server at runtime

## What is already done

- Plate: `public/baumarten.jpg`
- Classifier + colorize: `src/lib/classify-pixel.ts`, `src/components/atlas.tsx`
- Legend, Waldanteil, sources, region labels
- OG card `public/og.jpg`, favicon `public/favicon.svg`

## Your job (do in order)

1. `npm install` and `npm run build`. Fix any Astro/Cloudflare adapter issues until `dist/` is a static site (HTML + `/baumarten.jpg` + JS). Do not change the visual system to make the build pass.
2. Confirm isolate still keeps the outline + names. Confirm leftover plate-blue becomes Kiefer olive and leftover indigo becomes Birke lime. Shadows in the canopy must not go black.
3. Optional production upgrade (only if the build is already good): swap the painted fill for DLR **Tree Species Germany 2022** 10 m (CC BY 4.0, DOI 10.15489/smh8w3j8i962, WMS layer `TREE_SPECIES_DE_2022` on `https://geoservice.dlr.de/eoc/land/wms`). Keep the designed plate as fallback. Map DLR classes onto the same seven display hexes. Cite DLR in the sources panel (already listed).
4. Cloudflare Pages: keep `npm run build` → `dist`. `wrangler.jsonc` already sets `pages_build_output_dir`. Add nothing that needs secrets.
5. If you add routes, they must be static or Cloudflare-compatible. Prefer no server functions.

## Do not

- Redraw the map from scratch
- Cover country-name pills with rectangles
- Restore pointer lines to Denmark/Czechia/Poland
- Use eggs, isometric “data vis” decoration, or a dark theme
- Mention localhost in the UI
- Check in `node_modules` or `dist`

## Done when

- `npm run build` succeeds
- The page shows the parchment Germany-tree, forest palette, working isolate, Waldanteil bar
- `npm run deploy` (or Cloudflare git build) can publish Pages with zero env vars
