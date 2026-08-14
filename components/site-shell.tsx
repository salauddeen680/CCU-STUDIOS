import { Header } from "./header"
import { Footer } from "./footer"
import PageTracker from "./PageTracker"

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="cosmic-bg flex min-h-screen flex-col">
      {/* 📡 Background Traffic & Analytics Engine */}
      <PageTracker />
      
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
