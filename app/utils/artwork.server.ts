import { createSlug } from "~/utils"

export function createArtworkSlug(artwork: { title: string; artistName: string }) {
  const title = createSlug(artwork.title || "Untitled")
  const artistName = createSlug(artwork.artistName || "Unknown")

  return `${title}-${artistName}`
}
