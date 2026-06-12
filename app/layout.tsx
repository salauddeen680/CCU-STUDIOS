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
    "Enter the Cosmic Cinematic Universe. Read premium comics, explore characters, and dive into an epic original universe by CCU Studios.",
  keywords: ["comics", "characters", "CCU Studios", "cosmic cinematic universe", "manga"],
  authors: [{ name: "Salauddin (Saif)" }],
  openGraph: {
    title: "CCU STUDIOS — Cosmic Cinematic Universe",
    description: "Read premium comics and explore the CCU character universe.",
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
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
