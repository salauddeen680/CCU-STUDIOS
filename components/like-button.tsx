"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"

type Props = {
  count: number
  onLike: () => Promise<void> | void
  storageKey: string
  size?: "sm" | "lg"
}

export function LikeButton({ count, onLike, storageKey, size = "sm" }: Props) {
  const [liked, setLiked] = useState(false)
  const [busy, setBusy] = useState(false)

  // remember liked state locally so a user does not spam likes
  useEffect(() => {
    setLiked(localStorage.getItem(`like:${storageKey}`) === "1")
  }, [storageKey])

  const handle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (liked || busy) return
    setBusy(true)
    try {
      await onLike()
      setLiked(true)
      localStorage.setItem(`like:${storageKey}`, "1")
    } finally {
      setBusy(false)
    }
  }

  const big = size === "lg"

  return (
    <button
      onClick={handle}
      disabled={busy}
      aria-label={liked ? "Liked" : "Like"}
      className={`group inline-flex items-center gap-1.5 rounded-full transition ${
        big
          ? "bg-card px-4 py-2 text-sm hover:bg-primary/10"
          : "px-1.5 py-1 text-xs"
      } ${liked ? "text-primary" : "text-muted hover:text-primary"}`}
    >
      <motion.span
        key={liked ? "on" : "off"}
        animate={liked ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.35 }}
        className="inline-flex"
      >
        <Heart
          className={big ? "h-5 w-5" : "h-4 w-4"}
          fill={liked ? "currentColor" : "none"}
        />
      </motion.span>
      <span className="font-semibold tabular-nums">{count}</span>
    </button>
  )
}
