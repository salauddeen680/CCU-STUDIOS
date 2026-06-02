"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeftRight,
  Maximize,
} from "lucide-react"

type Props = {
  title: string
  pages: string[]
}

export function ComicReader({ title, pages }: Props) {
  const [index, setIndex] = useState(0)
  const [rtl, setRtl] = useState(true) // manga style by default
  const [chrome, setChrome] = useState(true)
  const total = pages.length

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => Math.min(Math.max(i + dir, 0), total - 1))
    },
    [total]
  )

  // "next" respects reading direction
  const next = useCallback(() => go(1), [go])
  const prev = useCallback(() => go(-1), [go])

  // Keyboard navigation (arrows mapped to reading direction)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") rtl ? prev() : next()
      else if (e.key === "ArrowLeft") rtl ? next() : prev()
      else if (e.key === "Escape") window.history.back()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [rtl, next, prev])

  // Preload neighbours
  useEffect(() => {
    const preload = (i: number) => {
      if (i < 0 || i >= total) return
      const img = new Image()
      img.src = pages[i]
    }
    preload(index + 1)
    preload(index - 1)
  }, [index, pages, total])

  const progress = useMemo(
    () => (total ? ((index + 1) / total) * 100 : 0),
    [index, total]
  )

  if (total === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-background text-center">
        <p className="font-display text-lg">No pages uploaded yet</p>
        <Link href="/comics" className="text-sm text-primary underline">
          Back to comics
        </Link>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full select-none overflow-hidden bg-black">
      {/* Page viewport */}
      <div
        className="relative h-full w-full"
        onClick={() => setChrome((c) => !c)}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: rtl ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: rtl ? 40 : -40 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) rtl ? prev() : next()
              else if (info.offset.x > 80) rtl ? next() : prev()
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pages[index] || "/placeholder.svg"}
              alt={`${title} — page ${index + 1}`}
              loading="eager"
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Tap zones */}
        <button
          aria-label="Previous area"
          onClick={(e) => {
            e.stopPropagation()
            rtl ? next() : prev()
          }}
          className="absolute inset-y-0 left-0 w-1/3"
        />
        <button
          aria-label="Next area"
          onClick={(e) => {
            e.stopPropagation()
            rtl ? prev() : next()
          }}
          className="absolute inset-y-0 right-0 w-1/3"
        />
      </div>

      {/* Top chrome */}
      <AnimatePresence>
        {chrome && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="glass-strong absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-4 py-3"
          >
            <Link
              href="/comics"
              className="grid h-9 w-9 place-items-center rounded-lg bg-card text-foreground/80 hover:text-primary"
              aria-label="Close reader"
            >
              <X className="h-4 w-4" />
            </Link>
            <p className="line-clamp-1 flex-1 text-center font-display text-sm font-semibold">
              {title}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setRtl((r) => !r)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-2 text-[11px] font-semibold text-foreground/80 hover:text-primary"
              title="Toggle reading direction"
            >
              <ArrowLeftRight className="h-4 w-4" />
              {rtl ? "RTL" : "LTR"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom chrome */}
      <AnimatePresence>
        {chrome && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="glass-strong absolute inset-x-0 bottom-0 px-4 py-3"
          >
            <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                disabled={index === 0}
                className="inline-flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Maximize className="h-3.5 w-3.5" />
                {index + 1} / {total}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                disabled={index === total - 1}
                className="inline-flex items-center gap-1 rounded-lg bg-card px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
