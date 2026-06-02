export type Comic = {
  id: string
  title: string
  description: string
  cover?: string
  images: string[]
  likes: number
  ultimate?: boolean
  createdAt?: number
}

export type Character = {
  id: string
  name: string
  bio: string
  image: string
  gallery?: string[]
  powers: string[]
  arcs?: string[]
  likes: number
  createdAt?: number
}

export type Comment = {
  id: string
  parentId: string
  parentType: "comic" | "character"
  name: string
  message: string
  createdAt?: number
}

export type FooterConfig = {
  studio: string
  universe: string
  creator: string
}

export type VaultItem =
  | (Comic & { kind: "comic" })
  | (Character & { kind: "character" })
