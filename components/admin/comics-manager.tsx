"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus, Save, X, Star } from "lucide-react"
import { useComics, createComic, updateComic, deleteComic } from "@/lib/data"
import { ImageUploader } from "./image-uploader"
import type { Comic } from "@/lib/types"

const empty = { title: "", description: "", cover: "", images: [] as string[], ultimate: false }

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
    setForm({
      title: c.title,
      description: c.description,
      cover: c.cover || "",
      images: c.images || [],
      ultimate: !!c.ultimate,
    })
    setShowForm(true)
  }

  async function save() {
    if (!form.title.trim()) return
    setSaving(true)
    const payload = {
      ...form,
      cover: form.cover || form.images[0] || "",
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

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.ultimate}
              onChange={(e) => setForm({ ...form, ultimate: e.target.checked })}
              className="accent-primary"
            />
            <Star className="h-4 w-4 text-accent" /> Feature in Ultimate Comic
          </label>

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
                      onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white"
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
              <p className="truncate font-semibold text-foreground">
                {c.title} {c.ultimate && <Star className="ml-1 inline h-3.5 w-3.5 text-accent" />}
              </p>
              <p className="truncate text-xs text-muted-foreground">{c.description}</p>
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
