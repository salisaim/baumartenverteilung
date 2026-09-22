import { FOREST_SHARE, SPECIES, SPECIES_ORDER, type SpeciesId } from "@/lib/colors";
import { cn } from "@/lib/utils";

type Props = {
  focus: SpeciesId | null;
  onFocus: (id: SpeciesId | null) => void;
};

const TOTAL = SPECIES_ORDER.reduce((sum, id) => sum + FOREST_SHARE[id], 0);

export function ForestMix({ focus, onFocus }: Props) {
  return (
    <section className="px-1 sm:px-2">
      <header className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg text-ink">Waldanteil</h2>
        <p className="font-sans text-xs text-ink-muted">BWI 2022 · share of timberland</p>
      </header>
      <div
        className="flex h-4 overflow-hidden rounded-full border border-ink-faint"
        role="img"
        aria-label="Forest area by species"
      >
        {SPECIES_ORDER.map((id) => {
          const active = focus === null || focus === id;
          return (
            <button
              key={id}
              type="button"
              title={`${SPECIES[id].name} ${FOREST_SHARE[id].toFixed(1)}%`}
              className={cn(
                "h-full min-w-2 p-0 transition-opacity duration-150",
                colorBg(id),
                active ? "opacity-100" : "opacity-30",
              )}
              style={{ width: `${(FOREST_SHARE[id] / TOTAL) * 100}%` }}
              aria-pressed={focus === id}
              onMouseEnter={() => onFocus(id)}
              onMouseLeave={() => onFocus(null)}
              onFocus={() => onFocus(id)}
              onBlur={() => onFocus(null)}
              onClick={() => onFocus(focus === id ? null : id)}
            />
          );
        })}
      </div>
    </section>
  );
}

function colorBg(id: SpeciesId): string {
  switch (id) {
    case "kiefer":
      return "bg-kiefer";
    case "fichte":
      return "bg-fichte";
    case "buche":
      return "bg-buche";
    case "eiche":
      return "bg-eiche";
    case "birke":
      return "bg-birke";
    case "tanne":
      return "bg-tanne";
    case "douglasie":
      return "bg-douglasie";
  }
}
