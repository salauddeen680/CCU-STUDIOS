"use client"

import { useEffect, useState } from "react"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  onSnapshot as onDocSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  increment,
  setDoc,
  getDoc,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Comic, Character, Comment, FooterConfig } from "./types"
import { DEFAULT_FOOTER } from "./config"

/* ------------------------------------------------------------------ */
/* Realtime collection hooks                                           */
/* ------------------------------------------------------------------ */

export function useComics() {
  const [comics, setComics] = useState<Comic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "comics"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(
      q,
      (snap) => {
        try {
          const list = snap.docs.map((d) => {
            const data = d.data() || {}
            const safeImages = Array.isArray(data.images) ? data.images : []
            
            let assignedTimeline = data.timeline || "asli"
            if (!data.timeline && data.ultimate) {
              assignedTimeline = "purani"
            }
            
            return { 
              id: d.id, 
              slug: data.slug || "",
              title: data.title || "Untitled Comic",
              description: data.description || "",
              cover: data.cover || "",
              images: safeImages,
              likes: typeof data.likes === "number" ? data.likes : 0,
              timeline: assignedTimeline,
              ultimate: !!data.ultimate,
              createdAt: data.createdAt || Date.now()
            }
          }) as Comic[]
          setComics(list)
        } catch (err) {
          console.error("Error mapping comics collection snapshot:", err)
          setComics([])
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error("Firestore useComics query error:", error)
        setComics([])
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  return { comics: comics || [], loading }
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "characters"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(
      q,
      (snap) => {
        try {
          const list = snap.docs.map((d) => {
            const data = d.data() || {}
            return { 
              id: d.id, 
              slug: data.slug || "",
              name: data.name || "Unknown Character",
              bio: data.bio || "",
              image: data.image || "",
              gallery: Array.isArray(data.gallery) ? data.gallery : [],
              powers: Array.isArray(data.powers) ? data.powers : [],
              arcs: Array.isArray(data.arcs) ? data.arcs : [],
              likes: typeof data.likes === "number" ? data.likes : 0,
              createdAt: data.createdAt || Date.now()
            }
          }) as Character[]
          setCharacters(list)
        } catch (err) {
          console.error("Error mapping characters snapshot:", err)
          setCharacters([])
        } finally {
          setLoading(false)
        }
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [])

  return { characters: characters || [], loading }
}

export function useComic(idOrSlug: string) {
  const [comic, setComic] = useState<Comic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!idOrSlug) return
    setLoading(true)

    const slugQuery = query(collection(db, "comics"), where("slug", "==", idOrSlug))
    
    const unsubSlug = onSnapshot(slugQuery, (snapshot) => {
      if (!snapshot.empty) {
        const d = snapshot.docs[0]
        const data = d.data() || {}
        const safeImages = Array.isArray(data.images) ? data.images : []
        setComic({
          id: d.id,
          slug: data.slug || "",
          title: data.title || "Untitled Comic",
          description: data.description || "",
          cover: data.cover || "",
          images: safeImages,
          likes: data.likes || 0,
          timeline: data.timeline || "asli",
          ultimate: !!data.ultimate,
          createdAt: data.createdAt || Date.now()
        } as Comic)
        setLoading(false)
      } else {
        const docRef = doc(db, "comics", idOrSlug)
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() || {}
            setComic({
              id: docSnap.id,
              slug: data.slug || "",
              title: data.title || "Untitled Comic",
              description: data.description || "",
              cover: data.cover || "",
              images: Array.isArray(data.images) ? data.images : [],
              likes: data.likes || 0,
              timeline: data.timeline || "asli",
              ultimate: !!data.ultimate,
              createdAt: data.createdAt || Date.now()
            } as Comic)
          } else {
            setComic(null)
          }
        }).catch(err => console.error("Backup fetch crash:", err))
        .finally(() => setLoading(false))
      }
    })

    return () => unsubSlug()
  }, [idOrSlug])

  return { comic, loading }
}

export function useCharacter(idOrSlug: string) {
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!idOrSlug) return
    setLoading(true)

    const slugQuery = query(collection(db, "characters"), where("slug", "==", idOrSlug))
    
    const unsubSlug = onSnapshot(slugQuery, (snapshot) => {
      if (!snapshot.empty) {
        const d = snapshot.docs[0]
        const data = d.data() || {}
        setCharacter({
          id: d.id,
          slug: data.slug || "",
          name: data.name || "",
          bio: data.bio || "",
          image: data.image || "",
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
          powers: Array.isArray(data.powers) ? data.powers : [],
          arcs: Array.isArray(data.arcs) ? data.arcs : [],
          likes: data.likes || 0,
          createdAt: data.createdAt || Date.now()
          } as Character)
        setLoading(false)
      } else {
        const docRef = doc(db, "characters", idOrSlug)
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() || {}
            setCharacter({
              id: docSnap.id,
              slug: data.slug || "",
              name: data.name || "",
              bio: data.bio || "",
              image: data.image || "",
              gallery: Array.isArray(data.gallery) ? data.gallery : [],
              powers: Array.isArray(data.powers) ? data.powers : [],
              arcs: Array.isArray(data.arcs) ? data.arcs : [],
              likes: data.likes || 0,
              createdAt: data.createdAt || Date.now()
            } as Character)
          } else {
            setCharacter(null)
          }
        }).catch(err => console.error(err))
        .finally(() => setLoading(false))
      }
    })

    return () => unsubSlug()
  }, [idOrSlug])

  return { character, loading }
}

export function useComments(parentId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!parentId) return
    const q = query(
      collection(db, "comments"),
      where("parentId", "==", parentId)
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        try {
          const list = snap.docs.map((d) => {
            const data = d.data() || {}
            return { id: d.id, ...data } as Comment
          })
          list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
          setComments(list)
        } catch (err) {
          console.error(err)
          setComments([])
        } finally {
          setLoading(false)
        }
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [parentId])

  return { comments: comments || [], loading }
}

export function useFooter() {
  const [footer, setFooter] = useState<FooterConfig>(DEFAULT_FOOTER)

  useEffect(() => {
    const unsub = onDocSnapshot(doc(db, "settings", "footer"), (snap) => {
      if (snap.exists()) setFooter({ ...DEFAULT_FOOTER, ...(snap.data() as FooterConfig) })
    })
    return () => unsub()
  }, [])

  return { footer }
}

export function useAllComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(
      q,
      (snap) => {
        try {
          setComments(snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }) as Comment))
        } catch (err) {
          console.error(err)
          setComments([])
        } finally {
          setLoading(false)
        }
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [])

  return { comments: comments || [], loading }
}

export async function likeComic(id: string) {
  await updateDoc(doc(db, "comics", id), { likes: increment(1) })
}

export async function likeCharacter(id: string) {
  await updateDoc(doc(db, "characters", id), { likes: increment(1) })
}

export async function createComic(data: Omit<Comic, "id" | "likes" | "createdAt">) {
  return addDoc(collection(db, "comics"), {
    ...data,
    slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    likes: 0,
    createdAt: Date.now(),
  })
}

export async function updateComic(id: string, data: Partial<Comic>) {
  await updateDoc(doc(db, "comics", id), data)
}

export async function deleteComic(id: string) {
  await deleteDoc(doc(db, "comics", id))
}

export async function createCharacter(data: Omit<Character, "id" | "likes" | "createdAt">) {
  return addDoc(collection(db, "characters"), {
    ...data,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    likes: 0,
    createdAt: Date.now(),
  })
}

export async function updateCharacter(id: string, data: Partial<Character>) {
  await updateDoc(doc(db, "characters", id), data)
}

export async function deleteCharacter(id: string) {
  await deleteDoc(doc(db, "characters", id))
}

export async function addComment(data: Omit<Comment, "id" | "createdAt">) {
  return addDoc(collection(db, "comments"), {
    ...data,
    createdAt: Date.now(),
  })
}

export async function deleteComment(id: string) {
  await deleteDoc(doc(db, "comments", id))
}

export async function saveFooter(data: FooterConfig) {
  await setDoc(doc(db, "settings", "footer"), data)
}

export { serverTimestamp, getDoc }
