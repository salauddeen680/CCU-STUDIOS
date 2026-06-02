import { Header } from "./header"
import { Footer } from "./footer"

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="cosmic-bg flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
