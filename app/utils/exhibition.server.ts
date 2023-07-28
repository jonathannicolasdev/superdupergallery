import { createSlug } from "~/utils"
import type { DataExhibition } from "~/data"

export function createExhibitionSlug(exhibition: DataExhibition) {
  return `${createSlug(exhibition.title)}`
}
