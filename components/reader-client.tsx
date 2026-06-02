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
        <p className="text-sm text-muted">Comic not found.</p>
      </div>
    )

  return <ComicReader title={comic.title} pages={comic.images || []} />
}
