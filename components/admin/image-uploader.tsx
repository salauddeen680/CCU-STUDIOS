"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { uploadImage } from "@/lib/upload"

type Preview = {
  id: string
  file: File
  url: string
  progress: number
  done: boolean
}

export function ImageUploader({
  folder,
  multiple = true,
  onUploaded,
  label = "Drag & drop images here",
}: {
  folder: string
  multiple?: boolean
  onUploaded: (urls: string[]) => void
  label?: string
}) {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"))
      const next = list.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
        progress: 0,
        done: false,
      }))
      setPreviews((prev) => (multiple ? [...prev, ...next] : next.slice(0, 1)))
    },
    [multiple],
  )

  async function startUpload() {
    if (previews.length === 0 || busy) return
    setBusy(true)
    const uploadedUrls: string[] = []
    for (const p of previews) {
      if (p.done) continue
      try {
        const url = await uploadImage(p.file, folder, (progress) => {
          setPreviews((prev) => prev.map((x) => (x.id === p.id ? { ...x, progress } : x)))
        })
        uploadedUrls.push(url)
        setPreviews((prev) => prev.map((x) => (x.id === p.id ? { ...x, done: true, progress: 100 } : x)))
      } catch (err) {
        console.log("[v0] upload failed", err)
      }
    }
    setBusy(false)
    if (uploadedUrls.length) onUploaded(uploadedUrls)
  }

  function removePreview(id: string) {
    setPreviews((prev) => prev.filter((x) => x.id !== id))
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addFiles(e.dataTransfer.files)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging ? "border-primary bg-primary/10" : "border-border bg-card/40 hover:border-primary/60"
        }`}
      >
        <Upload className="h-7 w-7 text-primary" />
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — auto compressed before upload</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {previews.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-lg border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url || "/placeholder.svg"} alt="" className="aspect-[3/4] w-full object-cover" />
                {!p.done && (
                  <button
                    type="button"
                    onClick={() => removePreview(p.id)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {(busy || p.progress > 0) && !p.done && (
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/50">
                    <div className="h-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                  </div>
                )}
                {p.done && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-accent">
                    Uploaded
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={startUpload}
            disabled={busy || previews.every((p) => p.done)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-red transition hover:brightness-110 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Uploading..." : `Upload ${previews.filter((p) => !p.done).length} image(s)`}
          </button>
        </>
      )}
    </div>
  )
}
