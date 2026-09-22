import { useCallback, useEffect, useRef, useState } from "react";
import { SPECIES, SPECIES_BY_INDEX, SPECIES_ORDER, type SpeciesId } from "@/lib/colors";
import { classifyPixel, salvageCoolPixel, ID_EMPTY, ID_INK, ID_TRUNK } from "@/lib/classify-pixel";
import { REGION_LABELS } from "@/lib/regions";
import { SpeciesIcon } from "@/components/species-icon";
import { cn } from "@/lib/utils";

type Props = {
  focus: SpeciesId | null;
  onFocus: (id: SpeciesId | null) => void;
};

const POSTER = "/baumarten.jpg";
const CROP_BOTTOM = 0.892;
const PAPER = [243, 230, 201] as const;

function hexRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function clampByte(n: number): number {
  if (n < 0) return 0;
  if (n > 255) return 255;
  return n | 0;
}

function colorize(
  sr: number,
  sg: number,
  sb: number,
  base: readonly [number, number, number],
): [number, number, number] {
  const g = (sr * 0.3 + sg * 0.59 + sb * 0.11) / 255;
  const shade = 0.62 + g * 0.58;
  return [clampByte(base[0] * shade), clampByte(base[1] * shade), clampByte(base[2] * shade)];
}

type Layout = { x: number; y: number; w: number; h: number; cw: number; ch: number };

export function Atlas({ focus, onFocus }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const sourceRef = useRef<ImageData | null>(null);
  const idsRef = useRef<Uint8Array | null>(null);
  const outlineRef = useRef<Uint8Array | null>(null);
  const layoutRef = useRef<Layout | null>(null);
  const focusRef = useRef(focus);
  focusRef.current = focus;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; name: string } | null>(null);
  const [box, setBox] = useState<Layout | null>(null);

  const paint = useCallback((focusId: SpeciesId | null) => {
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    const ids = idsRef.current;
    if (!canvas || !source || !ids) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { data: src } = source;
    const out = ctx.createImageData(source.width, source.height);
    const dst = out.data;
    dst.set(src);
    const outline = outlineRef.current;
    const bases = SPECIES_BY_INDEX.map((sid) => hexRgb(SPECIES[sid].hex));
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const o = i * 4;
      if (id === undefined || id === ID_EMPTY || id === ID_INK || id === ID_TRUNK) continue;
      if (outline && outline[i]) continue;
      const base = bases[id];
      if (!base) continue;
      const [nr, ng, nb] = colorize(src[o] ?? 0, src[o + 1] ?? 0, src[o + 2] ?? 0, base);
      const sid = SPECIES_BY_INDEX[id];
      const dim = Boolean(focusId && sid !== focusId);
      const t = dim ? 0.16 : 1;
      dst[o] = Math.round(nr * t + PAPER[0] * (1 - t));
      dst[o + 1] = Math.round(ng * t + PAPER[1] * (1 - t));
      dst[o + 2] = Math.round(nb * t + PAPER[2] * (1 - t));
    }
    if (focusId && outline) {
      for (let i = 0; i < outline.length; i++) {
        if (!outline[i]) continue;
        const o = i * 4;
        dst[o] = 43;
        dst[o + 1] = 33;
        dst[o + 2] = 24;
        dst[o + 3] = 230;
      }
    }
    ctx.putImageData(out, 0, 0);
  }, []);

  const rasterize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!canvas || !wrap || !img || !img.naturalWidth) return;
    const cw = Math.max(280, Math.floor(wrap.clientWidth));
    const ch = Math.max(360, Math.floor(wrap.clientHeight));
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight * CROP_BOTTOM;
    const scale = Math.min(cw / srcW, ch / srcH);
    const w = Math.max(1, Math.round(srcW * scale));
    const h = Math.max(1, Math.round(srcH * scale));
    const x = Math.floor((cw - w) / 2);
    const y = Math.floor((ch - h) / 2);
    const next = { x, y, w, h, cw, ch };
    layoutRef.current = next;
    setBox(next);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.style.left = `${x}px`;
    canvas.style.top = `${y}px`;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, srcW, srcH, 0, 0, w, h);
    const shot = ctx.getImageData(0, 0, w, h);
    const ids = new Uint8Array(w * h);
    const px = shot.data;
    for (let i = 0; i < ids.length; i++) {
      const o = i * 4;
      ids[i] = classifyPixel(px[o] ?? 0, px[o + 1] ?? 0, px[o + 2] ?? 0, px[o + 3] ?? 0);
      if (ids[i] === ID_EMPTY || ids[i] === ID_INK) {
        const salvage = salvageCoolPixel(px[o] ?? 0, px[o + 1] ?? 0, px[o + 2] ?? 0);
        if (salvage !== null) ids[i] = salvage;
      }
    }
    const outline = new Uint8Array(ids.length);
    const ww = w;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < ww - 1; x++) {
        const i = y * ww + x;
        const here = ids[i];
        if (here === ID_EMPTY) continue;
        if (
          ids[i - 1] === ID_EMPTY ||
          ids[i + 1] === ID_EMPTY ||
          ids[i + ww] === ID_EMPTY ||
          ids[i - ww] === ID_EMPTY
        ) {
          outline[i] = 1;
          ids[i] = ID_INK;
        }
      }
    }
    sourceRef.current = shot;
    idsRef.current = ids;
    outlineRef.current = outline;
    setReady(true);
    paint(focusRef.current);
  }, [paint]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const img = new Image();
    imgRef.current = img;
    img.onload = () => rasterize();
    img.onerror = () => setError("The atlas plate could not be loaded.");
    img.src = POSTER;

    const ro = new ResizeObserver(() => {
      if (imgRef.current?.naturalWidth) rasterize();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [rasterize]);

  useEffect(() => {
    if (ready) paint(focus);
  }, [focus, paint, ready]);

  function onMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const ids = idsRef.current;
    const layout = layoutRef.current;
    if (!ids || !layout) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * layout.w);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * layout.h);
    if (x < 0 || y < 0 || x >= layout.w || y >= layout.h) {
      setTip(null);
      return;
    }
    const idx = ids[y * layout.w + x];
    if (idx === undefined || idx >= 200) {
      setTip(null);
      return;
    }
    const sid = SPECIES_BY_INDEX[idx];
    if (!sid) {
      setTip(null);
      return;
    }
    setTip({ x: e.clientX - rect.left + layout.x, y: e.clientY - rect.top + layout.y, name: SPECIES[sid].name });
  }

  return (
    <figure className="flex w-full flex-col">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1264 / 1398" }}
      >
        {!ready ? (
          <img
            src={POSTER}
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-contain object-top"
          />
        ) : null}
        {error ? (
          <p className="absolute inset-0 grid place-items-center font-sans text-sm text-ink-muted">{error}</p>
        ) : null}
        <canvas
          ref={canvasRef}
          className="absolute"
          onMouseMove={onMove}
          onMouseLeave={() => setTip(null)}
        />
        {box ? (
          <svg
            className="pointer-events-none absolute"
            style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
            viewBox={`0 0 ${box.w} ${box.h}`}
            aria-hidden="true"
          >
            {REGION_LABELS.map((label) => {
              const related = !focus || !label.species || label.species === focus;
              const px = label.x * box.w;
              const py = label.y * box.h;
              const rw = Math.min(160, label.name.length * 6.4 + 12);
              return (
                <g
                  key={label.name}
                  transform={`translate(${px},${py})`}
                  opacity={related ? 1 : 0.55}
                >
                  <rect
                    x={-6}
                    y={-11}
                    width={rw}
                    height={18}
                    rx={4}
                    fill="rgba(247,238,216,0.92)"
                    stroke="#c4b7a0"
                    strokeWidth="0.8"
                  />
                  <text
                    x={2}
                    y={2}
                    fill="#2b2118"
                    fontFamily="Source Sans 3, Segoe UI, sans-serif"
                    fontSize="11"
                  >
                    {label.name}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : null}
        {tip ? (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-ink-faint bg-paper-elev px-2 py-1 font-sans text-xs text-ink shadow-sm"
            style={{ left: tip.x + 12, top: tip.y + 12 }}
          >
            {tip.name}
          </div>
        ) : null}
      </div>
      <figcaption className="flex flex-wrap justify-center gap-1 px-2 pb-3 pt-2 sm:gap-3">
        {SPECIES_ORDER.map((id) => {
          const spec = SPECIES[id];
          const active = focus === null || focus === id;
          return (
            <button
              key={id}
              type="button"
              className={cn(
                "flex min-h-11 items-center gap-1.5 rounded-lg px-2 py-1.5 font-sans text-xs text-ink transition-opacity duration-150",
                active ? "opacity-100" : "opacity-35",
              )}
              aria-pressed={focus === id}
              onMouseEnter={() => onFocus(id)}
              onMouseLeave={() => onFocus(null)}
              onFocus={() => onFocus(id)}
              onBlur={() => onFocus(null)}
              onClick={() => onFocus(focus === id ? null : id)}
            >
              <span className={cn("size-8 shrink-0", colorClass(id))}>
                <SpeciesIcon id={id} className="size-8" />
              </span>
              <span>{spec.name}</span>
            </button>
          );
        })}
      </figcaption>
    </figure>
  );
}

function colorClass(id: SpeciesId): string {
  switch (id) {
    case "kiefer":
      return "text-kiefer";
    case "fichte":
      return "text-fichte";
    case "buche":
      return "text-buche";
    case "eiche":
      return "text-eiche";
    case "birke":
      return "text-birke";
    case "tanne":
      return "text-tanne";
    case "douglasie":
      return "text-douglasie";
  }
}
