import type { Metadata, Viewport } from "next"
import { Inter, Oswald } from "next/font/google"
import "./globals.css"
import Script from "next/script" // 🔥 Next.js ka optimized script loader use karenge

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
  description: "Enter the Cosmic Cinematic Universe. Read premium comics, explore characters, and dive into an epic original universe by CCU Studios. Created and written by Salauddin.",
  keywords: ["comics", "characters", "CCU Studios", "cosmic cinematic universe", "manga", "Salauddin", "Saif CCU"],
  authors: [{ name: "Salauddin" }, { name: "Salauddin (Saif)" }],
  verification: {
    google: "XXO_Zb9ewdf1cBmv-LqID5RdX-oPzpjuyMZ2ApSUuyM",
  },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const studioSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ccu-studios.vercel.app/#organization",
        "name": "CCU Studios",
        "url": "https://ccu-studios.vercel.app",
        "logo": { "@type": "ImageObject", "url": "https://ccu-studios.vercel.app/ccu-logo.png" },
        "founder": { "@type": "Person", "@id": "https://ccu-studios.vercel.app/#founder" }
      },
      {
        "@type": "Person",
        "@id": "https://ccu-studios.vercel.app/#founder",
        "name": "Salauddin",
        "alternateName": ["Saif", "Salauddin (Saif)", "Salauddin CCU"],
        "jobTitle": "Founder & Head Writer",
        "worksFor": { "@type": "Organization", "@id": "https://ccu-studios.vercel.app/#organization" },
        "description": "Salauddin is the original creator, mastermind, and head writer behind the Cosmic Cinematic Universe (CCU) and CCU Studios platform."
      }
    ]
  }

  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema) }}
        />
        {/* 🔥 Payment Popup ka asli solution: Razorpay SDK */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
