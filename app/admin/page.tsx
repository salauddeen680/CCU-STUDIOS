"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Loader2, Lock } from "lucide-react"
import { useAdminSession } from "@/lib/use-admin"
import { ADMIN_ACCESS_KEY, ADMIN_EMAIL } from "@/lib/config"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

function AdminGate() {
  const params = useSearchParams()
  const access = params.get("access")
  const { user, loading } = useAdminSession()

  if (access !== ADMIN_ACCESS_KEY) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <Lock className="h-10 w-10 text-primary" />
        <h1 className="font-display text-2xl font-bold text-foreground">Restricted Zone</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          You need a valid access key to reach the control center.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const isAdmin = user && (!ADMIN_EMAIL || user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())

  if (!isAdmin) return <AdminLogin />

  return <AdminDashboard email={user!.email || ""} />
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <AdminGate />
      </Suspense>
    </main>
  )
}
