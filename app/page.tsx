import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import ComicSlider from "@/components/ComicSlider"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

// 🔥 FIX: Interface ko ekdum clear bataya hai taaki TypeScript ka koi error na aaye
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
      // 'as FirebaseComicData' lagane se TypeScript ko gussa nahi aayega
      const data = doc.data() as FirebaseComicData;
      
      return {
        id: doc.id,
        title: data.title || "Untitled Comic",
        // 🌟 Saare possible photo fields ko filter karke nikal rahe hain
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
        <ComicSlider comics={allComics} />
      </div>
    </SiteShell>
  )
}
