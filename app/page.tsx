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

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const allComics = await getComicsData()
  
  // 🔍 Server-side check
  const isAndroidApp = searchParams.source === "android_app";

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

      {/* 🚀 100% GLITCH-FREE WEBVIEW DETECTOR */}
      {/* Yeh CSS aur Script page load hone se pehle hi app ko detect karke button chhipa denge */}
      <style dangerouslySetInnerHTML={{__html: `
        html.is-app #app-download-section { display: none !important; }
      `}} />
      <script dangerouslySetInnerHTML={{__html: `
        (function() {
          try {
            var ua = navigator.userAgent || '';
            var isWebView = ua.includes('wv') || (ua.includes('Android') && ua.includes('Version/'));
            var isAppUrl = window.location.search.includes('source=android_app');
            if (isWebView || isAppUrl) {
              document.documentElement.classList.add('is-app');
            }
          } catch(e) {}
        })();
      `}} />

      <Hero />
      <div className="pb-8 bg-black">
        <ComicSlider comics={allComics} />
      </div>

      {/* 📥 PREMIUM DOWNLOAD APP SECTION */}
      {!isAndroidApp && (
        <section id="app-download-section" className="w-full bg-black py-16 border-y border-zinc-900/80 relative overflow-hidden flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-900/20 blur-[120px] pointer-events-none rounded-full"></div>

          <div className="relative z-10 w-full max-w-2xl mx-4 p-8 sm:p-12 rounded-[2rem] bg-zinc-950/60 border border-zinc-800/50 shadow-2xl backdrop-blur-md flex flex-col items-center gap-6 text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-900/50 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-red-400 font-bold">
                Official Android Release
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 tracking-tight">
                Take CCU Studios Anywhere
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto leading-relaxed">
                Experience lightning-fast reading, 1-Tap Google login, and real-time cosmic sync straight from our native Android application.
              </p>
            </div>

            <a
              href="https://drive.google.com/uc?export=download&id=1vcTaUBnEt06x6PorON98KA2NVn0tngff"
              target="_blank"
              rel="noopener noreferrer"
              download="CCU-Studios.apk"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 mt-2 w-full sm:w-auto font-bold text-white transition-all duration-300 rounded-2xl bg-gradient-to-b from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 shadow-[0_0_40px_-10px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.6)] hover:-translate-y-1 ring-1 ring-red-500/50"
            >
              <svg className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-sm sm:text-base tracking-wide drop-shadow-md">Download Android App (APK)</span>
            </a>
          </div>
        </section>
      )}

      {/* 🎬 DYNAMIC SECTION: Cinematic Video Links (Social Media Icons Removed) */}
      <section className="w-full bg-black pb-20 border-t border-zinc-900/50 pt-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-red-900/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-14 relative z-10">
          
          <HomeVideoLinks />

        </div>
      </section>
    </SiteShell>
  )
}
