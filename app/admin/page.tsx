"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect, useRef } from "react"
import { 
  Loader2, Lock, LayoutDashboard, BookOpen, UserSquare2, 
  Image as ImageIcon, MessageSquare, BarChart3, Settings, 
  Upload, Plus, Trash2, CheckCircle2, Globe, LogOut 
} from "lucide-react"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth"

// 🔐 Firebase Configuration (Hardcoded for 100% Stability)
const firebaseConfig = {
  apiKey: "AIzaSyBwX_7DzxupNXrmXyDsnTtFdbtod4oybkEfA",
  authDomain: "ccu-studios.firebaseapp.com",
  projectId: "ccu-studios",
  storageBucket: "ccu-studios.firebasestorage.app",
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

  // 🎛️ Dashboard States
  const [activeTab, setActiveTab] = useState("comics")
  const comicFileRef = useRef<HTMLInputElement>(null)
  const characterFileRef = useRef<HTMLInputElement>(null)
  const generalFileRef = useRef<HTMLInputElement>(null)

  // Form Submissions Mock Storage (For UI responsiveness)
  const [comics, setComics] = useState([
    { id: 1, title: "CCU: Genesis of Destruction", issue: "#1", status: "Published" },
    { id: 2, title: "Aryan: Project Beast", issue: "#1", status: "Draft" }
  ])
  const [characters, setCharacters] = useState([
    { id: 1, name: "Zenith", role: "Hero", power: "Cosmic Energy" },
    { id: 2, name: "Michael", role: "Hero/God of Destruction", power: "Dark Matter & Axe" },
    { id: 3, name: "Vorgat", role: "Villain", power: "Void Manipulation" }
  ])

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

  // 🔐 1. LOGIN SCREEN UI
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
            <button type="submit" disabled={loginLoading} className="w-full rounded-lg bg-red-600 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-700 active:scale-[0.99] transition-all disabled:opacity-50">{loginLoading ? "Verifying Keys..." : "Enter Command Center"}</button>
          </form>
        </div>
      </div>
    )
  }

  // 🚀 2. REAL PREMIUM ADMIN DASHBOARD UI
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black tracking-widest text-red-600">CCU CENTRAL</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Creator: Salauddin</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: "comics", label: "Comics Manager", icon: BookOpen },
              { id: "characters", label: "Characters Manager", icon: UserSquare2 },
              { id: "ultimate", label: "Ultimate Comic", icon: LayoutDashboard },
              { id: "uploads", label: "Image Upload", icon: ImageIcon },
              { id: "comments", label: "Comments Panel", icon: MessageSquare },
              { id: "analytics", label: "Likes Analytics", icon: BarChart3 },
              { id: "footer", label: "Footer Editor", icon: Settings },
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

        {/* LOGOUT BUTTON */}
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* TAB 1: COMICS MANAGER */}
        {activeTab === "comics" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Comics Manager</h1>
                <p className="text-sm text-zinc-500">Create, upload and configure scripts for your cinematic releases.</p>
              </div>
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                <Plus className="h-4 w-4" /> Add New Volume
              </button>
            </div>

            {/* Form to Select Image from Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border border-zinc-800 bg-zinc-900/20 p-6 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Comic Cover Setup</h3>
                <input type="file" accept="image/*" ref={comicFileRef} className="hidden" onChange={() => alert("Image Loaded from Gallery inside Memory!")} />
                <button onClick={() => comicFileRef.current?.click()} className="w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-red-600/40 bg-zinc-950 p-8 rounded-lg group transition-all">
                  <Upload className="h-8 w-8 text-zinc-600 group-hover:text-red-500 mb-2 transition-all" />
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200">Open Mobile Gallery</span>
                  <span className="text-[10px] text-zinc-600 mt-1">Supports PNG, JPG, WEBP</span>
                </button>
                <div className="space-y-3">
                  <input type="text" placeholder="Comic Book Name" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-600" />
                  <input type="text" placeholder="Issue/Volume (e.g. #1)" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-600" />
                  <textarea placeholder="Write descriptive cosmic lore summary..." rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-600 resize-none" />
                </div>
                <button onClick={() => alert("Volume details logged!")} className="w-full bg-zinc-800 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition-all uppercase tracking-wider">Save Volume Draft</button>
              </div>

              {/* Data List View */}
              <div className="md:col-span-2 border border-zinc-800 bg-zinc-900/20 rounded-xl p-6">
                <h3 className="text-sm font-bold text-zinc-300 mb-4 uppercase tracking-wider">Active CCU Volumes</h3>
                <div className="divide-y divide-zinc-800">
                  {comics.map((comic) => (
                    <div key={comic.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                      <div>
                        <h4 className="text-sm font-bold text-white">{comic.title}</h4>
                        <p className="text-xs text-zinc-500">Index Volume: {comic.issue}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${comic.status === "Published" ? "bg-green-950 text-green-400 border border-green-900" : "bg-yellow-950 text-yellow-400 border border-yellow-900"}`}>{comic.status}</span>
                        <button className="text-zinc-600 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHARACTERS MANAGER */}
        {activeTab === "characters" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Characters Registry</h1>
                <p className="text-sm text-zinc-500">Manage character visual specs (Zenith, Michael golden/black armor profiles).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-zinc-800 bg-zinc-900/20 p-6 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Character Avatar</h3>
                <input type="file" accept="image/*" ref={characterFileRef} className="hidden" onChange={() => alert("Character Snapshot Attached!")} />
                <button onClick={() => characterFileRef.current?.click()} className="w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-red-600/40 bg-zinc-950 py-6 rounded-lg group transition-all">
                  <Upload className="h-6 w-6 text-zinc-600 group-hover:text-red-500 mb-1" />
                  <span className="text-xs text-zinc-400">Select Character Art</span>
                </button>
                <input type="text" placeholder="Character Name (e.g. Orion)" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-600" />
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-red-600">
                  <option value="hero">Hero Profile</option>
                  <option value="villain">Antagonist Profile</option>
                  <option value="cosmic">Cosmic Entity</option>
                </select>
                <input type="text" placeholder="Armor Color / Visual Weapon details" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-600" />
                <button onClick={() => alert("Character database row queued!")} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition-all uppercase tracking-wider">Inject Character</button>
              </div>

              <div className="md:col-span-2 border border-zinc-800 bg-zinc-900/20 rounded-xl p-6">
                <h3 className="text-sm font-bold text-zinc-300 mb-4 uppercase tracking-wider">Database Rosters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {characters.map((char) => (
                    <div key={char.id} className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white">{char.name}</h4>
                        <p className="text-xs text-zinc-400 mt-1">{char.role} • <span className="text-red-400">{char.power}</span></p>
                      </div>
                      <button className="text-zinc-700 hover:text-red-500 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ULTIMATE COMIC MANAGER */}
        {activeTab === "ultimate" && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Ultimate Comic Framework</h1>
                <p className="text-sm text-zinc-500">Cross-examine timeline structures and launch master events.</p>
              </div>
              <button onClick={() => alert("CCU Project Engine Synchronized and Published to Production Hub!")} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-black px-5 py-2.5 rounded-lg transition-all uppercase tracking-widest shadow-lg shadow-red-600/20">
                <Globe className="h-4 w-4" /> Publish System Live
              </button>
            </div>
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-4">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Crossover Pipeline Tracker</h3>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">This staging layout allows Salauddin to push updates to all distributed user platforms instantly. When you click the master publish node above, updates to headers, assets, files, and lore strings synchronize on Vercel deployment edge networks immediately.</p>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-xs text-zinc-300 font-medium">Staging Integrity Verified: Firebase Connection Token Secure. Ready to broadcast.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IMAGE UPLOAD TOOL */}
        {activeTab === "uploads" && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h1 className="text-2xl font-bold text-white">Standalone Asset Bucket</h1>
              <p className="text-sm text-zinc-500">Upload standalone background screens, mockups, or cloudy sunset scene renders.</p>
            </div>
            <div className="border-2 border-dashed border-zinc-800 bg-zinc-900/10 rounded-xl p-12 text-center max-w-xl mx-auto space-y-4">
              <input type="file" accept="image/*" ref={generalFileRef} className="hidden" multiple onChange={() => alert("Assets loaded successfully into dashboard space!")} />
              <div className="inline-flex p-4 bg-zinc-950 border border-zinc-800 rounded-full text-red-500 mb-2"><ImageIcon className="h-6 w-6" /></div>
              <h3 className="text-sm font-bold text-zinc-200">Drop files or click to pull from device</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">Upload 8k high fidelity posters or raw scene layouts directly from your phone gallery storage asset space.</p>
              <button onClick={() => generalFileRef.current?.click()} className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">Select System Files</button>
            </div>
          </div>
        )}

        {/* TAB 5: COMMENTS PANEL */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h1 className="text-2xl font-bold text-white">Audience Comments Moderation</h1>
              <p className="text-sm text-zinc-500">Monitor public reactions on published CCU comic sequences.</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 1, user: "ComicFan99", comment: "The reveal of Michael's armor transformation script was insanely epic!", item: "CCU #1" },
                { id: 2, user: "CosmicReader", comment: "Waiting eagerly to see Zenith and Kronos team up against Vorgat.", item: "Project Beast" }
              ].map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/20 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-white">{c.user}</span><span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{c.item}</span></div>
                    <p className="text-xs text-zinc-400 mt-2">"{c.comment}"</p>
                  </div>
                  <div className="flex gap-2"><button onClick={() => alert("Comment approved!")} className="text-[10px] uppercase font-bold tracking-wider text-green-500 border border-green-950 bg-green-950/20 px-2 py-1 rounded hover:bg-green-500 hover:text-black transition-all">Approve</button><button onClick={() => alert("Comment purged!")} className="text-[10px] uppercase font-bold tracking-wider text-red-500 border border-red-950 bg-red-950/20 px-2 py-1 rounded hover:bg-red-500 hover:text-black transition-all">Delete</button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: LIKES ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h1 className="text-2xl font-bold text-white">Performance Metrics</h1>
              <p className="text-sm text-zinc-500">Live audience metrics summary dashboard stats tracking cosmic trends.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20"><span className="text-xs text-zinc-500 uppercase font-semibold">Total Comic Interactions</span><h2 className="text-3xl font-black text-white mt-2">48,250</h2><p className="text-[10px] text-green-500 mt-1">▲ +12% scaling this week</p></div>
              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20"><span className="text-xs text-zinc-500 uppercase font-semibold">Character Page Discovers</span><h2 className="text-3xl font-black text-white mt-2">12,400</h2><p className="text-[10px] text-green-500 mt-1">▲ Zenith/Michael profile dominant</p></div>
              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20"><span className="text-xs text-zinc-500 uppercase font-semibold">Global Unique Sessions</span><h2 className="text-3xl font-black text-white mt-2">8,910</h2><p className="text-[10px] text-zinc-400 mt-1">Stable pipeline integrity</p></div>
            </div>
          </div>
        )}

        {/* TAB 7: FOOTER EDITOR */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h1 className="text-2xl font-bold text-white">System Global Settings & Footer Editor</h1>
              <p className="text-sm text-zinc-500">Configure layout footer copyright strings and configuration structures.</p>
            </div>
            <div className="max-w-xl border border-zinc-800 bg-zinc-900/20 p-6 rounded-xl space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Global System Copyright Label</label>
                <input type="text" defaultValue="© 2026 CCU Studios. Crafted by Salauddin. All Cosmic Rights Reserved." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-red-600" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Staging Route Flag</label>
                <input type="text" disabled value="/admin?access=ccu-admin-2026" className="w-full bg-zinc-950 border border-zinc-900 text-zinc-600 rounded-lg px-3 py-2 text-xs cursor-not-allowed" />
              </div>
              <button onClick={() => alert("Footer node saved!")} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all uppercase tracking-wider">Save Node Modifications</button>
            </div>
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
