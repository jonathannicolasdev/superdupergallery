import { createSlug } from "~/utils"

export function createArtworkSlug(title: string, artistName: string) {
  return `${createSlug(title || "Untitled")}-${createSlug(artistName || "Unknown")}`
}
