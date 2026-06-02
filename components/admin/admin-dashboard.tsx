"use client"

import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { BookOpen, Users, Activity, PanelBottom, LogOut } from "lucide-react"
import { ComicsManager } from "./comics-manager"
import { CharactersManager } from "./characters-manager"
import { EngagementPanel } from "./engagement-panel"
import { FooterEditor } from "./footer-editor"

const TABS = [
  { id: "comics", label: "Comics", icon: BookOpen },
  { id: "characters", label: "Characters", icon: Users },
  { id: "engagement", label: "Engagement", icon: Activity },
  { id: "footer", label: "Footer", icon: PanelBottom },
] as const

type TabId = (typeof TABS)[number]["id"]

export function AdminDashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<TabId>("comics")

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            CCU <span className="text-primary text-glow-red">Control Center</span>
          </h1>
          <p className="text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition hover:border-primary"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-glow-red"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          )
        })}
      </div>

      <div>
        {tab === "comics" && <ComicsManager />}
        {tab === "characters" && <CharactersManager />}
        {tab === "engagement" && <EngagementPanel />}
        {tab === "footer" && <FooterEditor />}
      </div>
    </div>
  )
}
