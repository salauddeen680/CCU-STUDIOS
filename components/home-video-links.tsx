"use client"

import { useEffect, useState } from "react"
import { Video } from "lucide-react"

interface VideoLink {
  id: string
  title: string
  url: string
  posterUrl?: string
}

// 🪄 JADUU: Ye function tumhare YouTube link se automatically thumbnail nikal lega
const getYouTubeThumbnail = (url: string) => {
  if (!url) return null;
  // YouTube link se video ID nikalne ka formula
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    // YouTube ka default HD thumbnail URL return karega
    return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
  }
  return null;
}

export function HomeVideoLinks() {
  const [links, setLinks] = useState<VideoLink[]>([])

  useEffect(() => {
    fetch("/api/social-links")
      .then((res) => res.json())
      .then((data) => setLinks(data))
      .catch((err) => console.error("Link fetch fail:", err))
  }, [])

  if (links.length === 0) return null

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <Video className="h-5 w-5 text-red-600" />
        <h2 className="text-lg font-bold text-white">Official Videos & Social Updates</h2>
      </div>

      {links.map((link) => {
        // Phele check karega ki YouTube link hai kya? Agar nahi, to purana posterUrl use karega.
        const thumbnailUrl = getYouTubeThumbnail(link.url) || link.posterUrl || "/hero-cosmic.png";

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden hover:border-red-900 transition-colors group"
          >
            <img
              src={thumbnailUrl}
              alt={link.title}
              className="w-full aspect-video object-cover"
              onError={(e) => {
                // Agar kabhi koi image fail ho jaye, toh website kharab na dikhe isliye default image laga dega
                (e.target as HTMLImageElement).src = "/hero-cosmic.png";
              }}
            />
            <div className="p-4 flex flex-col gap-1">
              <h3 className="text-white font-bold text-lg group-hover:text-red-500 transition-colors">
                {link.title}
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                Click to watch on social media 🚀
              </p>
            </div>
          </a>
        )
      })}
    </div>
  )
}
