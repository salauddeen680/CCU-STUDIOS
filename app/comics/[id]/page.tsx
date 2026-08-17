import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { ComicDetail } from "@/components/comic-detail"

type PageProps = {
  params: Promise<{ id: string }> | { id: string }
}

// 🎯 STEP 1: Dynamic Metadata with Clean Slug & Permanent Canonical
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const param = resolvedParams.id
  const baseUrl = "https://ccu-studios.vercel.app"

  try {
    const res = await fetch(`${baseUrl}/api/comics/${param}`, { next: { revalidate: 60 } })
    const comic = await res.json()

    if (!comic || !comic.title) {
      return { 
        title: "Comic | CCU Studios",
        alternates: {
          canonical: `${baseUrl}/comics/${param}`,
        }
      }
    }

    // Faltu auto-ID ke bajaye clean slug / title ko canonical banayega
    const canonicalPath = comic.slug || comic.id || param

    return {
      title: `${comic.title} | CCU Studios`,
      description: `${comic.description || "Read premium manga-style comic chapters."} Created by Salauddin (Saif).`,
      alternates: {
        canonical: `${baseUrl}/comics/${canonicalPath}`,
      },
      openGraph: {
        title: `${comic.title} | CCU Studios`,
        description: comic.description,
        images: [comic.cover || comic.coverImageUrl || "/ccu-logo.png"],
        type: "article",
      },
    }
  } catch (error) {
    return {
      title: "Comic | CCU Studios",
      description: "Read premium cosmic comics on CCU Studios.",
      alternates: {
        canonical: `${baseUrl}/comics/${param}`,
      }
    }
  }
}

export default async function ComicDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const param = resolvedParams.id
  const baseUrl = "https://ccu-studios.vercel.app"
  let comicData = null

  try {
    const res = await fetch(`${baseUrl}/api/comics/${param}`, { next: { revalidate: 60 } })
    comicData = await res.json()
  } catch (e) {
    console.error("Failed to fetch comic data for schema", e)
  }

  const activeSlugOrId = comicData?.slug || comicData?.id || param

  // 🎭 STEP 2: Schema.org Book JSON-LD Structure
  const jsonLd = comicData && comicData.title ? {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": comicData.title,
    "image": comicData.cover || comicData.coverImageUrl || `${baseUrl}/ccu-logo.png`,
    "description": comicData.description || "Premium cosmic comic book.",
    "url": `${baseUrl}/comics/${activeSlugOrId}`,
    "author": {
      "@type": "Person",
      "name": "Salauddin (Saif)"
    }
  } : null

  return (
    <SiteShell>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ComicDetail id={param} />
    </SiteShell>
  )
}
