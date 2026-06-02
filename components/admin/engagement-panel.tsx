"use client"

import { Heart, Trash2, MessageSquare } from "lucide-react"
import { useComics, useCharacters, useAllComments, deleteComment } from "@/lib/data"

export function EngagementPanel() {
  const { comics } = useComics()
  const { characters } = useCharacters()
  const { comments } = useAllComments()

  const totalLikes =
    comics.reduce((a, c) => a + (c.likes || 0), 0) + characters.reduce((a, c) => a + (c.likes || 0), 0)

  async function remove(id: string) {
    if (confirm("Delete this comment?")) await deleteComment(id)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Total Likes" value={totalLikes} icon={<Heart className="h-5 w-5 text-primary" />} />
        <Stat label="Comments" value={comments.length} icon={<MessageSquare className="h-5 w-5 text-accent" />} />
        <Stat label="Comics + Chars" value={comics.length + characters.length} icon={<Heart className="h-5 w-5 text-foreground" />} />
      </div>

      <div>
        <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Recent Comments</h3>
        <div className="space-y-2">
          {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
          {comments.map((c) => (
            <div key={c.id} className="glass flex items-start gap-3 rounded-lg p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="break-words text-sm text-muted-foreground">{c.message}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">on {c.parentType} · {c.parentId}</p>
              </div>
              <button
                onClick={() => remove(c.id)}
                className="rounded-lg border border-border p-2 hover:border-primary"
                aria-label="Delete comment"
              >
                <Trash2 className="h-4 w-4 text-primary" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="glass flex flex-col gap-1 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        {icon}
      </div>
      <span className="font-display text-2xl font-bold text-foreground">{value}</span>
    </div>
  )
}
