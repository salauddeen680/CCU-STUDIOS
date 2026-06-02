"use client"

import Link from "next/link"
import { BookOpen, ChevronLeft, Layers } from "lucide-react"
import { useComic, likeComic } from "@/lib/data"
import { LikeButton } from "./like-button"
import { Comments } from "./comments"

export function ComicDetail({ id }: { id: string }) {
  const { comic, loading } = useComic(id)

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="skeleton mb-4 h-6 w-40 rounded" />
        <div className="grid gap-6 sm:grid-cols-[260px_1fr]">
          <div className="skeleton aspect-[3/4] rounded-2xl" />
          <div className="space-y-3">
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-24 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!comic) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="font-display text-xl">Comic not found</p>
        <Link href="/comics" className="mt-2 inline-block text-sm text-primary underline">
          Back to comics
        </Link>
      </div>
    )
  }

  const cover = comic.cover || comic.images?.[0]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/comics"
        className="mb-5 inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" /> All comics
      </Link>

      <div className="grid gap-6 sm:grid-cols-[260px_1fr]">
        <div className="hover-glow overflow-hidden rounded-2xl border border-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover || "/placeholder.svg?height=520&width=390&query=comic%20cover"}
            alt={comic.title}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>

        <div>
          {comic.ultimate && (
            <span className="inline-block rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
              Ultimate Comic
            </span>
          )}
          <h1 className="mt-2 text-balance font-display text-3xl font-bold">
            {comic.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-4 w-4" /> {comic.images?.length || 0} pages
            </span>
            <LikeButton
              count={comic.likes || 0}
              storageKey={`comic:${comic.id}`}
              onLike={() => likeComic(comic.id)}
              size="lg"
            />
          </div>
          <p className="mt-4 text-pretty leading-relaxed text-foreground/85">
            {comic.description}
          </p>

          <Link
            href={`/comics/${comic.id}/read`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            <BookOpen className="h-4 w-4" /> Read Now
          </Link>
        </div>
      </div>

      <Comments parentId={comic.id} parentType="comic" />
    </div>
  )
}
