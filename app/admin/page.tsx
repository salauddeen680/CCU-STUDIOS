"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { Loader2, Lock } from "lucide-react"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth"

// 🔐 Firebase Configuration (Jo Vercel ke variables automatic read karega)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
}

// Firebase Initialize check ke sath
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

// URL Secret Key constant
const ADMIN_ACCESS_KEY = "ccu-admin-2026"

function AdminGate() {
  const params = useSearchParams()
  const access = params.get("access")
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  // Firebase Session Monitor
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Asli Firebase Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setLoginError("Invalid credentials. Please try again.")
    } finally {
      setLoginLoading(false)
    }
  }

  // 1. Secret URL check
  if (access !== ADMIN_ACCESS_KEY) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center bg-black text-white">
        <Lock className="h-10 w-10 text-red-600" />
        <h1 className="text-2xl font-bold tracking-wider">Restricted Zone</h1>
        <p className="max-w-sm text-sm text-zinc-500">
          You need a valid access key to reach the control center.
        </p>
      </div>
    )
  }

  // 2. Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  // 3. Agar User Login nahi hai -> Cinematic Login Form dikhao
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 font-sans">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl transition-all duration-300 hover:border-red-900/40">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-wider text-red-600">CCU Studios</h1>
            <p className="text-sm text-zinc-500">Admin Access Panel</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="admin@ccustudios.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="••••••••"
              />
            </div>

            {loginError && <p className="text-sm font-medium text-red-500 text-center">{loginError}</p>}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-lg bg-red-600 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50"
            >
              {loginLoading ? "Verifying Access..." : "Enter Dashboard"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 4. Sahi Login hone par direct Dashboard show karo
  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Welcome to CCU Control Center</h1>
      <p className="text-zinc-400">Logged in as: {user.email}</p>
      <div className="mt-8 p-6 border border-zinc-800 rounded-xl bg-zinc-900/40">
        <p className="text-sm text-zinc-500">Database connection: Active (Firebase Auth Online)</p>
        {/* Yahan aapka purana dashboard content automatic link ho jayega */}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-black">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        }
      >
        <AdminGate />
      </Suspense>
    </main>
  )
}
