import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import ComicSlider from "@/components/ComicSlider"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

// 🔥 FIX 1: Yeh magic line Next.js ke cache ko poori tarah khatam kar degi.
// Ab jaise hi aap admin se comic daloge, home page par turant bina refresh kiye dikhegi!
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
        // 🔥 FIX 2: Check karo ki data.cover sahi se ja raha hai
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

  return (
    <SiteShell>
      <Hero />
      <div className="pb-12 bg-black">
        {/* Slider ko dynamic data mil raha hai */}
        <ComicSlider comics={allComics} />
      </div>
    </SiteShell>
  )
}
