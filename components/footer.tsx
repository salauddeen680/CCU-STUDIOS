"use client"

import { useFooter } from "@/lib/data"

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

        {/* --- COLORED SOCIAL MEDIA ICONS SECTION --- */}
        <div className="mt-8 flex justify-center items-center gap-6">
          
          {/* Instagram */}
          <a href="https://www.instagram.com/ccustudios_?igsh=MWJvanlqa29scG1xdw==" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433"/>
                  <stop offset="25%" stopColor="#e6683c"/>
                  <stop offset="50%" stopColor="#dc2743"/>
                  <stop offset="75%" stopColor="#cc2366"/>
                  <stop offset="100%" stopColor="#bc1888"/>
                </linearGradient>
              </defs>
              <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </a>

          {/* YouTube */}
          <a href="https://youtube.com/@ccustudios?si=EO4jVf64pR8v5zJ7" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a href="https://www.facebook.com/share/1BNHLQhByc/" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* TikTok */}
          <a href="https://www.tiktok.com/@ccustudios_?_r=1&_t=ZS-99jI9rncQXi" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
            <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#25F4EE" d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-1.76.19-3.58 1.14-5.11 1.18-1.91 3.32-3.14 5.5-3.26 1.47-.07 2.95.27 4.24.96v4.06c-.85-.48-1.84-.71-2.82-.64-1.27.05-2.52.68-3.26 1.75-.76 1.13-.91 2.64-.4 3.91.51 1.25 1.7 2.19 3.03 2.37 1.34.18 2.73-.25 3.65-1.22.9-.96 1.3-2.29 1.31-3.61.02-4.79-.01-9.58.01-14.37z"/>
              <path fill="#FE2C55" d="M12.025 2.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v2.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-1.76.19-3.58 1.14-5.11 1.18-1.91 3.32-3.14 5.5-3.26 1.47-.07 2.95.27 4.24.96v2.06c-.85-.48-1.84-.71-2.82-.64-1.27.05-2.52.68-3.26 1.75-.76 1.13-.91 2.64-.4 3.91.51 1.25 1.7 2.19 3.03 2.37 1.34.18 2.73-.25 3.65-1.22.9-.96 1.3-2.29 1.31-3.61.02-4.79-.01-9.58.01-14.37z"/>
              <path fill="#ffffff" d="M12.275 1.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v3.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-1.76.19-3.58 1.14-5.11 1.18-1.91 3.32-3.14 5.5-3.26 1.47-.07 2.95.27 4.24.96v3.06c-.85-.48-1.84-.71-2.82-.64-1.27.05-2.52.68-3.26 1.75-.76 1.13-.91 2.64-.4 3.91.51 1.25 1.7 2.19 3.03 2.37 1.34.18 2.73-.25 3.65-1.22.9-.96 1.3-2.29 1.31-3.61.02-4.79-.01-9.58.01-14.37z"/>
            </svg>
          </a>

          {/* X (Twitter) */}
          <a href="https://x.com/ccu_studios" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

        </div>

        <p className="mt-8 text-[11px] text-muted/70">
          {`© ${new Date().getFullYear()} CCU Studios. All rights reserved.`}
        </p>
      </div>
    </footer>
  )
}
