"use client"

import { useComics } from "@/lib/data"
import { VaultCard } from "./vault-card"
import { GridSkeleton } from "./skeletons"

export function ComicsList() {
  const { comics, loading } = useComics()

  if (loading) return <GridSkeleton count={8} />

  if (comics.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
        <p className="font-display text-lg">No comics yet</p>
        <p className="mt-1 text-sm text-muted">Add comics from the admin panel.</p>
      </div>
    )

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {comics.map((c, i) => (
        <VaultCard key={c.id} item={{ ...c, kind: "comic" }} index={i} />
      ))}
    </div>
  )
}
