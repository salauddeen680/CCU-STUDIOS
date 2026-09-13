"use client"

import Link from "next/link"
import { useComics } from "@/lib/data"
import { VaultCard } from "./vault-card"
import { GridSkeleton } from "./skeletons"

export function UltimateList() {
  const { comics = [], loading } = useComics()
  
  // 🔥 FILTER: Sirf Ultimate/Alternate Comics
  const ultimateComics = comics.filter((c) => {
    return c.ultimate === true || c.timeline === "purani" || c.timeline === "dusri";
  })

  if (loading) return <GridSkeleton count={4} />

  if (ultimateComics.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-gold/30 bg-card/50 py-16 text-center">
        <p className="font-display text-lg text-gold">No Ultimate chapters yet</p>
        <p className="mt-1 text-sm text-muted">
          Mark a comic as &quot;Ultimate&quot; in the admin panel to feature it here.
        </p>
        <Link href="/comics" className="mt-3 inline-block text-sm text-primary underline">
          Browse all comics
        </Link>
      </div>
    )

  const groupedComics = ultimateComics.reduce((groups, comic) => {
    let titleUpper = comic.title.toUpperCase()
    let seriesName = "ULTIMATE SERIES"
    
    if (titleUpper.includes("TRIVEXA")) {
      seriesName = "TRIVEXA"
    } else if (titleUpper.includes("ARYAN")) {
      seriesName = "ARYAN: THE BEAST"
    } else if (titleUpper.includes("ALLIANCE") || titleUpper.includes("CCU: THE ALLIANCE")) {
      seriesName = "CCU: THE ALLIANCE"
    } else {
      seriesName = comic.title.split(/[:\-]|issue|chapter/i)[0].trim().toUpperCase()
    }

    if (!groups[seriesName]) {
      groups[seriesName] = []
    }
    groups[seriesName].push(comic)
    return groups
  }, {} as Record<string, typeof comics>)

  return (
    <div className="space-y-10 mt-6">
      {Object.entries(groupedComics).map(([seriesName, seriesComics]) => (
        <div key={seriesName} className="space-y-3">
          <h2 className="text-xl font-extrabold text-white tracking-wide border-l-4 border-red-600 pl-3">
            {seriesName}
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4 pt-1 no-scrollbar scroll-smooth">
            {seriesComics.map((c, i) => (
              <div key={c.id} className="relative group w-[150px] sm:w-[180px] flex-shrink-0">
                <div className="absolute top-2 right-2 z-20 rounded bg-yellow-400 px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-md">
                  {c.publishStatus === "upcoming" ? "UPCOMING" : "RELEASED"}
                </div>
                <VaultCard item={{ ...c, kind: "comic" }} index={i} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
