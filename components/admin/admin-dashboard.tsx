"use client"

import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { BookOpen, Users, Activity, PanelBottom, LogOut, Sparkles } from "lucide-react"
import { ComicsManager } from "./comics-manager"
import { CharactersManager } from "./characters-manager"
import { EngagementPanel } from "./engagement-panel"
import { FooterEditor } from "./footer-editor"

const TABS = [
  { id: "engagement", label: "Live Universe Traffic", icon: Activity },
  { id: "comics", label: "Comics Vault", icon: BookOpen },
  { id: "characters", label: "Legends & Characters", icon: Users },
  { id: "footer", label: "Footer Settings", icon: PanelBottom },
] as const

type TabId = (typeof TABS)[number]["id"]

export function AdminDashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<TabId>("engagement")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* 👑 Top Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="font-display text-2xl font-black tracking-tight text-white flex items-center gap-2">
              CCU <span className="text-red-600">COMMAND CENTER</span>
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 font-mono">
            <Sparkles className="h-3.5 w-3.5 text-zinc-500" /> Authenticated: <span className="text-zinc-300 font-semibold">{email}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => signOut(auth)}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-semibold text-zinc-300 transition-all hover:border-red-600 hover:text-red-500 hover:bg-zinc-900 self-start sm:self-auto"
        >
          <LogOut className="h-4 w-4" /> End Command Session
        </button>
      </div>

      {/* 🧭 Interactive Switcher Navigation Tabs */}
      <div className="flex flex-wrap gap-2.5">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                active
                  ? "bg-red-600 text-white shadow-lg shadow-red-950/50 scale-[1.02]"
                  : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-white" : "text-zinc-500"}`} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* ⚡ Core Dynamic Workspace */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-6 backdrop-blur-md min-h-[600px]">
        {tab === "engagement" && <EngagementPanel />}
        {tab === "comics" && <ComicsManager />}
        {tab === "characters" && <CharactersManager />}
        {tab === "footer" && <FooterEditor />}
      </div>
    </div>
  )
}
