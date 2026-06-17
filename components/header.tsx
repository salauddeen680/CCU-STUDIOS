"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X, BookOpen, Users, Sparkles, LogIn, LogOut, UserCircle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useComics, useCharacters } from "@/lib/data"

// 🔥 FIREBASE IMPORTS FOR LOGIN & DATABASE
import { auth, db } from "@/lib/firebase" 
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from "firebase/auth"
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

  // 👤 FAN SESSION STATE
  const [user, setUser] = useState<User | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const { comics } = useComics()
  const { characters } = useCharacters()

  // 🔄 AUTH LISTENER: Website ko batayega ki fan logged in hai ya nahi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // 🚀 GOOGLE LOGIN & DATABASE SAVER LOGIC
  const handleGoogleLogin = async () => {
    if (isLoggingIn) return
    setIsLoggingIn(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const loggedInUser = result.user

      // Firestore check: Kya yeh fan pehli baar aaya hai?
      const userRef = doc(db, "users", loggedInUser.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        // Naya fan hai! Database mein profile bana do
        await setDoc(userRef, {
          name: loggedInUser.displayName || "CCU Fan",
          email: loggedInUser.email,
          isPremium: false,        // Default status: Free user
          premiumExpiry: null,     // Default expiry: None
          joinedAt: new Date().toISOString()
        })
        console.log("New CCU Fan Profile Created!")
      } else {
        console.log("Welcome back to CCU!")
      }
    } catch (error) {
      console.error("Login failed:", error)
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
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        
        {/* 🎬 CCU STUDIOS LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-black text-white shadow-glow">
            CCU
          </span>
          <span className="font-display text-lg font-extrabold tracking-wider uppercase text-white">
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
                className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:text-primary ${
                  active ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* 🛠️ RIGHT CONTROLS: SEARCH + LOGIN + MOBILE MENU */}
        <div className="flex items-center gap-2">
          
          {/* 🔍 Search Button */}
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground/80 transition hover:border-primary/50 hover:text-primary"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* 🔐 AUTH SYSTEM (Desktop & Mobile) */}
          <div className="hidden sm:flex items-center">
            {user ? (
              <div className="flex items-center gap-3 ml-2 border-l border-zinc-800 pl-4">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  <UserCircle className="h-4 w-4 text-primary" />
                  {user.displayName?.split(" ")[0] || "Fan"}
                </span>
                <button
                  onClick={handleLogout}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-900 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 transition border border-zinc-800"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="ml-2 flex items-center gap-2 rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
              >
                {isLoggingIn ? "Logging in..." : "Login"} <LogIn className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* 📱 Mobile Menu Hamburger */}
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground/80 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 🔍 LIVE SEARCH PANEL */}
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

      {/* 📱 MOBILE NAV MENU */}
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
              
              {/* Mobile Login/Logout Button */}
              <div className="mt-2 border-t border-border/60 pt-2">
                {user ? (
                  <div className="flex items-center justify-between px-3 py-3">
                    <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-primary" />
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
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-black hover:bg-zinc-200 transition-colors"
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
