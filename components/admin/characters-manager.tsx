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
  const { characters = [] } = useCharacters()
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
      if (editing) {
        await updateCharacter(editing.id, payload)
      } else {
        await createCharacter(payload)
      }
      setShowForm(false)
      setForm({ ...empty })
      setPowersText("")
      setArcsText("")
      setEditing(null)
      alert("Character profile saved successfully! 🔥")
    } catch (err) {
      console.error("Failed to save character:", err)
      alert("Save karne mein dikkat aayi.")
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (confirm("Delete this character permanently?")) {
      try {
        await deleteCharacter(id)
      } catch (err) {
        console.error("Failed to delete character:", err)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Characters Manager</h2>
          <p className="text-sm text-muted-foreground">{(characters || []).length} legendary characters in the vault</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
        >
          <Plus className="h-4 w-4" /> New Character
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/40 border border-zinc-800 space-y-5 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-white">
              {editing ? "✏️ Edit Character Profile" : "🔥 Add New Legend"}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
              <X className="h-5 w-5 text-zinc-500 hover:text-white" />
            </button>
          </div>

          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Character name (e.g., Zenith, Michael)"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-600"
          />
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Character Biography & Lore..."
            rows={4}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-600 resize-none"
          />
          <input
            value={powersText}
            onChange={(e) => setPowersText(e.target.value)}
            placeholder="Powers & Abilities (e.g., Divine Shadow, God Axe, Teleportation)"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-600"
          />
          <textarea
            value={arcsText}
            onChange={(e) => setArcsText(e.target.value)}
            placeholder="Story arcs involvement (one line per arc, e.g., Genesis of Destruction)"
            rows={3}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-600 resize-none"
          />

          {/* 🖼️ Profile Avatar Section linked with updated Imgbb Pipeline */}
          <div>
            <p className="mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Profile Main Avatar</p>
            <ImageUploader
              folder="characters"
              onUploadComplete={(url) => setForm((f) => ({ ...f, image: url }))}
              label="Profile Image"
            />
            {form.image && (
              <img src={form.image || "/placeholder.svg"} alt="profile" className="mt-3 h-32 w-32 rounded-lg object-cover border border-zinc-800 shadow-md" />
            )}
          </div>

          {/* 🎨 Character Gallery Section linked with updated Imgbb Pipeline */}
          <div>
            <p className="mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Character Gallery / Concept Art ({form.gallery.length})</p>
            <ImageUploader
              folder="characters/gallery"
              onUploadComplete={(url) => setForm((f) => ({ ...f, gallery: [...f.gallery, url] }))}
              label="Gallery Image Piece"
            />
            {form.gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {form.gallery.map((src, i) => (
                  <div key={i} className="relative group rounded border border-zinc-800 overflow-hidden">
                    <img src={src || "/placeholder.svg"} alt={`gallery ${i + 1}`} className="aspect-square w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }))}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white z-10"
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
            type="button"
            onClick={save}
            disabled={saving}
            className="w-full bg-red-600 text-white text-xs font-bold py-3 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 transition hover:bg-red-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving Custom Lore..." : "Save Character Profile"}
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {(characters || []).length === 0 && (
          <p className="text-sm text-zinc-600 col-span-2 text-center py-4">No characters found in this universe tier.</p>
        )}
        {(characters || []).map((c) => (
          <div key={c.id} className="bg-zinc-900/20 flex items-center gap-4 rounded-xl p-3 border border-zinc-800 hover:border-red-600/30 transition-all">
            <img
              src={c.image || "/placeholder.svg?height=64&width=64&query=hero"}
              alt={c.name}
              className="h-16 w-16 rounded-full object-cover border-2 border-zinc-800"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white text-base">{c.name}</p>
              <p className="truncate text-xs text-zinc-500 mt-0.5">{c.bio || "No lore added yet."}</p>
              <p className="mt-1 text-[11px] text-red-500 font-medium bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 width-fit inline-block">
                ❤️ {c.likes || 0} Universe Likes
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(c)} className="rounded-lg border border-zinc-800 p-2 bg-zinc-950 hover:border-red-600/80 transition-colors" aria-label="Edit">
                <Pencil className="h-4 w-4 text-white" />
              </button>
              <button type="button" onClick={() => remove(c.id)} className="rounded-lg border border-zinc-800 p-2 bg-zinc-950 hover:border-red-600/80 transition-colors" aria-label="Delete">
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
