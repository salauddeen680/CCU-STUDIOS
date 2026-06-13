"use client"

import { useState, useEffect } from "react"
import { Video, Plus, Trash2, Loader2, Link2, Image as ImageIcon } from "lucide-react"

interface VideoLink {
  id: string
  title: string
  url: string
  posterUrl: string
}

// 👑 CRITICAL FIX: Sahi tareeke se 'VideoLinksManager' naam export hona chahiye
export function VideoLinksManager() {
  const [links, setLinks] = useState<VideoLink[]>([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Form States
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [posterUrl, setPosterUrl] = useState("")
  const [message, setMessage] = useState("")

  // 📥 Video Links Fetch karne ke liye (Relative URL use kiya hai taaki crash na ho)
  async function fetchLinks() {
    try {
      const res = await fetch("/api/social-links")
      if (res.ok) {
        const data = await res.json()
        setLinks(data)
      }
    } catch (error) {
      console.error("Failed to load video links", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  // ➕ Naya Video Link Add karne ke liye
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, posterUrl }),
      })

      if (res.ok) {
        setMessage("Success! Video Link Added 🔥")
        setTitle("")
        setUrl("")
        setPosterUrl("")
        fetchLinks()
      } else {
        setMessage("Failed to add link. Check your API route.")
      }
    } catch (error) {
      setMessage("Error submitting data.")
    } finally {
      setSubmitLoading(false)
    }
  }

  // 🗑️ Video Link Delete karne ke liye
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video link?")) return

    try {
      const res = await fetch(`/api/api/social-links?id=${id}`, {
        method: "DELETE",
      })
      // Yahan relative path agar aapka API folder structure alag hai toh use adjust karein
      const fallbackRes = res.ok ? res : await fetch(`/api/social-links?id=${id}`, { method: "DELETE" })
      
      if (fallbackRes.ok) {
        setLinks(links.filter((link) => link.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete link", error)
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Video className="h-6 w-6 text-red-600" /> Social Videos Manager
        </h1>
        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">
          Add or remove home page video banners and thumbnails
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-red-600" /> Add New Video Poster
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Video Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-red-600 focus:outline-none transition-all"
                placeholder="e.g. Michael - The Former Crown Official Teaser"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Video URL (YouTube/Insta)</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-red-600 focus:outline-none transition-all"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Poster / Thumbnail Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
              <input
                type="url"
                required
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-2.5 text-sm text-white focus:border-red-600 focus:outline-none transition-all"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          {message && (
            <p className={`text-xs font-semibold p-3 rounded-lg text-center ${
              message.includes("Success") ? "bg-green-950/30 text-green-500 border border-green-900/50" : "bg-red-950/30 text-red-500 border border-red-900/50"
            }`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitLoading}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Deploy Video Poster"
            )}
          </button>
        </form>
      </div>

      {/* List Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Active Video Posters</h2>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-red-600" />
          </div>
        ) : links.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">No video posters added yet.</p>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/40 hover:border-zinc-700 transition">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-20 rounded bg-zinc-900 overflow-hidden border border-zinc-800 shrink-0">
                    <img src={link.posterUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-200 truncate">{link.title}</h3>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-red-500 hover:underline truncate block mt-0.5">
                      {link.url}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-zinc-900/80 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
