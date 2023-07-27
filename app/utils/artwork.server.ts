import type { Artwork } from "@prisma/client"

import { createNanoID, createSlug } from "~/utils"

export function createArtworkSlug(title: Artwork["title"]) {
  const slug: string = createSlug(title)
  const nanoID: string = createNanoID()

  return `${slug}-${nanoID}`
}
