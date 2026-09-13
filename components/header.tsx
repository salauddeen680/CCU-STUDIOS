"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  UserCircle,
  Search,
  ArrowRight
} from "lucide-react"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup, signInWithCredential, signOut, onAuthStateChanged, User } from "firebase/auth"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  
  // 🔥 SEARCH STATE
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const navLinks = [
    { name: "Comics", href: "/comics", icon: BookOpen },
    { name: "Characters", href: "/characters", icon: Users },
    { name: "Ultimate Comic", href: "/ultimate", icon: Sparkles },
  ]

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return
    setIsLoggingIn(true)
    try {
      const cap = (typeof window !== 'undefined' && (window as any).Capacitor) ? (window as any).Capacitor : null;

      if (cap && cap.isNativePlatform() && cap.Plugins?.GoogleAuth) {
        const GoogleAuth = cap.Plugins.GoogleAuth;
        await GoogleAuth.initialize({
          clientId: '359808133294-vk1bc10b7uolubjkv4nebim9f2p74ebn.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
        
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        await signInWithCredential(auth, credential);
      } else {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({
          prompt: "select_account",
        })
        await signInWithPopup(auth, provider)
      }
    } catch (error: any) {
      console.error("Login Error:", error)
      if (error?.code !== "auth/popup-closed-by-user") {
        alert("Login failed: " + (error?.message || "Please check connection"))
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout Error:", error)
    }
  }

  // 🔍 SEARCH SUBMIT HANDLER
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      // Yeh aapko search page par query ke sath bhejega (e.g., /search?q=aryan)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/30 backdrop-blur-2xl transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          
          <Link href="/" className="flex items-center gap-2.5 focus:outline-none group">
            <div className="relative h-8 w-11 sm:h-9 sm:w-12 shrink-0 overflow-hidden rounded-md border border-red-500/50 shadow-[0_0_12px_rgba(220,38,38,0.4)]">
              <Image
                src="/ccu-logo.png"
                alt="CCU"
                fill
                priority
                className="object-cover"
                sizes="48px"
              />
            </div>
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-white uppercase">
              STUDIOS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-display text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive ? "text-red-500" : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* 🔥 DESKTOP SEARCH BUTTON */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-4 w-4 text-zinc-400" />
                  )}
                  <span className="text-xs font-bold text-zinc-200 max-w-[100px] truncate">
                    {user.displayName?.split(" ")[0] || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition hover:bg-red-500 active:scale-95 disabled:opacity-50"
              >
                <LogIn className="h-3.5 w-3.5" />
                {isLoggingIn ? "Connecting..." : "Login to CCU"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {/* 🔥 MOBILE SEARCH BUTTON */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-300"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-white/10 bg-black/80 backdrop-blur-3xl px-6 py-6 md:hidden"
            >
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3.5 font-display text-base font-bold uppercase tracking-wider ${
                        isActive ? "text-red-500" : "text-zinc-200"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  )
                })}

                <div className="pt-4 border-t border-white/10">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="User"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircle className="h-8 w-8 text-zinc-400" />
                        )}
                        <div>
                          <p className="text-sm font-bold text-white leading-none">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="rounded-lg bg-zinc-900 border border-white/10 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-zinc-800"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleGoogleLogin()
                      }}
                      disabled={isLoggingIn}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95"
                    >
                      <LogIn className="h-4 w-4" />
                      {isLoggingIn ? "Connecting..." : "Sign In With Google"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 🚀 FULL-SCREEN SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/90 backdrop-blur-xl pt-20 px-4"
          >
            <div className="w-full max-w-2xl relative">
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute -top-12 right-0 text-zinc-400 hover:text-white"
              >
                <X className="h-8 w-8" />
              </button>
              
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search comics, characters, or lore..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-2xl py-5 pl-14 pr-14 text-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-500 text-white p-2 rounded-xl transition-colors"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
              <p className="text-center text-zinc-500 text-sm mt-4 font-medium uppercase tracking-widest">
                Press Enter to search
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
