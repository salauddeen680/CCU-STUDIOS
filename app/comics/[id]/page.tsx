import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { ComicDetail } from "@/components/comic-detail"

// 🎯 STEP 1: Google Search ko Comic ka Asli Naam aur Detail dene ke liye Dynamic Metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id

  try {
    // Database se data automatic nikalne ke liye request (Next.js automatically handles fetch caching)
    const res = await fetch(`https://ccu-studios.vercel.app/api/comics/${id}`)
    const comic = await res.json()

    if (!comic || !comic.title) {
      return { title: "Comic — CCU Studios" }
    }

    return {
      title: `${comic.title} — CCU Studios`,
      description: `${comic.description || "Read premium manga-style comic chapters."} Created by Salauddin (Saif).`,
      openGraph: {
        title: `${comic.title} — CCU Studios`,
        description: comic.description,
        images: [comic.coverImageUrl || "/ccu-logo.png"],
        type: "article",
      },
    }
  } catch (error) {
    // Agar koi galti se galat link khole toh build ya page crash na ho
    return {
      title: "Comic — CCU Studios",
      description: "Read premium cosmic comics on CCU Studios.",
    }
  }
}

export default async function ComicDetailPage({ params }: { params: { id: string } }) {
  const id = params.id
  let comicData = null

  // Google Bots ko Comic ka poster aur structural data dene ke liye JSON-LD fetch
  try {
    const res = await fetch(`https://ccu-studios.vercel.app/api/comics/${id}`)
    comicData = await res.json()
  } catch (e) {
    console.error("Failed to fetch comic data for schema", e)
  }

  // 🎭 STEP 2: Marvel jaisa Poster Carousel lane ke liye Invisible Schema Markup
  const jsonLd = comicData && comicData.title ? {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": comicData.title,
    "image": comicData.coverImageUrl || "https://ccu-studios.vercel.app/ccu-logo.png",
    "description": comicData.description || "Premium cosmic comic book.",
    "url": `https://ccu-studios.vercel.app/comics/${id}`,
    "author": {
      "@type": "Person",
      "name": "Salauddin (Saif)"
    }
  } : null

  return (
    <SiteShell>
      {/* Agar data mil gaya toh invisible script Google bots ke liye embed ho jayegi */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ComicDetail id={id} />
    </SiteShell>
  )
}
