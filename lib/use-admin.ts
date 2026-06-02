"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "./firebase"
import { ADMIN_EMAIL } from "./config"

export function useAdminSession() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const isAdmin =
    !!user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  return { user, isAdmin, loading }
}
