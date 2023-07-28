import { createSlug } from "~/utils"
import type { DataArtwork } from "~/data"

export function createArtworkSlug(artwork: DataArtwork) {
  const title = createSlug(artwork.title || "Untitled")
  const artistName = createSlug(artwork.artistName || "Unknown")

  return `${title}-${artistName}`
}
