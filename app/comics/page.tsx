import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { ComicsList } from "@/components/comics-list"

export const metadata: Metadata = {
  title: "Comics — CCU Studios",
  description: "Browse every comic in the Cosmic Cinematic Universe.",
}

export default function ComicsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-wide sm:text-3xl">
            <span className="text-glow text-primary">Comics</span> Library
          </h1>
          <p className="mt-1 text-sm text-muted">
            Swipe through full-screen, manga-style chapters.
          </p>
        </header>
        <ComicsList />
      </div>
    </SiteShell>
  )
}
