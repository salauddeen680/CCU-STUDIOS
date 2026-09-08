"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X, BookOpen, Users, Sparkles, LogIn, LogOut, UserCircle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useComics, useCharacters } from "@/lib/data"

import { auth, db } from "@/lib/firebase" 
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut, User } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

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

  const [user, setUser] = useState<User | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const { comics } = useComics()
  const { characters } = useCharacters()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid)
          const userSnap = await getDoc(userRef)

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              name: currentUser.displayName || "CCU Fan",
              email: currentUser.email,
              isPremium: false,
              premiumExpiry: null,
              joinedAt: new Date().toISOString()
            })
          }
        } catch (err) {
          console.error("Firestore sync error:", err)
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return
    setIsLoggingIn(true)

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: "select_account"
      })

      const isCapacitorApp = 
        typeof window !== "undefined" && 
        (Boolean((window as any).Capacitor) || navigator.userAgent.includes("wv"))

      if (isCapacitorApp) {
        await signInWithPopup(auth, provider)
      } else {
        try {
          await signInWithPopup(auth, provider)
        } catch (popupError: any) {
          if (
            popupError?.code === "auth/popup-blocked" || 
            popupError?.code === "auth/cancelled-popup-request"
          ) {
            await signInWithRedirect(auth, provider)
          } else {
            throw popupError
          }
        }
      }
    } catch (error: any) {
      if (error?.code !== "auth/popup-closed-by-user") {
        console.error("Login failed:", error)
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

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
    // 🔥 PREMIUM FROSTED GLASS EFFECT: Semi-transparent backdrop + heavy blur + subtle glass border
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-zinc-950/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-zinc-950/30 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        
        {/* 🎬 CCU STUDIOS LOGO */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-xs font-black text-white shadow-[0_0_18px_rgba(220,38,38,0.5)] transition-transform group-hover:scale-105">
            CCU
          </span>
          <span className="font-display text-lg font-black tracking-widest uppercase text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
            STUDIOS
          </span>
        </Link>

        {/* 💻 DESKTOP NAV */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                  active 
                    ? "bg-white/[0.08] text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md" 
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* 🛠️ RIGHT CONTROLS: SEARCH + LOGIN + MOBILE MENU */}
        <div className="flex items-center gap-2">
          
          {/* 🔍 Search Glass Button */}
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 backdrop-blur-md transition hover:border-red-500/50 hover:text-white hover:bg-white/[0.08]"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* 🔐 AUTH SYSTEM */}
          <div className="hidden sm:flex items-center">
            {user ? (
              <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <UserCircle className="h-4 w-4 text-red-500" />
                  {user.displayName?.split(" ")[0] || "Fan"}
                </span>
                <button
                  onClick={handleLogout}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="ml-2 flex items-center gap-2 rounded-xl bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-zinc-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                {isLoggingIn ? "Connecting..." : "Login"} <LogIn className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* 📱 Mobile Menu Hamburger (Glass style) */}
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 backdrop-blur-md transition hover:bg-white/[0.08] md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 🔍 LIVE SEARCH PANEL (Glass design) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-zinc-950/70 backdrop-blur-2xl"
          >
            <div className="mx-auto max-w-7xl px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3">
                <Search className="h-4 w-4 text-zinc-400" />
                <input
                  ref={inputRef}
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search comics & characters..."
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>
              {term && (
                <div className="mt-2 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl">
                  {results.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-zinc-400">No results found.</p>
                  ) : (
                    results.map((r) => (
                      <Link
                        key={`${r.type}-${r.id}`}
                        href={r.type === "comic" ? `/comics/${r.id}` : `/characters/${r.id}`}
                        className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-red-600/10"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.img || "/placeholder.svg?height=48&width=48&query=ccu"}
                          alt=""
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <span className="flex-1 truncate text-sm text-zinc-200">{r.label}</span>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-400">
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

      {/* 📱 MOBILE NAV MENU (Glass drawer) */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-zinc-950/80 backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon
                const active = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                      active ? "bg-red-600/15 text-red-500 border border-red-500/20" : "text-zinc-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
              
              <div className="mt-2 border-t border-white/10 pt-2">
                {user ? (
                  <div className="flex items-center justify-between px-3.5 py-3">
                    <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-red-500" />
                      {user.displayName}
                    </span>
                    <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1">
                      Logout <LogOut className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black hover:bg-zinc-200 transition"
                  >
                    {isLoggingIn ? "Connecting..." : "Login to CCU"} <LogIn className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
