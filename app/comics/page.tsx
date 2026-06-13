import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { ComicsList } from "@/components/comics-list"

// 🎯 Metadata: Jo Google Search mein bada Title aur Description dikhayega
export const metadata: Metadata = {
  title: "Comics Library — CCU Studios",
  description: "Browse and read every premium comic chapter in the Cosmic Cinematic Universe (CCU). Created by Salauddin (Saif).",
  openGraph: {
    title: "Comics Library — CCU Studios",
    description: "Browse and read every premium comic chapter in the Cosmic Cinematic Universe (CCU).",
    type: "website",
  },
}

export default function ComicsPage() {
  // 🔥 Google Search Bots ke liye Invisible Schema Markup (JSON-LD)
  // Yeh Google ko batata hai ki yeh ek "Collection Page" hai jahan bohot saari comics hain
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CCU Studios Comics Library",
    "description": "Browse every comic in the Cosmic Cinematic Universe.",
    "url": "https://ccu-studios.vercel.app/comics",
    "author": {
      "@type": "Person",
      "name": "Salauddin (Saif)"
    }
  }

  return (
    <SiteShell>
      {/* Invisible Script tag jo Google ko data dega bina website ka look kharab kiye */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-wide sm:text-3xl">
            <span className="text-glow text-primary">Comics</span> Library
          </h1>
          <p className="mt-1 text-sm text-muted">
            Swipe through full-screen, manga-style chapters.
          </p>
        </header>
        <ComicsList />
      </div>
    </SiteShell>
  )
}
