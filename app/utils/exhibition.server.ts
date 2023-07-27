import type { Exhibition } from "@prisma/client"

import { createNanoID, createSlug } from "~/utils"

export function createExhibitionSlug(title: Exhibition["title"]) {
  const slug: string = createSlug(title)
  const nanoID: string = createNanoID()

  return `${slug}-${nanoID}`
}
