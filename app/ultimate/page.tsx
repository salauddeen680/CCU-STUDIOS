import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { UltimateList } from "@/components/ultimate-list"

export const metadata: Metadata = {
  title: "Ultimate Comic — CCU Studios",
  description: "The flagship saga of the Cosmic Cinematic Universe.",
  alternates: {
    canonical: "https://ccu-studios.vercel.app/ultimate", // 🔥 YAHAN CANONICAL FIX ADD HO GAYA HAI
  },
}

export default function UltimatePage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        
        {/* 🔥 COMICS PAGE KI TARAH SAME HEADER STRUCTURE 🔥 */}
        <header className="mb-8 flex flex-col gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-wide sm:text-4xl">
              <span className="text-glow text-primary">Ultimate</span> Comic
            </h1>
            <p className="mt-2 text-sm text-muted">
              The definitive, canon-defining chapters of the universe.
            </p>
          </div>

          {/* 🔥 LIVE NOW & UPCOMING BADGES (Screenshot ke hisaab se) 🔥 */}
          <div className="flex items-center gap-3 text-xs font-bold tracking-wider">
            <div className="flex items-center gap-2 rounded bg-primary px-3 py-1.5 text-primary-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
              </span>
              LIVE NOW
            </div>
            <div className="flex items-center gap-2 rounded border border-white/20 bg-transparent px-3 py-1.5 text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              UPCOMING (0)
            </div>
          </div>
        </header>

        <UltimateList />
      </div>
    </SiteShell>
  )
}
