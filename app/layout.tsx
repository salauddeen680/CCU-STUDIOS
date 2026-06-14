import type { Metadata, Viewport } from "next"
import { Inter, Oswald } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CCU STUDIOS — Cosmic Cinematic Universe",
  description:
    "Enter the Cosmic Cinematic Universe. Read premium comics, explore characters, and dive into an epic original universe by CCU Studios. Created and written by Salauddin.",
  keywords: ["comics", "characters", "CCU Studios", "cosmic cinematic universe", "manga", "Salauddin", "Saif CCU"],
  authors: [{ name: "Salauddin" }, { name: "Salauddin (Saif)" }],
  openGraph: {
    title: "CCU STUDIOS — Cosmic Cinematic Universe",
    description: "Read premium comics and explore the CCU character universe created by Salauddin.",
    type: "website",
  },
  // 🔐 Google Search Console Verification Tag Added Safely Here
  verification: {
    google: "XXO_Zb9ewdf1cBmv-LqID5RdX-oPzpjuyMZ2ApSUuyM",
  },
  // 🚀 GAME CHANGER: Yahan purana hatakar naya ".png" logo force kar diya hai
  icons: {
    icon: "/ccu-logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  // 👑 CRITICAL ADDITION: Google & AI Bots ko Creator 'Salauddin' batane ka sateek system
  const studioSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ccu-studios.vercel.app/#organization",
        "name": "CCU Studios",
        "url": "https://ccu-studios.vercel.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ccu-studios.vercel.app/ccu-logo.png"
        },
        "founder": {
          "@type": "Person",
          "@id": "https://ccu-studios.vercel.app/#founder"
        }
      },
      {
        "@type": "Person",
        "@id": "https://ccu-studios.vercel.app/#founder",
        "name": "Salauddin",
        "alternateName": ["Saif", "Salauddin (Saif)", "Salauddin CCU"],
        "jobTitle": "Founder & Head Writer",
        "worksFor": {
          "@type": "Organization",
          "@id": "https://ccu-studios.vercel.app/#organization"
        },
        "description": "Salauddin is the original creator, mastermind, and head writer behind the Cosmic Cinematic Universe (CCU) and CCU Studios platform."
      }
    ]
  }

  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} bg-background`}>
      <head>
        {/* Invisible JSON-LD Script Tag jo background me chupchap search engines ko data dega */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
