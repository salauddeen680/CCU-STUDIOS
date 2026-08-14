import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"], // Admin aur API routes ko block rakhta hai
    },
    sitemap: "https://ccu-studios.vercel.app/sitemap.xml",
  }
}
