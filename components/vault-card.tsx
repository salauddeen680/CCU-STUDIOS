"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { User } from "lucide-react" // BookOpen hata diya kyunki ab uski zaroorat nahi
import type { VaultItem } from "@/lib/types"

export function VaultCard({ item, index = 0 }: { item: VaultItem; index?: number }) {
  const isComic = item.kind === "comic"
  
  // 👑 CRITICAL FIX: URL ko ID ke bajaye aapke naye slug par route kiya hai
  const comicRoute = item.slug ? `/comics/${item.slug}` : `/comics/${item.id}`
  const characterRoute = item.slug ? `/characters/${item.slug}` : `/characters/${item.id}`
  
  const href = isComic ? comicRoute : characterRoute
  const title = isComic ? item.title : item.name
  const image = isComic ? item.cover || item.images?.[0] : item.image
  const desc = isComic ? item.description : item.bio

  // 🔥 Aapke panel ("Content Access") ka automatic logic
  const getAccessText = () => {
    // Agar database mein 'contentAccess' value match hoti hai:
    if (item.contentAccess === "9 Pages Free (Paid)") return "Preview Available"
    if (item.contentAccess === "Full Paid (0 Pages Free)") return "🔒 PAID"
    return "Free Full Comic" // Default (Free to Read ke liye)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        href={href}
        // Background ko dark black (#111) kiya gaya hai IC Studio jaisa
        className="hover-glow group block overflow-hidden rounded-lg border border-zinc-800 bg-[#111] transition-all"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image || "/placeholder.svg?height=400&width=300&query=cinematic%20comic%20cover"}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-90" />
          
          {/* 🚨 YAHAN SE PURANA LAAL BADGE HATA DIYA GAYA HAI! */}
          
          {/* Characters ke liye purana chhota badge chhod diya hai taaki wo kharab na hon */}
          {!isComic && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
              <User className="h-3 w-3 text-gold" /> Character
            </span>
          )}
        </div>
        
        {/* 📋 CARD DETAILED BLOCK - EXACT IC STUDIO LOOK */}
        <div className="p-3">
          {isComic ? (
            <>
              {/* IC Studio Style: Yellow Number + Gray Access Text */}
              <p className="text-yellow-400 text-sm font-extrabold mb-1 flex items-center">
                {/* Agar panel mein chapter no. hai toh dikhega, warna blank rahega */}
                {item.chapter ? `#${item.chapter}` : ""} 
                <span className={`text-[10px] ml-1 uppercase font-bold tracking-wider ${
                  item.contentAccess === "Full Paid (0 Pages Free)" ? "text-red-400" : "text-gray-400"
                }`}>
                  {getAccessText()}
                </span>
              </p>
              
              {/* Bold White Uppercase Title */}
              <h3 className="text-white font-bold text-sm uppercase truncate">{title}</h3>
              
              {/* Bottom detail text */}
              <p className="text-gray-500 text-xs mt-1">
                {item.releaseDate ? item.releaseDate : `${item.images?.length || 0} Pages`}
              </p>
            </>
          ) : (
            <>
              {/* Character Info Style */}
              <h3 className="line-clamp-1 font-display text-sm font-semibold text-white uppercase">{title}</h3>
              <p className="line-clamp-2 text-xs text-zinc-500 mt-1">{desc}</p>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
