"use client"

import { useState } from "react"
import { useComics } from "@/lib/data"
import { VaultCard } from "./vault-card"
import { GridSkeleton } from "./skeletons"
import { Sparkles, Clock } from "lucide-react"

export function ComicsList() {
  const { comics = [], loading } = useComics()
  const [activeTab, setActiveTab] = useState<"published" | "upcoming">("published")

  if (loading) return <GridSkeleton count={8} />

  // Separate Live (Published) and Upcoming Comics
  const publishedComics = comics.filter(
    (c) => !c.publishStatus || c.publishStatus === "published"
  )
  const upcomingComics = comics.filter((c) => c.publishStatus === "upcoming")

  const currentList = activeTab === "published" ? publishedComics : upcomingComics

  // 🔥 AUTO-GROUPING LOGIC (IC STUDIO STYLE)
  // Yeh aapke title se main series ka naam nikal kar alag-alag section banayega
  const groupedComics = currentList.reduce((groups, comic) => {
    // Title se main naam nikalna (colon, dash, 'issue' ya 'chapter' se pehle ka hissa)
    let seriesName = comic.title.split(/[:\-]|issue|chapter/i)[0].trim().toUpperCase()
    if (!seriesName) seriesName = "OTHER COMICS"

    if (!groups[seriesName]) {
      groups[seriesName] = []
    }
    groups[seriesName].push(comic)
    return groups
  }, {} as Record<string, typeof comics>)

  return (
    <div className="space-y-8">
      {/* 🟢 Tabs for Live vs Upcoming Filter */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab("published")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase transition-all ${
            activeTab === "published"
              ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Live Now ({publishedComics.length})
        </button>

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase transition-all ${
            activeTab === "upcoming"
              ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Upcoming ({upcomingComics.length})
        </button>
      </div>

      {/* 🔴 Empty State */}
      {currentList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 py-16 text-center">
          <p className="font-display text-lg text-white">
            {activeTab === "published" ? "No live comics yet" : "No upcoming comics scheduled"}
          </p>
        </div>
      ) : (
        /* 🔵 CATEGORY WISE GRID (IC STUDIO STYLE) */
        <div className="space-y-12 mt-6">
          {Object.entries(groupedComics).map(([seriesName, seriesComics]) => (
            <div key={seriesName} className="space-y-4">
              
              {/* Main Series Title (Jaise: TRIVEXA, ARYAN) */}
              <h2 className="text-xl font-extrabold text-white tracking-wide border-l-4 border-red-600 pl-3">
                {seriesName}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {seriesComics.map((c, i) => (
                  <div key={c.id} className="relative group">
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
      )}
    </div>
  )
}
