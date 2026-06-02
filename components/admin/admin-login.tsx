"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { ADMIN_EMAIL } from "@/lib/config"
import { Loader2, ShieldAlert } from "lucide-react"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (ADMIN_EMAIL && email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError("This email is not authorized for admin access.")
      return
    }
    setBusy(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (err: any) {
      console.log("[v0] admin login error", err?.code)
      setError("Invalid credentials. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="glass w-full max-w-md rounded-2xl p-8 shadow-glow-red"
        aria-label="Admin login"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <ShieldAlert className="h-8 w-8 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-sm text-muted-foreground">Authorized personnel only.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-xs font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              placeholder="admin@ccustudios.com"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-xs font-medium text-muted-foreground">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-primary">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-red transition hover:brightness-110 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Signing in..." : "Enter Dashboard"}
          </button>
        </div>
      </form>
    </div>
  )
}
