import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase' // 🔥 IMP: Agar aapke project mein firebase instance ka rasta alag hai toh use badal lena (jaise '@/firebase/config')
import { collection, getDocs } from 'firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ccu-studios.vercel.app'

  // 1. Static Routes (Yeh pages hamesha fix rehte hain)
  const staticRoutes = [
    '',
    '/comics',
    '/characters',
    '/ultimate-comic',
    '/engagement',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }))

  let comicRoutes: any[] = []
  let characterRoutes: any[] = []

  try {
    // 2. Database se saari Comics ke links automatic nikalna
    const comicsSnapshot = await getDocs(collection(db, 'comics'))
    if (!comicsSnapshot.empty) {
      comicRoutes = comicsSnapshot.docs.map((doc) => ({
        url: `${baseUrl}/comics/${doc.id}`, // Agar aap slug use karte hain toh doc.data().slug likhein
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error("Sitemap Comics Fetch Error:", error)
    // Error aane par bhi crash nahi hoga, khali array rahega
  }

  try {
    // 3. Database se saare Characters ke links automatic nikalna
    const charactersSnapshot = await getDocs(collection(db, 'characters'))
    if (!charactersSnapshot.empty) {
      characterRoutes = charactersSnapshot.docs.map((doc) => ({
        url: `${baseUrl}/characters/${doc.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error("Sitemap Characters Fetch Error:", error)
  }

  // Saare static aur dynamic links ko ek sath jod kar return karna
  return [...staticRoutes, ...comicRoutes, ...characterRoutes]
}
