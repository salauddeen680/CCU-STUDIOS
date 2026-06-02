"use client"

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import imageCompression from "browser-image-compression"
import { storage } from "./firebase"

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file
  try {
    return await imageCompression(file, {
      maxSizeMB: 1.2,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
      initialQuality: 0.82,
    })
  } catch {
    return file
  }
}

// Upload a single file, reporting 0-100 progress for that file.
export function uploadFile(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const compressed = await compressImage(file)
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
    const path = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}-${safeName}`
    const task = uploadBytesResumable(ref(storage, path), compressed)

    task.on(
      "state_changed",
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        onProgress?.(pct)
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

// Alias used by the admin uploader component.
export const uploadImage = uploadFile
