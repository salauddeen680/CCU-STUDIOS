"use client"

import { useState } from "react"
import { Send, Trash2, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useComments, addComment, deleteComment } from "@/lib/data"
import { isSpam } from "@/lib/config"
import { useAdminSession } from "@/lib/use-admin"

type Props = {
  parentId: string
  parentType: "comic" | "character"
}

export function Comments({ parentId, parentType }: Props) {
  const { comments, loading } = useComments(parentId)
  const { isAdmin } = useAdminSession()
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const n = name.trim()
    const m = message.trim()
    if (!n || !m) {
      setError("Please enter your name and a message.")
      return
    }
    if (isSpam(m)) {
      setError("Your message looks like spam and was blocked.")
      return
    }
    setBusy(true)
    try {
      await addComment({ parentId, parentType, name: n, message: m })
      setMessage("")
    } catch {
      setError("Could not post comment. Try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mt-8">
      <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
        <MessageCircle className="h-5 w-5 text-primary" />
        Discussion
        <span className="text-sm font-normal text-muted">({comments.length})</span>
      </h3>

      <form onSubmit={submit} className="glass mb-6 space-y-3 rounded-2xl p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={40}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          maxLength={600}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60"
        />
        {error && <p className="text-xs text-primary">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Post
          </button>
        </div>
      </form>

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted">No comments yet. Be the first to react.</p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {comments.map((c) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gold">{c.name}</p>
                    <p className="mt-1 text-sm text-foreground/90">{c.message}</p>
                    {c.createdAt && (
                      <p className="mt-2 text-[11px] text-muted">
                        {new Date(c.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => deleteComment(c.id)}
                      aria-label="Delete comment"
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-primary/10 hover:text-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  )
}
