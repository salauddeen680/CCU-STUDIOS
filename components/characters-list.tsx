"use client"

import { useCharacters } from "@/lib/data"
import { VaultCard } from "./vault-card"
import { GridSkeleton } from "./skeletons"

export function CharactersList() {
  const { characters, loading } = useCharacters()

  if (loading) return <GridSkeleton count={8} />

  if (characters.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
        <p className="font-display text-lg">No characters yet</p>
        <p className="mt-1 text-sm text-muted">Add characters from the admin panel.</p>
      </div>
    )

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {characters.map((c, i) => (
        <VaultCard key={c.id} item={{ ...c, kind: "character" }} index={i} />
      ))}
    </div>
  )
}
