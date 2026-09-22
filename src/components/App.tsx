import { useState } from "react";
import { Atlas } from "@/components/atlas";
import { ForestMix } from "@/components/forest-mix";
import { DataSources } from "@/components/data-sources";
import type { SpeciesId } from "@/lib/colors";

export default function App() {
  const [focus, setFocus] = useState<SpeciesId | null>(null);

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-3 px-3 py-4 sm:gap-4 sm:px-6 sm:py-6">
      <h1 className="sr-only">Baumartenverteilung — tree species across Germany</h1>
      <Atlas focus={focus} onFocus={setFocus} />
      <ForestMix focus={focus} onFocus={setFocus} />
      <DataSources />
      <p className="pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center font-sans text-xs text-ink-muted text-pretty">
        Hover a leaf to isolate a species. The country outline and region names stay. The plate is
        the designed atlas; production rasters are DLR 2022 (10 m) and BWI 2022 shares.
      </p>
    </main>
  );
}
