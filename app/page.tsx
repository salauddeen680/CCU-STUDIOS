import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import ComicSlider from "@/components/ComicSlider"
import { HomeVideoLinks } from "@/components/home-video-links"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

export const metadata: Metadata = {
  title: "CCU STUDIOS — Cosmic Cinematic Universe",
  description: "Enter the Cosmic Cinematic Universe. Read premium comics, explore characters, and dive into an epic original universe created by Salauddin.",
  authors: [{ name: "Salauddin" }],
  openGraph: {
    title: "CCU STUDIOS — Cosmic Cinematic Universe",
    description: "Read premium comics and explore the CCU character universe created by Salauddin.",
    type: "website",
  },
}

export const revalidate = 0; 
export const dynamic = 'force-dynamic';

interface FirebaseComicData {
  title?: string;
  coverUrl?: string;
  imageUrl?: string;
  image?: string;
  cover?: string;
  thumbnail?: string;
}

async function getComicsData() {
  try {
    const querySnapshot = await getDocs(collection(db, "comics"))
    
    const comics = querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirebaseComicData;
      
      return {
        id: doc.id,
        title: data.title || "Untitled Comic",
        coverUrl: data.coverUrl || data.imageUrl || data.image || data.cover || data.thumbnail || "/hero-cosmic.png",
      }
    })
    
    return comics
  } catch (error) {
    console.error("Firebase comics fetch error:", error)
    return []
  }
}

export default async function HomePage() {
  const allComics = await getComicsData()

  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CCU Studios",
    "url": "https://ccu-studios.vercel.app",
    "author": {
      "@type": "Person",
      "name": "Salauddin",
      "alternateName": ["Saif", "Salauddin (Saif)"],
      "jobTitle": "Founder & Head Writer",
      "description": "Salauddin is the official mastermind, original creator, and head writer of CCU Studios and the Cosmic Cinematic Universe."
    }
  }

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />

      <Hero />
      <div className="pb-8 bg-black">
        <ComicSlider comics={allComics} />
      </div>

      {/* 📥 DOWNLOAD APP SECTION (Google Drive Direct APK Link) */}
      <section className="w-full bg-black py-10 border-t border-zinc-900/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 flex flex-col items-center gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500 bg-red-950/40 border border-red-900/50 px-3 py-1 rounded-full">
            Official Android Release
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Take CCU Studios Anywhere
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
            Experience lightning-fast reading, 1-Tap Google login, and real-time cosmic sync straight from our native Android application.
          </p>
          <a
            href="https://drive.google.com/uc?export=download&id=1vcTaUBnEt06x6PorON98KA2NVn0tngff"
            className="mt-2 inline-flex items-center gap-3 rounded-xl bg-red-600 hover:bg-red-500 px-8 py-3.5 font-display text-sm font-bold text-white shadow-lg shadow-red-900/30 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Android App (APK)
          </a>
        </div>
      </section>

      {/* 🎬 DYNAMIC SECTION: Cinematic Video Links & Social Media */}
      <section className="w-full bg-black pb-20 border-t border-zinc-900/50 pt-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-red-900/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-14 relative z-10">
          
          <HomeVideoLinks />

          {/* 📱 Social Media Icons */}
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-zinc-500 text-xs font-sans font-bold tracking-[0.4em] uppercase">
              Join The Alliance
            </h3>
            <div className="flex items-center gap-10">
              <a href="#" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#E1306C] hover:scale-125 transition-all duration-300 drop-shadow-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#FF0000] hover:scale-125 transition-all duration-300 drop-shadow-lg">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#1877F2] hover:scale-125 transition-all duration-300 drop-shadow-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </section>
    </SiteShell>
  )
}
