"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
  const mainImage = character.image || "/placeholder.svg?height=400&width=300&query=character"

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/characters"
        className="mb-5 inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> All characters
      </Link>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-zinc-950">
        <div className="absolute inset-0">
          <Image
            src={mainImage}
            alt=""
            fill
            priority
            quality={60}
            className="object-cover opacity-25 blur-md"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="relative flex flex-col items-start gap-5 p-5 sm:flex-row sm:p-8">
          {/* Main Character Avatar */}
          <div className="relative h-48 w-40 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-60 sm:w-48 bg-zinc-900 shadow-2xl">
            <Image
              src={mainImage}
              alt={character.name}
              fill
              priority
              quality={90}
              sizes="(max-width: 640px) 160px, 192px"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-balance font-display text-4xl font-black text-glow text-white">
              {character.name}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-zinc-300 text-sm sm:text-base">
              {character.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Powers + Arcs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-5 border border-white/10 bg-zinc-900/50 backdrop-blur-md">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
            <Zap className="h-5 w-5 text-red-500" /> Powers
          </h2>
          {character.powers?.length ? (
            <ul className="flex flex-wrap gap-2">
              {character.powers.map((p, i) => (
                <li
                  key={i}
                  className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-zinc-200"
                >
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No powers listed.</p>
          )}
        </div>

        <div className="glass rounded-2xl p-5 border border-white/10 bg-zinc-900/50 backdrop-blur-md">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
            <ScrollText className="h-5 w-5 text-yellow-400" /> Story Arcs
          </h2>
          {character.arcs?.length ? (
            <ul className="space-y-2">
              {character.arcs.map((a, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-300">
                  <span className="text-yellow-400">▸</span> {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No arcs listed.</p>
          )}
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-white">Image Gallery</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(src)}
                className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 focus:outline-none group"
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`${character.name} gallery ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          >
            <button
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-zinc-800 text-white transition hover:bg-zinc-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="relative h-[85vh] w-[90vw] max-w-4xl">
              <Image
                src={lightbox}
                alt="Character Showcase"
                fill
                quality={95}
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
