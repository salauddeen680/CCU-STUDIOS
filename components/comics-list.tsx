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

  return (
    <div className="space-y-6">
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
          <p className="mt-1 text-sm text-zinc-500">
            {activeTab === "published"
              ? "Add comics from the admin panel."
              : "Admin panel se release status 'Coming Soon (Upcoming)' set karein."}
          </p>
        </div>
      ) : (
        /* 🔵 Grid View */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {currentList.map((c, i) => (
            <div key={c.id} className="relative group">
              {c.publishStatus === "upcoming" && (
                <div className="absolute top-2 right-2 z-20 rounded bg-blue-600 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-md">
                  Coming Soon
                </div>
              )}
              <VaultCard item={{ ...c, kind: "comic" }} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
