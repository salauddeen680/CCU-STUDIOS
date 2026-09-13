"use client"

import Link from "next/link"
import { useComics } from "@/lib/data"
import { VaultCard } from "./vault-card"
import { GridSkeleton } from "./skeletons"

export function UltimateList() {
  const { comics = [], loading } = useComics()
  
  // 🔥 FIX: Ab yeh Admin panel ke 'timeline' ko padhega
  const ultimateComics = comics.filter((c: any) => {
    const timelineData = String(c.timeline || "").toLowerCase();
    return (
      c.ultimate || // Purana system (agar ho)
      timelineData.includes("purani") || 
      timelineData.includes("dusri") ||
      timelineData.includes("ultimate")
    );
  })

  if (loading) return <GridSkeleton count={4} />

  if (ultimateComics.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 py-16 text-center">
        <p className="font-display text-lg text-red-500">No Ultimate chapters yet</p>
        <p className="mt-1 text-sm text-zinc-400">
          Select "Purani Timeline" or "Dusri Universe" in the admin panel to feature it here.
        </p>
        <Link href="/comics" className="mt-3 inline-block text-sm text-red-500 underline">
          Browse all comics
        </Link>
      </div>
    )

  // 🔥 EXACT SMART GROUPING LOGIC
  const groupedComics = ultimateComics.reduce((groups: any, comic: any) => {
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
  }, {})

  return (
    <div className="space-y-10 mt-6">
      {Object.entries(groupedComics).map(([seriesName, seriesComics]: [string, any]) => (
        <div key={seriesName} className="space-y-3">
          
          {/* Series Heading */}
          <h2 className="text-xl font-extrabold text-white tracking-wide border-l-4 border-red-600 pl-3">
            {seriesName}
          </h2>
          
          {/* 🔥 HORIZONTAL SCROLLING ROWS */}
          <div className="flex overflow-x-auto gap-4 pb-4 pt-1 no-scrollbar scroll-smooth">
            {seriesComics.map((c: any, i: number) => (
              <div key={c.id} className="relative group w-[150px] sm:w-[180px] flex-shrink-0">
                {/* Yellow Badge */}
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
