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
import { collection, onSnapshot } from "firebase/firestore"

const BLOCKED_EMAILS = ["admin@ccustudios.com", "srk042221@gmail.com"]

export function EngagementPanel() {
  const { comics = [] } = useComics()
  const { characters = [] } = useCharacters()
  const { comments = [] } = useAllComments()
  
  const [trafficEvents, setTrafficEvents] = useState<any[]>([])
  const [trafficLoading, setTrafficLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ⚡ Live Real-time Firestore Listener (No Refresh Needed)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pageViews"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Clean filter
      const cleanVisitors = docs.filter((item: any) => {
        const email = (item.userEmail || "").toLowerCase()
        const isBlocked = BLOCKED_EMAILS.some((b) => email.includes(b.toLowerCase()))
        const isAdminRoute = item.page?.startsWith("/admin") || item.page?.startsWith("/api")
        return !isBlocked && !isAdminRoute
      })

      // Sort by newest first
      cleanVisitors.sort((a: any, b: any) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.timestamp?.seconds ? a.timestamp.seconds * 1000 : 0)
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.timestamp?.seconds ? b.timestamp.seconds * 1000 : 0)
        return timeB - timeA
      })

      setTrafficEvents(cleanVisitors)
      setTrafficLoading(false)
    }, (error) => {
      console.error("Live traffic listener error:", error)
      setTrafficLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Exact Time Formatter
  const formatEventTime = (item: any) => {
    try {
      let dateObj: Date | null = null
      if (item.createdAt) {
        dateObj = new Date(item.createdAt)
      } else if (item.timestamp?.toDate) {
        dateObj = item.timestamp.toDate()
      } else if (item.timestamp?.seconds) {
        dateObj = new Date(item.timestamp.seconds * 1000)
      }

      if (!dateObj || isNaN(dateObj.getTime())) return "Live Now"

      return dateObj.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    } catch {
      return "Live Now"
    }
  }

  const totalLikes = comics.reduce((a, c) => a + (c.likes || 0), 0) + characters.reduce((a, c) => a + (c.likes || 0), 0)
  const totalRealViews = trafficEvents.length
  const mobileVisits = trafficEvents.filter((e) => e.device?.includes("Mobile") || e.device?.includes("Android") || e.device?.includes("iPhone")).length
  const desktopVisits = totalRealViews - mobileVisits
  const loggedInVisits = trafficEvents.filter((e) => e.isLoggedIn || (e.userEmail && !e.userEmail.includes("Guest"))).length
  const guestVisits = totalRealViews - loggedInVisits

  // Top Pages
  const pageCounts: Record<string, number> = {}
  trafficEvents.forEach((e) => {
    const p = e.page || "/"
    pageCounts[p] = (pageCounts[p] || 0) + 1
  })
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)

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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400 animate-pulse" /> Real-Time Engagement & Live Traffic
        </h2>
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" /> Self-Spam Filter Active
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl p-4 border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Audience Views</span>
            <Eye className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="font-display text-2xl font-bold text-white mt-2">{totalRealViews}</p>
          <span className="text-[10px] text-zinc-500">All-Time Visitors</span>
        </div>

        <div className="rounded-xl p-4 border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Members / Guests</span>
            <UserCheck className="h-4 w-4 text-blue-400" />
          </div>
          <p className="font-display text-2xl font-bold text-white mt-2">{loggedInVisits} / {guestVisits}</p>
          <span className="text-[10px] text-zinc-500">User Types</span>
        </div>

        <div className="rounded-xl p-4 border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Mobile vs PC</span>
            <Smartphone className="h-4 w-4 text-purple-400" />
          </div>
          <p className="font-display text-2xl font-bold text-white mt-2">{mobileVisits} / {desktopVisits}</p>
          <span className="text-[10px] text-zinc-500">Device Platform</span>
        </div>

        <div className="rounded-xl p-4 border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Likes</span>
            <Heart className="h-4 w-4 text-red-500" />
          </div>
          <p className="font-display text-2xl font-bold text-white mt-2">{totalLikes}</p>
          <span className="text-[10px] text-zinc-500">Comics & Characters</span>
        </div>
      </div>

      {/* Top Read Comics Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-red-500" /> Most Visited Pages & Content
        </h3>
        {topPages.length === 0 ? (
          <p className="text-xs text-zinc-500 py-3 text-center">No traffic logged yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topPages.map(([path, count], idx) => (
              <div key={path} className="flex items-center justify-between bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
                <span className="font-mono text-xs text-zinc-300 truncate">#{idx + 1} {path}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                  {count} views
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Visitor Feed */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
        <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-400" /> Live Visitor Stream (Auto-Updating)
          </h3>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Live Socket
          </span>
        </div>

        {trafficLoading ? (
          <p className="py-6 text-center text-xs text-zinc-500">Connecting live stream...</p>
        ) : trafficEvents.length === 0 ? (
          <p className="py-8 text-center text-xs text-zinc-600">No audience visits logged yet.</p>
        ) : (
          <div className="divide-y divide-zinc-800/60 max-h-[420px] overflow-y-auto space-y-1.5 pr-1">
            {trafficEvents.map((item) => (
              <div key={item.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                      Viewed: {item.page || "/"}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.isLoggedIn ? "bg-blue-900/40 text-blue-300 border border-blue-800/40" : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {item.userEmail || "Guest Reader"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 flex-wrap">
                    <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-zinc-500" /> {item.location || "Global Web"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {item.device?.includes("Mobile") || item.device?.includes("Android") || item.device?.includes("iPhone") ? (
                        <Smartphone className="h-3 w-3 text-purple-400" />
                      ) : (
                        <Monitor className="h-3 w-3 text-blue-400" />
                      )}
                      {item.device || "Desktop"} ({item.browser || "Web"})
                    </span>
                    <span>•</span>
                    <span className="text-zinc-500">Source: {item.referrer || "Direct"}</span>
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-zinc-300 flex items-center gap-1.5 sm:self-center bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  {formatEventTime(item)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments Moderation */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
          <MessageSquare className="h-4 w-4 text-red-500" /> Audience Comments ({comments.length})
        </h3>
        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">No reviews or comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3 rounded-lg p-3 border border-zinc-800 bg-zinc-950">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{c.name || "Anonymous Reader"}</p>
                  <p className="text-xs text-zinc-400 mt-1">{c.message}</p>
                  <p className="mt-2 text-[10px] text-zinc-600 font-mono">Location: {c.parentId || "Main Hub"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  disabled={deletingId === c.id}
                  className="rounded border border-zinc-800 p-1.5 text-zinc-500 hover:text-red-500 hover:border-red-600 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
