"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Zap, ScrollText, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCharacter } from "@/lib/data"
import { Comments } from "./comments"

export function CharacterProfile({ id }: { id: string }) {
  const { character, loading } = useCharacter(id)
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    )
  }

  if (!character) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="font-display text-xl">Character not found</p>
        <Link href="/characters" className="mt-2 inline-block text-sm text-primary underline">
          Back to characters
        </Link>
      </div>
    )
  }

  const gallery = character.gallery?.length ? character.gallery : []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/characters"
        className="mb-5 inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" /> All characters
      </Link>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={character.image || "/placeholder.svg?height=400&width=900&query=hero"}
            alt=""
            className="h-full w-full object-cover opacity-30 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative flex flex-col items-start gap-5 p-5 sm:flex-row sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={character.image || "/placeholder.svg?height=300&width=240&query=character"}
            alt={character.name}
            className="hover-glow h-48 w-40 shrink-0 rounded-2xl border border-border object-cover sm:h-60 sm:w-48"
          />
          <div className="flex-1">
            <h1 className="text-balance font-display text-4xl font-bold text-glow">
              {character.name}
            </h1>
            {/* ❤️ LIKE BUTTON YAHAN SE SAFELY DELETE KAR DIYA GAYA HAI */}
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-foreground/85">
              {character.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Powers + Arcs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <Zap className="h-5 w-5 text-primary" /> Powers
          </h2>
          {character.powers?.length ? (
            <ul className="flex flex-wrap gap-2">
              {character.powers.map((p, i) => (
                <li
                  key={i}
                  className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No powers listed.</p>
          )}
        </div>
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <ScrollText className="h-5 w-5 text-gold" /> Story Arcs
          </h2>
          {character.arcs?.length ? (
            <ul className="space-y-2">
              {character.arcs.map((a, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/85">
                  <span className="text-gold">▸</span> {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No arcs listed.</p>
          )}
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 font-display text-lg font-bold">Image Gallery</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(src)}
                className="hover-glow overflow-hidden rounded-xl border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src || "/placeholder.svg"}
                  alt={`${character.name} gallery ${i + 1}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <Comments parentId={character.id} parentType="character" />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          >
            <button
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox || "/placeholder.svg"}
              alt=""
              className="max-h-[90vh] max-w-full rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
