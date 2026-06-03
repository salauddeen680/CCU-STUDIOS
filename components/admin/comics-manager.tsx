"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus, Save, X, Layers } from "lucide-react"
import { useComics, createComic, updateComic, deleteComic } from "@/lib/data"
import { ImageUploader } from "./image-uploader"
import type { Comic } from "@/lib/types"

// Humne form ke andar ab ek 'timeline' option jodh diya hai
const empty = { 
  title: "", 
  description: "", 
  cover: "", 
  images: [] as string[], 
  timeline: "asli" // default option: asli, purani, ya dusri
}

export function ComicsManager() {
  const { comics } = useComics()
  const [editing, setEditing] = useState<Comic | null>(null)
  const [form, setForm] = useState({ ...empty })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm({ ...empty })
    setShowForm(true)
  }

  function openEdit(c: Comic) {
    setEditing(c)
    
    // Purane data ke sath compatibility rakhne ke liye check lagaya hai
    let currentTimeline = "asli"
    if (c.timeline) {
      currentTimeline = c.timeline
    } else if (c.ultimate) {
      currentTimeline = "purani"
    }

    setForm({
      title: c.title,
      description: c.description,
      cover: c.cover || "",
      images: c.images || [],
      timeline: currentTimeline,
    })
    setShowForm(true)
  }

  async function save() {
    if (!form.title.trim()) return
    setSaving(true)
    
    const payload = {
      ...form,
      cover: form.cover || form.images[0] || "",
      // ultimate checkbox ko backup ke liye true rakhenge agar timeline purani ya dusri ho
      ultimate: form.timeline === "purani" || form.timeline === "dusri",
    }
    
    try {
      if (editing) {
        await updateComic(editing.id, payload)
      } else {
        await createComic(payload)
      }
      setShowForm(false)
      setForm({ ...empty })
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (confirm("Delete this comic permanently?")) await deleteComic(id)
  }

  // Helper function website par sundar rang-birange badges dikhane ke liye
  function getTimelineBadge(timelineStr: string | undefined, ultimateBool: boolean) {
    const t = timelineStr || (ultimateBool ? "purani" : "asli")
    
    if (t === "purani") {
      return <span className="ml-2 inline-block rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">⚡ Purani Timeline</span>
    }
    if (t === "dusri") {
      return <span className="ml-2 inline-block rounded bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/30">🌌 Dusra Universe</span>
    }
    return <span className="ml-2 inline-block rounded bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">🟢 Asli Timeline</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Comics Manager</h2>
          <p className="text-sm text-muted-foreground">{comics.length} comics in the vault</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-red transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> New Comic
        </button>
      </div>

      {showForm && (
        <div className="glass space-y-5 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {editing ? "Edit Comic" : "Create Comic"}
            </h3>
            <button onClick={() => setShowForm(false)} aria-label="Close form">
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Comic title"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />

          {/* Smart Timeline Selection Option Dropdown */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Layers className="h-4 w-4 text-primary" /> Select Comic Timeline / Universe
            </label>
            <select
              value={form.timeline}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="asli">🟢 Asli Timeline (Real-Time Stories)</option>
              <option value="purani">👑 Purani Timeline (Backstory / Origins)</option>
              <option value="dusri">🌌 Dusre Characters / Inspired Universe</option>
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Cover image</p>
            <ImageUploader
              folder="comics/covers"
              multiple={false}
              onUploaded={(urls) => setForm((f) => ({ ...f, cover: urls[0] }))}
              label="Upload cover"
            />
            {form.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.cover || "/placeholder.svg"} alt="cover" className="mt-3 h-32 rounded-lg object-cover" />
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">
              Comic pages ({form.images.length}) — bulk upload 15-25 pages
            </p>
            <ImageUploader
              folder="comics/pages"
              multiple
              onUploaded={(urls) => setForm((f) => ({ ...f, images: [...f.images, ...urls] }))}
              label="Upload comic pages"
            />
            {form.images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {form.images.map((src, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src || "/placeholder.svg"} alt={`page ${i + 1}`} className="aspect-[3/4] w-full rounded object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white z-10"
                      aria-label="Remove page"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Comic"}
          </button>
        </div>
      )}

      <div className="grid gap-3">
        {comics.map((c) => (
          <div key={c.id} className="glass flex items-center gap-4 rounded-xl p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.cover || c.images?.[0] || "/placeholder.svg?height=80&width=60&query=comic"}
              alt={c.title}
              className="h-20 w-14 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-y-1">
                <p className="truncate font-semibold text-foreground">
                  {c.title}
                </p>
                {getTimelineBadge(c.timeline, !!c.ultimate)}
              </div>
              <p className="truncate text-xs text-muted-foreground mt-0.5">{c.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.images?.length || 0} pages · {c.likes || 0} likes
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="rounded-lg border border-border p-2 hover:border-primary" aria-label="Edit">
                <Pencil className="h-4 w-4 text-foreground" />
              </button>
              <button onClick={() => remove(c.id)} className="rounded-lg border border-border p-2 hover:border-primary" aria-label="Delete">
                <Trash2 className="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
