"use client"

import { useFooter } from "@/lib/data"
import { Instagram, Youtube, Facebook } from "lucide-react"

export function Footer() {
  const { footer } = useFooter()

  return (
    <footer className="mt-16 border-t border-border/70 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center">
        <p className="font-display text-2xl font-bold tracking-widest text-glow text-primary">
          {footer.studio}
        </p>
        <p className="mt-1 font-display text-sm uppercase tracking-[0.3em] text-gold text-glow-gold">
          {footer.universe}
        </p>
        <p className="mx-auto mt-4 max-w-md text-pretty text-xs text-muted">
          {footer.creator}
        </p>

        {/* --- SOCIAL MEDIA ICONS SECTION START --- */}
        <div className="mt-6 flex justify-center gap-6 text-muted">
          <a 
            href="https://www.instagram.com/ccustudios_?igsh=MWJvanlqa29scG1xdw==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a 
            href="https://youtube.com/@ccustudios?si=EO4jVf64pR8v5zJ7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Youtube size={20} />
          </a>
          <a 
            href="https://www.facebook.com/share/1BNHLQhByc/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <Facebook size={20} />
          </a>
          
          {/* 🔥 NEW: TikTok Profile Link with exact outline icon */}
          <a 
            href="https://www.tiktok.com/@ccustudios_?_r=1&_t=ZS-99jI9rncQXi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
          </a>

          {/* 🔥 NEW: X (Twitter) Profile Link */}
          <a 
            href="https://x.com/ccu_studios" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
          </a>
        </div>
        {/* --- SOCIAL MEDIA ICONS SECTION END --- */}

        <p className="mt-6 text-[11px] text-muted/70">
          {`© ${new Date().getFullYear()} CCU Studios. All rights reserved.`}
        </p>
      </div>
    </footer>
  )
}
