"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useComics, useCharacters } from "@/lib/data"
import { VaultCard } from "./vault-card"
import { GridSkeleton } from "./skeletons"
import type { VaultItem } from "@/lib/types"

type Filter = "all" | "comic" | "character"
const PAGE = 8

export function VaultGrid() {
  const { comics, loading: lc } = useComics()
  const { characters, loading: lch } = useCharacters()
  const [filter, setFilter] = useState<Filter>("all")
  const [visible, setVisible] = useState(PAGE)
  const sentinel = useRef<HTMLDivElement>(null)

  const loading = lc || lch

  const items = useMemo<VaultItem[]>(() => {
    const c: VaultItem[] = comics.map((x) => ({ ...x, kind: "comic" }))
    const ch: VaultItem[] = characters.map((x) => ({ ...x, kind: "character" }))
    const merged = [...c, ...ch].sort(
      (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
    )
    if (filter === "all") return merged
    return merged.filter((i) => i.kind === filter)
  }, [comics, characters, filter])

  useEffect(() => setVisible(PAGE), [filter])

  // Infinite scroll
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => (v < items.length ? v + PAGE : v))
        }
      },
      { rootMargin: "400px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [items.length])

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "comic", label: "Comics" },
    { key: "character", label: "Characters" },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold tracking-wide sm:text-2xl">
          Active <span className="text-glow text-primary">Vault</span>
        </h2>
        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.key
                  ? "bg-primary text-white shadow-glow"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <GridSkeleton count={8} />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="font-display text-lg">The Vault is empty</p>
          <p className="mt-1 text-sm text-muted">
            Comics and characters added in the admin panel appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.slice(0, visible).map((item, i) => (
              <VaultCard key={`${item.kind}-${item.id}`} item={item} index={i} />
            ))}
          </div>
          <div ref={sentinel} className="h-10" />
        </>
      )}
    </section>
  )
}
