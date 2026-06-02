import { SiteShell } from "@/components/site-shell"
import { ComicDetail } from "@/components/comic-detail"

export default function ComicDetailPage({ params }: { params: { id: string } }) {
  return (
    <SiteShell>
      <ComicDetail id={params.id} />
    </SiteShell>
  )
}
