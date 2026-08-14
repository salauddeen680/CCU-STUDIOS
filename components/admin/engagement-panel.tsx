"use client"

import { useState, useEffect } from "react"
import { 
  Heart, 
  Trash2, 
  MessageSquare, 
  BookOpen, 
  UserCheck, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor, 
  Clock, 
  Activity,
  TrendingUp,
  ShieldCheck
} from "lucide-react"
import { useComics, useCharacters, useAllComments, deleteComment } from "@/lib/data"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"

type PageViewEvent = {
  id: string
  page: string
  userEmail: string
  isLoggedIn?: boolean
  device?: string
  browser?: string
  location?: string
  referrer?: string
  createdAt?: string
}

export function EngagementPanel() {
  const { comics = [] } = useComics()
  const { characters = [] } = useCharacters()
  const { comments = [] } = useAllComments()
  
  const [trafficEvents, setTrafficEvents] = useState<PageViewEvent[]>([])
  const [trafficLoading, setTrafficLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // 1. Fetch Real-time Traffic Logs
  useEffect(() => {
    async function fetchTraffic() {
      try {
        const q = query(collection(db, "pageViews"), orderBy("timestamp", "desc"), limit(120))
        const snapshot = await getDocs(q)
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PageViewEvent[]

        // Filter out any legacy admin logs so data stays 100% clean
        const realVisitors = docs.filter(
          (item) =>
            !item.page?.startsWith("/admin") &&
            !item.userEmail?.toLowerCase().includes("admin@ccustudios.com")
        )

        setTrafficEvents(realVisitors)
      } catch (err) {
        console.error("Traffic Fetch Error:", err)
      } finally {
        setTrafficLoading(false)
      }
    }

    fetchTraffic()
  }, [])

  // 2. Metrics Calculations
  const totalLikes =
    comics.reduce((a, c) => a + (c.likes || 0), 0) + characters.reduce((a, c) => a + (c.likes || 0), 0)

  const totalRealViews = trafficEvents.length
  const mobileVisits = trafficEvents.filter((e) => e.device === "Mobile").length
  const desktopVisits = trafficEvents.filter((e) => e.device === "Desktop" || !e.device).length
  const loggedInVisits = trafficEvents.filter((e) => e.isLoggedIn || (e.userEmail && !e.userEmail.includes("Guest"))).length
  const guestVisits = totalRealViews - loggedInVisits

  // Top Viewed Pages Aggregation
  const pageCounts: Record<string, number> = {}
  trafficEvents.forEach((e) => {
    const p = e.page || "/"
    pageCounts[p] = (pageCounts[p] || 0) + 1
  })
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  async function remove(id: string) {
    if (confirm("Delete this comment permanently?")) {
      try {
        setDeletingId(id)
        await deleteComment(id)
      } catch (err) {
        console.error("Failed to delete comment:", err)
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* 🚀 1. REAL-TIME UNIVERSE STATS BAR */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" /> Universal Real-Time Metrics
          </h2>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin Filter Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat 
            label="Clean Audience Views" 
            value={totalRealViews} 
            subtitle="Verified readers" 
            icon={<Eye className="h-5 w-5 text-emerald-400" />} 
          />
          <Stat 
            label="Members / Guests" 
            value={`${loggedInVisits} / ${guestVisits}`} 
            subtitle="Audience type" 
            icon={<UserCheck className="h-5 w-5 text-blue-400" />} 
          />
          <Stat 
            label="Mobile vs Desktop" 
            value={`${mobileVisits} / ${desktopVisits}`} 
            subtitle="Traffic devices" 
            icon={<Smartphone className="h-5 w-5 text-purple-400" />} 
          />
          <Stat 
            label="Total Lore Likes" 
            value={totalLikes} 
            subtitle="Comics & Characters" 
            icon={<Heart className="h-5 w-5 text-red-500" />} 
          />
        </div>
      </div>

      {/* 📊 2. TOP READING PAGES & AUDIENCE INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Read Comics & Routes */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-primary" /> Most Visited Comics & Lore
          </h3>
          {topPages.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">No traffic recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {topPages.map(([path, count]) => (
                <div key={path} className="flex items-center justify-between bg-zinc-950/60 px-3 py-2 rounded-lg border border-zinc-800/80">
                  <span className="font-mono text-xs text-zinc-300 truncate max-w-[220px]">{path}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                    {count} {count === 1 ? "view" : "views"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Vault Summary */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-blue-400" /> Universe Catalog Status
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
                <span className="text-[11px] text-zinc-400">Total Comics Live</span>
                <p className="text-lg font-bold text-white mt-1">{comics.length}</p>
              </div>
              <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
                <span className="text-[11px] text-zinc-400">Total Characters</span>
                <p className="text-lg font-bold text-white mt-1">{characters.length}</p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-4 border-t border-zinc-800/60 pt-2">
            Auto-tracking active across all dynamic chapters & reader routes.
          </p>
        </div>
      </div>

      {/* 📡 3. LIVE VISITOR STREAM FEED */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
        <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-400" /> Live Visitor Activity Stream
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">Real Audience Feed</span>
        </div>

        {trafficLoading ? (
          <p className="py-6 text-center text-xs text-zinc-500">Connecting to universe telemetry...</p>
        ) : trafficEvents.length === 0 ? (
          <p className="py-8 text-center text-xs text-zinc-600">No public reader sessions logged yet.</p>
        ) : (
          <div className="divide-y divide-zinc-800/60 max-h-[380px] overflow-y-auto space-y-1 pr-1">
            {trafficEvents.map((item) => (
              <div key={item.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      {item.page || "/"}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      item.isLoggedIn ? "bg-blue-900/40 text-blue-300 border border-blue-800/40" : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {item.userEmail || "Guest Reader"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {item.location || "Global Web"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {item.device === "Mobile" ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                      {item.device || "Desktop"} ({item.browser || "Web"})
                    </span>
                    <span>•</span>
                    <span className="text-zinc-600 truncate max-w-[130px]">Source: {item.referrer || "Direct"}</span>
                  </div>
                </div>

                <div className="text-right text-[10px] font-mono text-zinc-500 flex items-center gap-1 sm:self-center">
                  <Clock className="h-3 w-3" />
                  {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recent"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 💬 4. LIVE AUDIENCE REVIEWS & COMMENTS MODERATION */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
        <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-accent" /> Audience Comments ({comments.length})
          </h3>
          <span className="text-[11px] text-zinc-500">Community Feedback</span>
        </div>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">No reviews or comments yet in the vault.</p>
          ) : (
            comments.map((c) => (
              <div 
                key={c.id} 
                className={`flex items-start gap-3 rounded-lg p-3 border border-zinc-800 bg-zinc-950/60 transition-all ${
                  deletingId === c.id ? "opacity-40 scale-95" : "hover:border-zinc-700"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white truncate">{c.name || "Anonymous Reader"}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                      c.parentType === "character" 
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {c.parentType || "Comic"}
                    </span>
                  </div>

                  <p className="break-words text-xs text-zinc-400 mt-1 whitespace-pre-line leading-relaxed">
                    {c.message}
                  </p>

                  <p className="mt-2 text-[10px] text-zinc-600">
                    Target Lore: <span className="text-zinc-400 font-mono">{c.parentId || "Main Hub"}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  disabled={deletingId === c.id}
                  className="rounded-lg border border-zinc-800 p-2 bg-zinc-900 hover:border-red-600/80 transition-colors group disabled:opacity-50 self-center"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-4 w-4 text-zinc-500 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ 
  label, 
  value, 
  subtitle, 
  icon 
}: { 
  label: string
  value: string | number
  subtitle: string
  icon: React.ReactNode 
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl p-4 border border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        {icon}
      </div>
      <div className="mt-2">
        <span className="font-display text-xl font-bold text-white">{value}</span>
        <p className="text-[10px] text-zinc-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}
