import dynamic from "next/dynamic"
import { Header } from "./header"
import { Footer } from "./footer"

// 🛡️ SSR: false is critical for preventing client exception errors on public load
const PageTracker = dynamic(() => import("./PageTracker"), { ssr: false })

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="cosmic-bg flex min-h-screen flex-col">
      <PageTracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
