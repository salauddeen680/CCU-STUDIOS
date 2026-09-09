"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  UserCircle 
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const navLinks = [
    { name: "Comics", href: "/comics", icon: BookOpen },
    { name: "Characters", href: "/characters", icon: Users },
    { name: "Ultimate", href: "/ultimate", icon: Sparkles },
  ]

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return
    setIsLoggingIn(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: "select_account",
      })
      await signInWithPopup(auth, provider)
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 🔥 OFFICIAL SQUARE CCU MARVEL-STYLE LOGO */}
        <Link href="/" className="group flex items-center gap-3.5 focus:outline-none">
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 transition-transform duration-300 group-hover:scale-105">
            {/* Cinematic Red Ambient Glow */}
            <div className="absolute -inset-1 rounded-xl bg-red-600 opacity-70 blur-md group-hover:opacity-100 transition-opacity duration-300" />
            
            <Image
              src="/ccu-logo.png"
              alt="CCU Logo"
              fill
              priority
              className="relative rounded-lg object-contain border border-red-500/50 shadow-2xl"
              sizes="64px"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_12px_rgba(220,38,38,0.4)]">
              CCU <span className="text-red-500">STUDIOS</span>
            </span>
            <span className="text-[10px] tracking-[0.25em] text-zinc-400 font-bold uppercase -mt-1 hidden sm:block">
              Cosmic Cinematic Universe
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900/40 px-3 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Auth / Profile Area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 backdrop-blur">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    width={24}
                    height={24}
                    className="rounded-full ring-1 ring-red-500/50"
                  />
                ) : (
                  <UserCircle className="h-5 w-5 text-zinc-400" />
                )}
                <span className="text-xs font-bold text-zinc-200 max-w-[100px] truncate">
                  {user.displayName?.split(" ")[0] || "Member"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:scale-105 hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {isLoggingIn ? "Connecting..." : "Sign In"}
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-zinc-900/50 text-white backdrop-blur focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Glass Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 bg-black/90 backdrop-blur-2xl px-4 py-5 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                        : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                )
              })}

              <div className="mt-3 pt-3 border-t border-zinc-800">
                {user ? (
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="User"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <UserCircle className="h-8 w-8 text-zinc-400" />
                      )}
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">
                          {user.displayName || "Member"}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-zinc-800"
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold uppercase text-white shadow-lg shadow-red-600/30"
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
  )
}
