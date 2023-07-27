import type { Artist } from "@prisma/client"

import { createSlug } from "~/utils"

export function createArtistSlug(name: Artist["name"]) {
  const slug: string = createSlug(name)

  return `${slug}`
}
