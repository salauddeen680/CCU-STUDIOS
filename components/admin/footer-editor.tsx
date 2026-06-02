"use client"

import { useEffect, useState } from "react"
import { Save } from "lucide-react"
import { useFooter, saveFooter } from "@/lib/data"

export function FooterEditor() {
  const { footer } = useFooter()
  const [studio, setStudio] = useState("")
  const [universe, setUniverse] = useState("")
  const [creator, setCreator] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (footer) {
      setStudio(footer.studio || "")
      setUniverse(footer.universe || "")
      setCreator(footer.creator || "")
    }
  }, [footer])

  async function save() {
    setSaving(true)
    try {
      await saveFooter({ studio, universe, creator })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Footer Editor</h2>
        <p className="text-sm text-muted-foreground">Live edit the global footer shown across the site.</p>
      </div>

      <Field label="Studio" value={studio} onChange={setStudio} />
      <Field label="Universe" value={universe} onChange={setUniverse} />
      <Field label="Creator credit" value={creator} onChange={setCreator} />

      <div className="glass rounded-xl p-5 text-center">
        <p className="font-display text-lg font-bold tracking-widest text-primary text-glow-red">{studio}</p>
        <p className="text-sm uppercase tracking-[0.3em] text-gold">{universe}</p>
        <p className="mt-1 text-xs text-muted-foreground">{creator}</p>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
      >
        <Save className="h-4 w-4" /> {saving ? "Saving..." : saved ? "Saved!" : "Save Footer"}
      </button>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
    </div>
  )
}
