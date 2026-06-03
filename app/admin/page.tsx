"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { Loader2, Lock } from "lucide-react"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth"

// 🔐 Full Firebase Config (Jo Vercel se saari keys uthayega)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      console.error("Firebase Debug:", err)
      // 🚨 ChatGPT wala point: Screen par asli error code dikhega!
      setLoginError(`Firebase Error Code: ${err.code || err.message}`)
    } finally {
      setLoginLoading(false)
    }
  }

  if (access !== ADMIN_ACCESS_KEY) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center bg-black text-white">
        <Lock className="h-10 w-10 text-red-600" />
        <h1 className="text-2xl font-bold tracking-wider">Restricted Zone</h1>
        <p className="max-w-sm text-sm text-zinc-500">Valid access key required.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-2xl font-bold text-red-600">CCU Studios</h1>
            <p className="text-sm text-zinc-500">Control Panel Login</p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none" placeholder="admin@ccustudios.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:border-red-600 focus:outline-none" placeholder="••••••••" />
            </div>
            
            {/* 🚨 Yahan dikhega asli error */}
            {loginError && <p className="text-xs font-mono text-red-500 bg-red-950/30 border border-red-900/50 rounded-lg p-3 text-center">{loginError}</p>}
            
            <button type="submit" disabled={loginLoading} className="w-full rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{loginLoading ? "Verifying..." : "Enter Dashboard"}</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Welcome to CCU Control Center</h1>
      <p className="text-zinc-400">Logged in as: {user.email}</p>
    </div>
  )
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>}><AdminGate /></Suspense>
    </main>
  )
}
