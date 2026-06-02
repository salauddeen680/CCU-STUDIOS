"use client"

import { useFooter } from "@/lib/data"

export function Footer() {
  const footer = useFooter()

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
        <p className="mt-6 text-[11px] text-muted/70">
          {`© ${new Date().getFullYear()} CCU Studios. All rights reserved.`}
        </p>
      </div>
    </footer>
  )
}
