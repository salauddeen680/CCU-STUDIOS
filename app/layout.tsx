import type { Metadata, Viewport } from "next"
import { Inter, Oswald } from "next/font/google"
import "./globals.css"
import Script from "next/script" // 🔥 Next.js ka optimized script loader
import { Analytics } from "@vercel/analytics/react" // 🔥 Vercel Analytics Import Kiya
import PageTracker from "@/components/PageTracker" // 🔥 Apna Naya Custom Tracker Import Kiya

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
  metadataBase: new URL("https://ccu-studios.vercel.app"),
  title: {
    default: "CCU STUDIOS | Cosmic Cinematic Universe",
    template: "%s | CCU Studios",
  },
  description: "Enter the Cosmic Cinematic Universe. Read premium comics, explore characters, and dive into an epic original universe by CCU Studios. Created and written by Salauddin.",
  keywords: ["comics", "characters", "CCU Studios", "cosmic cinematic universe", "manga", "Salauddin", "Saif CCU"],
  authors: [{ name: "Salauddin" }, { name: "Salauddin (Saif)" }],
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ccu-studios.vercel.app",
    siteName: "CCU Studios",
    title: "CCU STUDIOS | Cosmic Cinematic Universe",
    description: "Enter the Cosmic Cinematic Universe. Read premium comics, explore characters, and dive into an epic original universe by CCU Studios. Created and written by Salauddin.",
    images: [
      {
        url: "/ccu-logo.png",
        width: 1200,
        height: 630,
        alt: "CCU Studios Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CCU STUDIOS | Cosmic Cinematic Universe",
    description: "Enter the Cosmic Cinematic Universe. Read premium comics, explore characters, and dive into an epic original universe by CCU Studios. Created and written by Salauddin.",
    images: ["/ccu-logo.png"],
  },
  verification: {
    google: "XXO_Zb9ewdf1cBmv-LqID5RdX-oPzpjuyMZ2ApSUuyM",
  },
  icons: {
    icon: "/ccu-logo.png",
  },
  manifest: "/manifest.json", // <--- 🔥 YAHAN APP BANANE WALI LINE ADD HO GAYI HAI
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
        <PageTracker /> {/* 🔥 Firebase Tracker yahan laga diya */}
        {children}
        <Analytics /> {/* 🔥 Vercel Analytics Component */}
        
        {/* 🔥 PWABuilder Service Worker Fix: Yeh script app ko offline support degi */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
