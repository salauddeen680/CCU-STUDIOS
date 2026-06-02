import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { CharactersList } from "@/components/characters-list"

export const metadata: Metadata = {
  title: "Characters — CCU Studios",
  description: "Meet the heroes and villains of the Cosmic Cinematic Universe.",
}

export default function CharactersPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-wide sm:text-3xl">
            The <span className="text-glow-gold text-gold">Universe</span>
          </h1>
          <p className="mt-1 text-sm text-muted">
            Explore every character&apos;s story, powers, and arcs.
          </p>
        </header>
        <CharactersList />
      </div>
    </SiteShell>
  )
}
