"use client"

import { useState } from "react"
import { Heart, Trash2, MessageSquare, BookOpen, UserCheck } from "lucide-react"
import { useComics, useCharacters, useAllComments, deleteComment } from "@/lib/data"

export function EngagementPanel() {
  const { comics } = useComics()
  const { characters } = useCharacters()
  const { comments } = useAllComments()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Total likes calculate karne ka sahi aur safe tarika
  const totalLikes =
    comics.reduce((a, c) => a + (c.likes || 0), 0) + characters.reduce((a, c) => a + (c.likes || 0), 0)

  async function remove(id: string) {
    if (confirm("Delete this comment permanently?")) {
      try {
        setDeletingId(id)
        await deleteComment(id)
      } catch (err) {
        console.error("Failed to delete comment:", err)
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* 📊 Full Dashboard Stats Grid — Ab mobile par ekdum perfect dikhega */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total Likes" value={totalLikes} icon={<Heart className="h-5 w-5 text-primary" />} />
        <Stat label="Total Comments" value={comments.length} icon={<MessageSquare className="h-5 w-5 text-accent" />} />
        <Stat label="Total Comics" value={comics.length} icon={<BookOpen className="h-5 w-5 text-blue-400" />} />
        <Stat label="Characters" value={characters.length} icon={<UserCheck className="h-5 w-5 text-purple-400" />} />
      </div>

      {/* 💬 Live Comment Monitoring System */}
      <div className="rounded-xl border border-border/40 bg-card/20 p-4">
        <h3 className="mb-4 font-display text-lg font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" /> Live Audience Engagement
        </h3>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">No reviews or comments yet in the vault.</p>
          )}
          
          {comments.map((c) => (
            <div 
              key={c.id} 
              className={`glass flex items-start gap-3 rounded-lg p-3 border border-border/60 transition-all ${
                deletingId === c.id ? "opacity-40 scale-95" : "hover:border-primary/40"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground truncate">{c.name || "Anonymous Reader"}</p>
                  {/* Category badging taaki pata chale comment comic par aaya hai ya character par */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    c.parentType === "character" 
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {c.parentType || "Comic"}
                  </span>
                </div>
                
                <p className="break-words text-sm text-muted-foreground mt-1 whitespace-pre-line leading-relaxed">
                  {c.message}
                </p>
                
                {/* Kis specific comic page ya character pe comment hai uski short ID/Title */}
                <p className="mt-2 text-[11px] text-muted-foreground/60 italic">
                  Location: <span className="text-foreground/70 font-medium">{c.parentId || "Main Hub"}</span>
                </p>
              </div>

              {/* Delete button jo pure control ko aapke hath me deta hai */}
              <button
                type="button"
                onClick={() => remove(c.id)}
                disabled={deletingId === c.id}
                className="rounded-lg border border-border p-2 bg-background/50 hover:border-primary/80 transition-colors group disabled:opacity-50 self-center"
                aria-label="Delete comment"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
    <div className="glass flex flex-col gap-1 rounded-xl p-4 border border-border/50 bg-card/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {icon}
      </div>
      <span className="font-display text-2xl font-bold text-foreground mt-1">{value}</span>
    </div>
  )
}
