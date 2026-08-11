import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"

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

        {/* 🔥 Yahan se aapka naya Chapter-wise Grid shuru hota hai */}
        
        {/* CCU - Genesis of Destruction Section */}
        <div className="mb-10 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">CCU - Genesis of Destruction</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* Chapter #1 - Released */}
            <div className="relative rounded-lg overflow-hidden bg-[#111] border border-gray-800">
              <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded">
                RELEASED
              </div>
              <img 
                src="/genesis-issue-1.jpg" 
                alt="Genesis of Destruction Issue 1" 
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="p-3">
                <p className="text-yellow-400 text-sm font-bold mb-1">
                  #1 <span className="text-gray-400 text-[10px] ml-1">Preview Available</span>
                </p>
                <h3 className="text-white font-bold text-sm uppercase truncate">Genesis of Destruction</h3>
                <p className="text-gray-500 text-xs mt-1">May, 2026</p>
              </div>
            </div>

            {/* Chapter #2 - Upcoming */}
            <div className="relative rounded-lg overflow-hidden bg-[#111] border border-gray-800">
              <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded">
                UPCOMING
              </div>
              <img 
                src="/genesis-issue-2.jpg" 
                alt="Genesis of Destruction Issue 2" 
                className="w-full aspect-[2/3] object-cover opacity-75"
              />
              <div className="p-3">
                <p className="text-yellow-400 text-sm font-bold mb-1">
                  #2 <span className="text-gray-400 text-[10px] ml-1">Preview Available</span>
                </p>
                <h3 className="text-white font-bold text-sm uppercase truncate">Genesis of Destruction</h3>
                <p className="text-gray-500 text-xs mt-1">Coming Soon</p>
              </div>
            </div>

          </div>
        </div>

        {/* TRIVEXA Section */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">TRIVEXA</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* TRIVEXA - Released */}
            <div className="relative rounded-lg overflow-hidden bg-[#111] border border-gray-800">
              <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded">
                RELEASED
              </div>
              <img 
                src="/trivexa-issue-1.jpg" 
                alt="TRIVEXA Issue 1" 
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="p-3">
                <p className="text-yellow-400 text-sm font-bold mb-1">
                  #1 <span className="text-gray-400 text-[10px] ml-1">Preview Available</span>
                </p>
                <h3 className="text-white font-bold text-sm uppercase truncate">Trivexa</h3>
                <p className="text-gray-500 text-xs mt-1">July, 2026</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </SiteShell>
  )
}
