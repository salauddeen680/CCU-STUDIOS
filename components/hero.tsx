"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-cosmic.png"
          alt=""
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-sm uppercase tracking-[0.4em] text-gold text-glow-gold"
        >
          Cosmic Cinematic Universe
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-3 max-w-2xl text-balance font-display text-4xl font-bold leading-tight sm:text-6xl"
        >
          Enter the <span className="text-glow text-primary">CCU</span> Universe
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-xl text-pretty text-sm text-foreground/80 sm:text-base"
        >
          Premium comics, legendary characters, and an ever-expanding original
          saga. Dive into the vault and experience the universe in motion.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-7 flex flex-wrap gap-3"
        >
          <Link
            href="/comics"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            <BookOpen className="h-4 w-4" /> Read Comics
          </Link>
          <Link
            href="/ultimate"
            className="inline-flex items-center gap-2 rounded-xl border border-gold/50 bg-card px-5 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10"
          >
            <Sparkles className="h-4 w-4" /> Ultimate Comic
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
