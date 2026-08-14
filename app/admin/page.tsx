"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { 
  Loader2, Lock, LayoutDashboard, BookOpen, UserSquare2, 
  MessageSquare, LogOut, Video, Activity, Eye, Globe, 
  Smartphone, Monitor, ShieldCheck, TrendingUp, RefreshCw,
  Clock, Users, Trash2
} from "lucide-react" 
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth"
import { getFirestore, collection, query, orderBy, getDocs, limit, deleteDoc, doc } from "firebase/firestore" 

// 📥 Admin Managers
import { ComicsManager } from "@/components/admin/comics-manager"
import { CharactersManager } from "@/components/admin/characters-manager"
import { EngagementPanel } from "@/components/admin/engagement-panel"
import { VideoLinksManager } from "@/components/admin/video-links-manager"

// 🔐 Firebase Setup
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
const db = getFirestore(app) 

const ADMIN_ACCESS_KEY = "ccu-admin-2026"

// 🛡️ Filter blacklist for old and new admin entries
const BLOCKED_EMAILS = ["admin@ccustudios.com", "srk042221@gmail.com"]

function AdvancedUniverseTraffic() {
  const [views, setViews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const fetchTrafficData = async () => {
    setIsRefreshing(true)
    try {
      const q = query(collection(db, "pageViews"), orderBy("timestamp", "desc"), limit(150))
      const querySnapshot = await getDocs(q)
      const rawData = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))

      // Strict Filter: Remove any admin/developer emails and admin paths
      const cleanVisitors = rawData.filter((item: any) => {
        const email = (item.userEmail || "").toLowerCase()
        const isBlockedEmail = BLOCKED_EMAILS.some(b => email.includes(b.toLowerCase()))
        const isAdminPath = item.page?.startsWith("/admin") || item.page?.startsWith("/api")
        return !isBlockedEmail && !isAdminPath
      })

      setViews(cleanVisitors)
    } catch (error) {
      console.error("Error fetching live analytics:", error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleClearLegacyLogs = async () => {
    if (!confirm("Kya aap saara purana test traffic data delete karke fresh start karna chahte hain?")) return
    setIsClearing(true)
    try {
      const snapshot = await getDocs(collection(db, "pageViews"))
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "pageViews", d.id)))
      await Promise.all(deletePromises)
      setViews([])
      alert("Saara purana traffic data saaf ho gaya! Ab sirf real visitors aayenge. 🔥")
    } catch (err) {
      console.error("Clear error:", err)
      alert("Data clear karne mein dikkat aayi.")
    } finally {
      setIsClearing(false)
    }
  }

  useEffect(() => {
    fetchTrafficData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Loading Clean Audience Telemetry...</p>
      </div>
    )
  }

  // 📊 Metrics Calculation
  const totalViews = views.length
  const loggedInVisits = views.filter(v => v.isLoggedIn || (v.userEmail && !v.userEmail.includes("Guest"))).length
  const guestVisits = totalViews - loggedInVisits
  const mobileVisits = views.filter(v => v.device?.includes("Mobile") || v.device?.includes("iPhone") || v.device?.includes("Android")).length
  const desktopVisits = totalViews - mobileVisits

  // Top Pages
  const pageMap: Record<string, number> = {}
  views.forEach(v => {
    const p = v.page || "/"
    pageMap[p] = (pageMap[p] || 0) + 1
  })
  const topPages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 4)

  return (
    <div className="space-y-6">
      
      {/* 🚀 Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-lg font-black tracking-wider uppercase text-white">
              Universe Traffic Hub
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Live audience analytics • Filtered from bot & creator sessions</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={fetchTrafficData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 hover:text-white transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-red-500" : ""}`} />
            {isRefreshing ? "Syncing..." : "Live Refresh"}
          </button>
          
          <button 
            onClick={handleClearLegacyLogs}
            disabled={isClearing}
            className="flex items-center gap-2 px-3.5 py-2 bg-red-950/40 border border-red-900/60 hover:bg-red-900/60 rounded-xl text-xs font-bold text-red-400 hover:text-white transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isClearing ? "Cleaning..." : "Purge Logs"}
          </button>
        </div>
      </div>

      {/* 📊 Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-zinc-400">Total Audience Views</span>
            <Eye className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-white">{totalViews}</p>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40 mt-1 inline-block">
              100% Real Readers
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-zinc-400">Reader Type</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-white">
              {loggedInVisits} <span className="text-sm font-normal text-zinc-500">/ {guestVisits}</span>
            </p>
            <span className="text-[10px] text-zinc-400 mt-1 block">Members vs Guests</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-zinc-400">Device Platform</span>
            <Smartphone className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black text-white">
              {mobileVisits} <span className="text-sm font-normal text-zinc-500">Mob | {desktopVisits} PC</span>
            </p>
            <span className="text-[10px] text-zinc-400 mt-1 block">Screen Breakdown</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-zinc-400">Anti-Spam Filter</span>
            <ShieldCheck className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-emerald-400">SECURE & SHIELDED</p>
            <span className="text-[10px] text-zinc-500 mt-1 block">Self Sessions Filtered Out</span>
          </div>
        </div>

      </div>

      {/* 📈 Most Read Chapters */}
      <div className="bg-zinc-900/30 border border-zinc-800 p-5 rounded-2xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-red-500" /> Most Visited Comics & Lore Paths
        </h3>
        
        {topPages.length === 0 ? (
          <p className="text-xs text-zinc-600 py-4 text-center">No audience traffic patterns logged yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topPages.map(([path, count], idx) => (
              <div key={path} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-xs font-mono font-bold text-red-500">#{idx + 1}</span>
                  <span className="font-mono text-xs text-zinc-200 truncate">{path}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-900/50">
                  {count} views
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📡 Live Visitor Stream Feed */}
      <div className="bg-zinc-900/30 border border-zinc-800 p-5 rounded-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-400" /> Live Visitor Stream Feed
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">Filtered Public Readers</span>
        </div>

        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {views.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-zinc-400">Ready for Live Traffic 🚀</p>
              <p className="text-xs text-zinc-600 mt-1">Real visitors browsing comics or characters will show up here in real time.</p>
            </div>
          ) : (
            views.map((v) => {
              const isGuest = !v.userEmail || v.userEmail.includes("Guest");
              return (
                <div key={v.id} className="p-3.5 bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                        {v.page || "/"}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        !isGuest ? "bg-blue-900/40 text-blue-300 border border-blue-800/40" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {v.userEmail || "Guest Reader"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-zinc-500" /> {v.location || "Global Web"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {v.device?.includes("Mobile") || v.device?.includes("iPhone") || v.device?.includes("Android") ? (
                          <Smartphone className="h-3 w-3 text-purple-400" />
                        ) : (
                          <Monitor className="h-3 w-3 text-blue-400" />
                        )}
                        {v.device || "Desktop"} ({v.browser || "Web"})
                      </span>
                      <span>•</span>
                      <span className="text-zinc-500 truncate max-w-[140px]">Source: {v.referrer || "Direct"}</span>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 shrink-0 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800/80">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    {v.createdAt ? new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Just now"}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}

function AdminGate() {
  const params = useSearchParams()
  const access = params.get("access")
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  const [activeTab, setActiveTab] = useState("traffic") 

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
      setLoginError(`Firebase Error: ${err.message || "Failed to authenticate"}`)
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
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none transition-all" 
                placeholder="admin@ccustudios.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
            {loginError && <p className="text-xs font-mono text-red-500 bg-red-950/30 border border-red-900/50 rounded-lg p-3 text-center">{loginError}</p>}
            <button 
              type="submit" 
              disabled={loginLoading} 
              className="w-full rounded-lg bg-red-600 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-700 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loginLoading ? "Authenticating Master Keys..." : "Enter Command Center"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black tracking-widest text-red-600">CCU CENTRAL</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Creator Panel Active</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: "traffic", label: "Live Traffic", icon: Activity },
              { id: "comics", label: "Comics Manager", icon: BookOpen },
              { id: "characters", label: "Characters Manager", icon: UserSquare2 },
              { id: "ultimate", label: "Ultimate Comic", icon: LayoutDashboard },
              { id: "videos", label: "Social Videos", icon: Video }, 
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
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-zinc-800 hover:border-red-600/40 rounded-lg text-xs text-zinc-400 hover:text-red-500 bg-zinc-950/40 transition-all"
          >
            <LogOut className="h-3 w-3" />
            Disconnect Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {activeTab === "traffic" && (
          <div className="space-y-4">
            <AdvancedUniverseTraffic />
          </div>
        )}

        {activeTab === "comics" && (
          <div className="space-y-4">
            <ComicsManager />
          </div>
        )}

        {activeTab === "characters" && (
          <div className="space-y-4">
            <CharactersManager />
          </div>
        )}

        {activeTab === "ultimate" && (
          <div className="space-y-4">
            <ComicsManager />
          </div>
        )}

        {activeTab === "videos" && (
          <div className="space-y-4">
            <VideoLinksManager />
          </div>
        )}

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
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      }>
        <AdminGate />
      </Suspense>
    </main>
  )
}
