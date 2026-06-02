import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { UltimateList } from "@/components/ultimate-list"

export const metadata: Metadata = {
  title: "Ultimate Comic — CCU Studios",
  description: "The flagship saga of the Cosmic Cinematic Universe.",
}

export default function UltimatePage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6">
          <span className="font-display text-xs uppercase tracking-[0.4em] text-gold text-glow-gold">
            Flagship Saga
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-wide sm:text-4xl">
            The <span className="text-glow text-primary">Ultimate</span> Comic
          </h1>
          <p className="mt-1 text-sm text-muted">
            The definitive, canon-defining chapters of the universe.
          </p>
        </header>
        <UltimateList />
      </div>
    </SiteShell>
  )
}
