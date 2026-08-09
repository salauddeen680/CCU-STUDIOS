import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"
import { CharacterProfile } from "@/components/character-profile"

type PageProps = {
  params: {
    id: string
  }
}

// 🔥 Google Indexing Fix: Yeh har character ke liye asli canonical link generate karega
export function generateMetadata({ params }: PageProps): Metadata {
  return {
    alternates: {
      canonical: `https://ccu-studios.vercel.app/characters/${params.id}`,
    },
  }
}

export default function CharacterPage({ params }: PageProps) {
  return (
    <SiteShell>
      <CharacterProfile id={params.id} />
    </SiteShell>
  )
}
