"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, User } from "lucide-react"
import type { VaultItem } from "@/lib/types"

export function VaultCard({ item, index = 0 }: { item: VaultItem; index?: number }) {
  const isComic = item.kind === "comic"
  
  // 👑 CRITICAL FIX: URL ko ID ke bajaye aapke naye slug par route kiya hai
  // Agar database mein field ka naam 'slug' ki jagah kuch aur hai, toh 'item.slug' ko badal lena bhai
  const comicRoute = item.slug ? `/comics/${item.slug}` : `/comics/${item.id}`
  const characterRoute = item.slug ? `/characters/${item.slug}` : `/characters/${item.id}`
  
  const href = isComic ? comicRoute : characterRoute
  const title = isComic ? item.title : item.name
  const image = isComic ? item.cover || item.images?.[0] : item.image
  const desc = isComic ? item.description : item.bio

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        href={href}
        className="hover-glow group block overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image || "/placeholder.svg?height=400&width=300&query=cinematic%20comic%20cover"}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
            {isComic ? (
              <>
                <BookOpen className="h-3 w-3 text-primary" /> Comic
              </>
            ) : (
              <>
                <User className="h-3 w-3 text-gold" /> Character
              </>
            )}
          </span>
        </div>
        
        {/* 📋 CARD DETAILED BLOCK */}
        <div className="space-y-1 p-3">
          <h3 className="line-clamp-1 font-display text-sm font-semibold">{title}</h3>
          <p className="line-clamp-2 text-xs text-muted">{desc}</p>
          <div className="flex items-center justify-between pt-1 border-t border-zinc-900 mt-2">
            <span className="text-[11px] text-zinc-500 font-medium tracking-wide uppercase">
              {isComic ? `${item.images?.length || 0} pages` : "Official Profile"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
