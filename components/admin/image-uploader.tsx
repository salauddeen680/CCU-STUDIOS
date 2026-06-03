"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, CheckCircle2 } from "lucide-react"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void
  label: string
  folder?: string
}

export function ImageUploader({ onUploadComplete, label, folder = "general" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState("")
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setSuccess(false)
    setProgress("Uploading...")

    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`)

    try {
      const snapshot = await uploadBytes(storageRef, file)
      const url = await getDownloadURL(snapshot.ref)
      onUploadComplete(url)
      setSuccess(true)
      setProgress("Success!")
    } catch (err) {
      console.error("Upload Error:", err)
      alert("File upload karne mein samasya aayi.")
      setProgress("Failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleUpload} 
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-red-600/40 bg-zinc-950 p-6 rounded-lg group transition-all"
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 text-red-500 animate-spin mb-1" />
        ) : (
          <Upload className="h-6 w-6 text-zinc-600 group-hover:text-red-500 mb-1" />
        )}
        <span className="text-xs text-zinc-400">
          {uploading ? progress : `Select ${label}`}
        </span>
      </button>
      {success && (
        <p className="text-xs text-green-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> Attached successfully!
        </p>
      )}
    </div>
  )
}
