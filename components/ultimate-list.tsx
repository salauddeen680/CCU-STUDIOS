"use client"

import Link from "next/link"
import { useComics } from "@/lib/data"
import { VaultCard } from "./vault-card"
import { GridSkeleton } from "./skeletons"

export function UltimateList() {
  const { comics, loading } = useComics()
  
  const ultimateComics = comics.filter((c) => c.ultimate)

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

  const groupedBySeries: { [key: string]: any[] } = {}
  
  ultimateComics.forEach((comic) => {
    const seriesName = comic.series || comic.title.split(":")[0].trim() || "Ultimate Series"
    if (!groupedBySeries[seriesName]) {
      groupedBySeries[seriesName] = []
    }
    groupedBySeries[seriesName].push(comic)
  })

  return (
    <div className="space-y-10">
      {Object.entries(groupedBySeries).map(([seriesName, seriesComics]) => (
        <div key={seriesName} className="space-y-4">
          {/* Section Heading with Red Vertical Line */}
          <h2 className="border-l-4 border-primary pl-3 font-display text-lg font-bold uppercase tracking-wider text-white">
            {seriesName}
          </h2>

          {/* 🔥 FIXED GRID LAYOUT: Cards ab stretch nahi honge, balki standard grid mein sahi size par dikhenge 🔥 */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {seriesComics.map((c, i) => (
              <div key={c.id} className="w-full">
                <VaultCard item={{ ...c, kind: "comic" }} index={i} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
