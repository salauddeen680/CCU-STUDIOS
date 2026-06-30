import { SiteShell } from "@/components/site-shell"
import { CharacterProfile } from "@/components/character-profile"

type PageProps = {
  params: {
    id: string
  }
}

export default function CharacterPage({ params }: PageProps) {
  return (
    <SiteShell>
      <CharacterProfile id={params.id} />
    </SiteShell>
  )
}
