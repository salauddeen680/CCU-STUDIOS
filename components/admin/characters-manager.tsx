"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus, Save, X } from "lucide-react"
import { useCharacters, createCharacter, updateCharacter, deleteCharacter } from "@/lib/data"
import { ImageUploader } from "./image-uploader"
import type { Character } from "@/lib/types"

const empty = {
  name: "",
  bio: "",
  image: "",
  powers: [] as string[],
  arcs: [] as string[],
  gallery: [] as string[],
}

export function CharactersManager() {
  const { characters } = useCharacters()
  const [editing, setEditing] = useState<Character | null>(null)
  const [form, setForm] = useState({ ...empty })
  const [powersText, setPowersText] = useState("")
  const [arcsText, setArcsText] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm({ ...empty })
    setPowersText("")
    setArcsText("")
    setShowForm(true)
  }

  function openEdit(c: Character) {
    setEditing(c)
    setForm({
      name: c.name,
      bio: c.bio,
      image: c.image || "",
      powers: c.powers || [],
      arcs: c.arcs || [],
      gallery: c.gallery || [],
    })
    setPowersText((c.powers || []).join(", "))
    setArcsText((c.arcs || []).join("\n"))
    setShowForm(true)
  }

  async function save() {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = {
      ...form,
      powers: powersText.split(",").map((s) => s.trim()).filter(Boolean),
      arcs: arcsText.split("\n").map((s) => s.trim()).filter(Boolean),
    }
    try {
      if (editing) await updateCharacter(editing.id, payload)
      else await createCharacter(payload)
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (confirm("Delete this character permanently?")) await deleteCharacter(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Characters Manager</h2>
          <p className="text-sm text-muted-foreground">{characters.length} characters in the universe</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-red transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> New Character
        </button>
      </div>

      {showForm && (
        <div className="glass space-y-5 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {editing ? "Edit Character" : "Add Character"}
            </h3>
            <button onClick={() => setShowForm(false)} aria-label="Close form">
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Character name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Biography"
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <input
            value={powersText}
            onChange={(e) => setPowersText(e.target.value)}
            placeholder="Powers (comma separated)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <textarea
            value={arcsText}
            onChange={(e) => setArcsText(e.target.value)}
            placeholder="Story arcs (one per line)"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Profile image</p>
            <ImageUploader
              folder="characters"
              multiple={false}
              onUploaded={(urls) => setForm((f) => ({ ...f, image: urls[0] }))}
              label="Upload profile image"
            />
            {form.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image || "/placeholder.svg"} alt="profile" className="mt-3 h-32 w-32 rounded-lg object-cover" />
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Gallery ({form.gallery.length})</p>
            <ImageUploader
              folder="characters/gallery"
              multiple
              onUploaded={(urls) => setForm((f) => ({ ...f, gallery: [...f.gallery, ...urls] }))}
              label="Upload gallery images"
            />
            {form.gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {form.gallery.map((src, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src || "/placeholder.svg"} alt={`gallery ${i + 1}`} className="aspect-square w-full rounded object-cover" />
                    <button
                      onClick={() => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }))}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white"
                      aria-label="Remove image"
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
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Character"}
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {characters.map((c) => (
          <div key={c.id} className="glass flex items-center gap-4 rounded-xl p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.image || "/placeholder.svg?height=64&width=64&query=hero"}
              alt={c.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">{c.bio}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.likes || 0} likes</p>
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
