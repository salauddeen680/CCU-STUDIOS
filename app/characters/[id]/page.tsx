import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { CharacterProfile } from "@/components/character-profile"

type PageProps = {
  params: {
    id: string
  }
}

// 🎯 Dynamic Metadata for Search Engines
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const param = params.id
  const baseUrl = "https://ccu-studios.vercel.app"

  try {
    const res = await fetch(`${baseUrl}/api/characters/${param}`, { next: { revalidate: 60 } })
    const character = await res.json()

    if (!character || !character.name) {
      return {
        title: "Character Profile — CCU Studios",
        alternates: {
          canonical: `${baseUrl}/characters/${param}`,
        },
      }
    }

    const canonicalPath = character.slug ? character.slug : param

    return {
      title: `${character.name} — CCU Studios Lore`,
      description: character.bio || `Official biography and lore profile of ${character.name} in CCU.`,
      alternates: {
        canonical: `${baseUrl}/characters/${canonicalPath}`,
      },
      openGraph: {
        title: `${character.name} — CCU Studios`,
        description: character.bio || `Explore the powers and storyline of ${character.name}.`,
        images: [character.image || `${baseUrl}/ccu-logo.png`],
        type: "profile",
      },
    }
  } catch (error) {
    return {
      title: "Character Profile — CCU Studios",
      description: "Explore legendary character profiles in the Cosmic Cinematic Universe.",
      alternates: {
        canonical: `${baseUrl}/characters/${param}`,
      },
    }
  }
}

export default async function CharacterPage({ params }: PageProps) {
  const param = params.id
  const baseUrl = "https://ccu-studios.vercel.app"
  let characterData = null

  try {
    const res = await fetch(`${baseUrl}/api/characters/${param}`, { next: { revalidate: 60 } })
    characterData = await res.json()
  } catch (e) {
    console.error("Failed to fetch character data for schema", e)
  }

  const activeSlugOrId = characterData?.slug || param

  // 🎭 Schema.org JSON-LD Structured Data
  const jsonLd = characterData && characterData.name ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": characterData.name,
    "description": characterData.bio || "Legendary superhero profile.",
    "image": characterData.image || `${baseUrl}/ccu-logo.png`,
    "url": `${baseUrl}/characters/${activeSlugOrId}`,
  } : null

  return (
    <SiteShell>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CharacterProfile id={param} />
    </SiteShell>
  )
}
