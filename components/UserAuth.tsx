"use client"

import { auth, googleProvider, db } from "@/lib/firebase"
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { useEffect, useState } from "react"

export function UserAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // 🔐 Google Popup Login & Database Save Function
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const loggedInUser = result.user

      // 🔥 Firestore mein check karo ki user pehle se hai ya naya hai
      const userRef = doc(db, "users", loggedInUser.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        // Naya user hai toh database mein profile bana do
        await setDoc(userRef, {
          uid: loggedInUser.uid,
          name: loggedInUser.displayName,
          email: loggedInUser.email,
          photoURL: loggedInUser.photoURL,
          isPremiumUser: false, // Shuruat mein premium nahi hoga
          purchasedComics: [],  // Khareedi hui comics ki list
          createdAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error)
    }
  }

  // 🔓 Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout Error:", error)
    }
  }

  if (loading) {
    return <div className="text-zinc-500 text-sm animate-pulse">Loading...</div>
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 p-1.5 pr-4 rounded-full">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-8 h-8 rounded-full border border-zinc-700"
            />
          )}
          <div className="flex flex-col text-left">
            <span className="text-xs text-zinc-400 font-sans font-medium">CCU Fan</span>
            <span className="text-sm text-white font-sans max-w-[100px] truncate">
              {user.displayName?.split(" ")[0]}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs bg-zinc-800 hover:bg-red-900/40 hover:text-red-400 text-zinc-300 px-2.5 py-1 rounded-full transition-all ml-2"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 bg-white text-black font-sans font-bold text-sm px-4 py-2 rounded-full hover:bg-zinc-200 active:scale-95 transition-all shadow-md"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign In
        </button>
      )}
    </div>
  )
}
