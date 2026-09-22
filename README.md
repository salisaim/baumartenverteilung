# Baumartenverteilung

Illustrated atlas of tree species across Germany. **Astro (static) + React island + Cloudflare Pages.**

This package is a working copy of the prototype: parchment plate, forest greens/browns, hover-isolate, Waldanteil bar, DLR/BWI source notes.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Astro prints. Hover a leaf (Kiefer, Fichte, …) to isolate that species. The country outline and names stay.

## Deploy to Cloudflare Pages

1. Push this folder to a GitHub repo (or use Wrangler from the folder).
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → import the repo.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy. No environment variables required.

Or from this folder after `npx wrangler login`:

```bash
npm run deploy
```

## What’s inside

| Path | What |
|---|---|
| `public/baumarten.jpg` | Designed map-as-tree plate |
| `public/data/species.json` | Display palette, BWI shares, neighbors |
| `public/data/atlas.json` | Germany + neighbor GeoJSON (reference) |
| `src/lib/classify-pixel.ts` | Plate-color → species |
| `src/components/atlas.tsx` | Canvas recolor + isolate |
| `DESIGN.md` | Locked visual rules |
| `CODEX.md` | Prompt for Codex to continue (DLR raster, polish, deploy) |

No auth, no database.
