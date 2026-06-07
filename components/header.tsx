"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X, BookOpen, Users, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useComics, useCharacters } from "@/lib/data"

const NAV = [
  { href: "/comics", label: "Comics", icon: BookOpen },
  { href: "/characters", label: "Characters", icon: Users },
  { href: "/ultimate", label: "Ultimate Comic", icon: Sparkles },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [term, setTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { comics } = useComics()
  const { characters } = useCharacters()

  const results = useMemo(() => {
    const t = term.trim().toLowerCase()
    if (!t) return []
    const c = comics
      .filter((x) => x.title?.toLowerCase().includes(t))
      .map((x) => ({ id: x.id, label: x.title, type: "comic" as const, img: x.cover || x.images?.[0] }))
    const ch = characters
      .filter((x) => x.name?.toLowerCase().includes(t))
      .map((x) => ({ id: x.id, label: x.name, type: "character" as const, img: x.image }))
    return [...c, ...ch].slice(0, 8)
  }, [term, comics, characters])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
    setTerm("")
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        
        {/* 🔥 FIX: Logo and STUDIOS Side-by-Side (Mobile + Desktop dono par chalega) */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* Red CCU Box */}
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-black text-white shadow-glow">
            CCU
          </span>
          {/* STUDIOS Text - Isme se hidden block hata diya hai taaki hamesha side mein dikhe */}
          <span className="font-display text-lg font-extrabold tracking-wider uppercase text-white">
            STUDIOS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:text-primary ${
                  active ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: search + mobile menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground/80 transition hover:border-primary/50 hover:text-primary"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground/80 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Live search panel */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/70 bg-background/95"
          >
            <div className="mx-auto max-w-7xl px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3">
                <Search className="h-4 w-4 text-muted" />
                <input
                  ref={inputRef}
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search comics & characters..."
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted"
                />
              </div>
              {term && (
                <div className="mt-2 divide-y divide-border/60 overflow-hidden rounded-xl border border-border bg-card">
                  {results.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-muted">No results found.</p>
                  ) : (
                    results.map((r) => (
                      <Link
                        key={`${r.type}-${r.id}`}
                        href={r.type === "comic" ? `/comics/${r.id}` : `/characters/${r.id}`}
                        className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-primary/10"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.img || "/placeholder.svg?height=48&width=48&query=ccu"}
                          alt=""
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="flex-1 truncate text-sm">{r.label}</span>
                        <span className="rounded-full bg-background px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                          {r.type}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/70 bg-background/95 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
              {NAV.map((item) => {
                const Icon = item.icon
                const active = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                      active ? "bg-primary/10 text-primary" : "text-foreground/80"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
