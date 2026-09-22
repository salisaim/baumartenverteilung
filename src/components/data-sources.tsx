import { DATA_SOURCES } from "@/lib/data-sources";

export function DataSources() {
  return (
    <details className="rounded-xl border border-ink-faint bg-paper-elev px-4 py-3">
      <summary className="cursor-pointer font-sans text-sm text-ink">
        Production data · DLR 10 m, BWI 2022, Thünen
      </summary>
      <ul className="mt-3 space-y-3">
        {DATA_SOURCES.map((src) => (
          <li key={src.id} className="border-t border-ink-faint pt-3 first:border-t-0 first:pt-0">
            <p className="font-sans text-xs font-medium uppercase tracking-wide text-ink-muted">{src.role}</p>
            <a
              href={src.href}
              className="font-display text-base text-ink underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {src.title}
            </a>
            <p className="font-sans text-sm text-ink-muted text-pretty">
              {src.owner} · {src.year} · {src.license}
              {src.doi ? ` · DOI ${src.doi}` : ""}
            </p>
            <p className="mt-1 font-sans text-sm text-ink text-pretty">{src.detail}</p>
            <p className="mt-1 font-sans text-xs text-ink-muted">{src.access}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}
