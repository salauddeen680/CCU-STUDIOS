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
        setComics(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Comic[]
        )
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [])

  return { comics, loading }
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "characters"), orderBy("createdAt", "desc"))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setCharacters(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Character[]
        )
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [])

  return { characters, loading }
}

export function useComic(id: string) {
  const [comic, setComic] = useState<Comic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const unsub = onDocSnapshot(doc(db, "comics", id), (snap) => {
      setComic(snap.exists() ? ({ id: snap.id, ...snap.data() } as Comic) : null)
      setLoading(false)
    })
    return () => unsub()
  }, [id])

  return { comic, loading }
}

export function useCharacter(id: string) {
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const unsub = onDocSnapshot(doc(db, "characters", id), (snap) => {
      setCharacter(
        snap.exists() ? ({ id: snap.id, ...snap.data() } as Character) : null
      )
      setLoading(false)
    })
    return () => unsub()
  }, [id])

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
        const list = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Comment
        )
        list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        setComments(list)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [parentId])

  return { comments, loading }
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
        setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Comment))
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [])

  return { comments, loading }
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

export async function likeComic(id: string) {
  await updateDoc(doc(db, "comics", id), { likes: increment(1) })
}

export async function likeCharacter(id: string) {
  await updateDoc(doc(db, "characters", id), { likes: increment(1) })
}

export async function createComic(data: Omit<Comic, "id" | "likes" | "createdAt">) {
  return addDoc(collection(db, "comics"), {
    ...data,
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

// touch helper to keep imports used
export { serverTimestamp, getDoc }
