"use client"

import { useComic } from "@/lib/data"
import { ComicReader } from "./comic-reader"
import { ReaderSkeleton } from "./skeletons"

export function ReaderClient({ id }: { id: string }) {
  const { comic, loading } = useComic(id)

  if (loading) return <ReaderSkeleton />
  if (!comic)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-zinc-500 font-sans tracking-wide">Comic not found.</p>
      </div>
    )

  // 🔥 FIX: Yahan 'true' set kar do, ab database mein kuch bhi ho, ye 'Paid' hi dikhega.
  // Tumhein ab database mein kuch edit nahi karna padega.
  return (
    <ComicReader 
      title={comic.title} 
      pages={comic.images || []} 
      isPaid={true} 
    />
  )
}
