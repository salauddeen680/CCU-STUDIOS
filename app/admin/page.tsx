"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { 
  Loader2, Lock, LayoutDashboard, BookOpen, UserSquare2, 
  MessageSquare, LogOut 
} from "lucide-react"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth"

// 📥 Hamare naye customized components ko safely import kiya hai
import { ComicsManager } from "@/components/admin/comics-manager"
import { CharactersManager } from "@/components/admin/characters-manager"
import { EngagementPanel } from "@/components/admin/engagement-panel"

// 🔐 Secure Configuration using Vercel Environment Variables — NO CHANGES AT ALL
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const ADMIN_ACCESS_KEY = "ccu-admin-2026"

function AdminGate() {
  const params = useSearchParams()
  const access = params.get("access")
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  // 🎛️ Dashboard Navigation States
  const [activeTab, setActiveTab] = useState("comics")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      console.error("Firebase Debug:", err)
      setLoginError(`Firebase Error Code: ${err.code || err.message}`)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    signOut(auth)
  }

  if (access !== ADMIN_ACCESS_KEY) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center bg-black text-white">
        <Lock className="h-10 w-10 text-red-600" />
        <h1 className="text-2xl font-bold tracking-wider">Restricted Zone</h1>
        <p className="max-w-sm text-sm text-zinc-500">Valid access key required to reach the CCU Control Center.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  // 🔐 1. DESIGNER LOGIN PANEL — UNTOUCHED & SECURE
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 font-sans">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl border-t-4 border-t-red-600">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-3xl font-extrabold tracking-widest text-red-600">CCU STUDIOS</h1>
            <p className="text-xs uppercase tracking-wider text-zinc-500">Authorized Personnel Login</p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none transition-all" placeholder="admin@ccustudios.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none transition-all" placeholder="••••••••" />
            </div>
            {loginError && <p className="text-xs font-mono text-red-500 bg-red-950/30 border border-red-900/50 rounded-lg p-3 text-center">{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="w-full rounded-lg bg-red-600 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-700 active:scale-[0.99] transition-all disabled:opacity-50">{loginLoading ? "Authenticating Master Keys..." : "Enter Command Center"}</button>
          </form>
        </div>
      </div>
    )
  }

  // 🚀 2. REAL PREMIUM ADMIN DASHBOARD UI
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      
      {/* SIDEBAR NAVIGATION — Saare zaroori options aapke rules ke mutabik active hain */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black tracking-widest text-red-600">CCU CENTRAL</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Creator Panel Active</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: "comics", label: "Comics Manager", icon: BookOpen },
              { id: "characters", label: "Characters Manager", icon: UserSquare2 },
              { id: "ultimate", label: "Ultimate Comic", icon: LayoutDashboard },
              { id: "engagement", label: "Engagement Panel", icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? "bg-red-600 text-white font-bold shadow-lg shadow-red-600/10" 
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* CURRENT SESSION */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs text-zinc-500 truncate max-w-[140px]">{user.email}</span>
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-zinc-800 hover:border-red-600/40 rounded-lg text-xs text-zinc-400 hover:text-red-500 bg-zinc-950/40 transition-all">
            <LogOut className="h-3 w-3" />
            Disconnect Session
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT DASHBOARD */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* TAB: COMICS MANAGER */}
        {activeTab === "comics" && (
          <div className="space-y-4">
            <ComicsManager />
          </div>
        )}

        {/* TAB: CHARACTERS MANAGER */}
        {activeTab === "characters" && (
          <div className="space-y-4">
            <CharactersManager />
          </div>
        )}

        {/* TAB: ULTIMATE COMIC (Aapka alag framework jo aapko alag chahiye tha) */}
        {activeTab === "ultimate" && (
          <div className="space-y-4">
            {/* Yeh wahi comics manager load karega jahan hamare paas naya drop-down system hai */}
            <ComicsManager />
          </div>
        )}

        {/* TAB: ENGAGEMENT PANEL & LIKES ANALYTICS */}
        {activeTab === "engagement" && (
          <div className="space-y-4">
            <EngagementPanel />
          </div>
        )}

      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>}><AdminGate /></Suspense>
    </main>
  )
}
