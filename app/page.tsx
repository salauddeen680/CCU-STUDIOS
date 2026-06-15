import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import ComicSlider from "@/components/ComicSlider"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

// 👑 CRITICAL TITLE FIX: Yeh dabba browser ke tab se 'vercel' ko dhakka maar kar 'CCU STUDIOS' likh dega
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

// 🔥 FIX 1: Next.js cache bypass system
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
        // 🔥 FIX 2: Dynamic Image URL fallback logic
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

  // 👑 CREATOR IDENTITY MARKUP: Google/AI search engines ko direct owner ka naam 'Salauddin' batane ke liye
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
      {/* Invisible Script Tag jo Google aur AI Models ko data supply karega background me */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />

      <Hero />
      <div className="pb-12 bg-black">
        {/* Slider ko dynamic data mil raha hai */}
        <ComicSlider comics={allComics} />
      </div>
    </SiteShell>
  )
}
