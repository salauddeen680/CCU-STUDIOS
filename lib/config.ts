// Admin access gate (query param) + allowed admin email for Firebase Auth.
export const ADMIN_ACCESS_KEY = "ccu-admin-2026"

// Only this email is permitted into the admin dashboard.
// Update to your real admin email; you can also set NEXT_PUBLIC_ADMIN_EMAIL.
export const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@ccustudios.com"

export const DEFAULT_FOOTER = {
  studio: "CCU STUDIOS",
  universe: "Cosmic Cinematic Universe",
  creator: "Chief Storywriter & Creator: Salauddin (Saif)",
}

// Basic anti-spam word filter for comments.
export const BANNED_WORDS = [
  "http://",
  "https://",
  "www.",
  "casino",
  "viagra",
  "porn",
  "free money",
]

export function isSpam(message: string): boolean {
  const lower = message.toLowerCase()
  if (message.length > 600) return true
  return BANNED_WORDS.some((w) => lower.includes(w))
}
