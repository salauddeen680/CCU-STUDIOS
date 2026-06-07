import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import ComicSlider from "@/components/ComicSlider"
import { db } from "@/lib/firebase" // 🔥 Firebase instance ka path check kar lena
import { collection, getDocs } from "firebase/firestore"

// Database se sirf comics ka data lekar aane ka function
async function getComicsData() {
  try {
    const querySnapshot = await getDocs(collection(db, "comics"))
    const comics = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title || "Untitled Comic",
      coverUrl: doc.data().coverUrl || doc.data().imageUrl || "/hero-cosmic.png",
    }))
    return comics
  } catch (error) {
    console.error("Firebase comics fetch error:", error)
    return []
  }
}

export default async function HomePage() {
  // Dynamic comics load karna
  const allComics = await getComicsData()

  return (
    <SiteShell>
      {/* Upar aapka mast banner dikhega */}
      <Hero />
      
      {/* 🔥 Niche ab characters nahi dikhenge, khali left-right scroll hone waali comics aayengi */}
      <div className="pb-12 bg-black">
        <ComicSlider comics={allComics} />
      </div>
    </SiteShell>
  )
}
