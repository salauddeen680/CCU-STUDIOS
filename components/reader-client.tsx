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

  // 🛡️ ASLI FIX: Yahan hum zabardasti 'true' nahi bhejenge, balki database se check karenge
  const isPremium = comic.isPaid === true || comic.paid === true

  return (
    <ComicReader 
      title={comic.title} 
      pages={comic.images || []} 
      isPaid={isPremium} // 👈 Ab ye sach mein check karega ki comic free hai ya premium
      freePages={9} // 👈 Premium comics ke liye 9 pages ka free preview bhi de diya
    />
  )
}
