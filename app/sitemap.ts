import { MetadataRoute } from 'next' // 🔥 FIX: Capital 'I' ko small 'i' kiya
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ccu-studios.vercel.app'

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/comics',
    '/characters',
    '/ultimate-comic',
    '/engagement',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  let comicRoutes: MetadataRoute.Sitemap = []
  let characterRoutes: MetadataRoute.Sitemap = []

  try {
    // 2. Database se Comics ke links (Slug preferred, fallback to ID)
    const comicsSnapshot = await getDocs(collection(db, 'comics'))
    if (!comicsSnapshot.empty) {
      comicRoutes = comicsSnapshot.docs.map((doc) => {
        const data = doc.data()
        const routeParam = data.slug || doc.id
        
        // 🔥 FIX: Firebase timestamp ko crash hone se bachane ke liye safe check
        const lastMod = data.updatedAt?.toDate 
          ? data.updatedAt.toDate().toISOString() 
          : data.updatedAt 
            ? new Date(data.updatedAt).toISOString() 
            : new Date().toISOString()

        return {
          url: `${baseUrl}/comics/${routeParam}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.8,
        }
      })
    }
  } catch (error) {
    console.error("Sitemap Comics Fetch Error:", error)
  }

  try {
    // 3. Database se Characters ke links (Slug preferred, fallback to ID)
    const charactersSnapshot = await getDocs(collection(db, 'characters'))
    if (!charactersSnapshot.empty) {
      characterRoutes = charactersSnapshot.docs.map((doc) => {
        const data = doc.data()
        const routeParam = data.slug || doc.id
        
        // 🔥 FIX: Firebase timestamp safety
        const lastMod = data.updatedAt?.toDate 
          ? data.updatedAt.toDate().toISOString() 
          : data.updatedAt 
            ? new Date(data.updatedAt).toISOString() 
            : new Date().toISOString()

        return {
          url: `${baseUrl}/characters/${routeParam}`,
          lastModified: lastMod,
          changeFrequency: 'monthly',
          priority: 0.7,
        }
      })
    }
  } catch (error) {
    console.error("Sitemap Characters Fetch Error:", error)
  }

  return [...staticRoutes, ...comicRoutes, ...characterRoutes]
}
