import { SiteShell } from "@/components/site-shell"
import { Hero } from "@/components/hero"
import { VaultGrid } from "@/components/vault-grid"

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <VaultGrid />
    </SiteShell>
  )
}
