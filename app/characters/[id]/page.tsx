import { SiteShell } from "@/components/site-shell"
import { CharacterProfile } from "@/components/character-profile"

export default function CharacterPage({ params }: { params: { id: string } }) {
  return (
    <SiteShell>
      <CharacterProfile id={params.id} />
    </SiteShell>
  )
}
