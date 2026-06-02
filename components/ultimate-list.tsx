"use client"

import Link from "next/link"
import { useComics } from "@/lib/data"
import { VaultCard } from "./vault-card"
import { GridSkeleton } from "./skeletons"

export function UltimateList() {
  const { comics, loading } = useComics()
  const ultimate = comics.filter((c) => c.ultimate)

  if (loading) return <GridSkeleton count={4} />

  if (ultimate.length === 0)
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

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {ultimate.map((c, i) => (
        <VaultCard key={c.id} item={{ ...c, kind: "comic" }} index={i} />
      ))}
    </div>
  )
}
