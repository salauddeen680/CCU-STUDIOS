"use client"

import { useEffect, useState } from "react"
import { db, storage } from "@/lib/firebase"
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

type Item = {
  id: string
  title: string
  type: "comic" | "character"
  image: string
  likes: number
}

export default function Page() {
  const [items, setItems] = useState<Item[]>([])
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState("")

  /* =========================
     REALTIME LOAD FROM FIREBASE
  ========================= */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "ccu"), (snap) => {
      setItems(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Item[]
      )
    })

    return () => unsub()
  }, [])

  /* =========================
     LOGIN
  ========================= */
  const login = () => {
    if (pass === "ccu123") setAuth(true)
    else alert("Wrong Password")
  }

  /* =========================
     ADD ITEM
  ========================= */
  const addItem = async (type: "comic" | "character") => {
    await addDoc(collection(db, "ccu"), {
      title: type === "comic" ? "New Comic" : "New Character",
      type,
      image: "https://picsum.photos/400/250",
      likes: 0,
    })
  }

  /* =========================
     LIKE SYSTEM
  ========================= */
  const likeItem = async (id: string, likes: number) => {
    await updateDoc(doc(db, "ccu", id), {
      likes: likes + 1,
    })
  }

  return (
    <main className="bg-black text-white min-h-screen p-3">

      {/* HEADER */}
      <h1 className="text-red-500 text-2xl font-bold">
        CCU STUDIOS
      </h1>

      <p className="text-xs text-zinc-400">
        Cosmic Cinematic Universe
      </p>

      {/* ADMIN LOGIN */}
      {!auth ? (
        <div className="mt-4 bg-zinc-900 p-3 rounded">

          <input
            type="password"
            className="p-2 text-black w-full"
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            onClick={login}
            className="bg-red-600 w-full mt-2 p-2"
          >
            Admin Login
          </button>

        </div>
      ) : (
        <div className="space-y-2 mt-4">

          <button
            onClick={() => addItem("comic")}
            className="bg-zinc-800 w-full p-2"
          >
            ➕ Add Comic
          </button>

          <button
            onClick={() => addItem("character")}
            className="bg-zinc-800 w-full p-2"
          >
            ➕ Add Character
          </button>

        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 gap-3 mt-5">

        {items.map((item) => (
          <div key={item.id} className="bg-zinc-900 rounded overflow-hidden">

            <img
              src={item.image}
              className="h-36 w-full object-cover"
            />

            <div className="p-2">

              <h2 className="text-sm font-bold">{item.title}</h2>

              <p className="text-xs text-zinc-400">{item.type}</p>

              <button
                className="text-red-400 text-xs"
                onClick={() => likeItem(item.id, item.likes)}
              >
                ❤️ {item.likes}
              </button>

            </div>

          </div>
        ))}

      </div>

    </main>
  )
}
