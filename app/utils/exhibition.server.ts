import { createSlug } from "~/utils"

export function createExhibitionSlug(
  edition: number | null | undefined,
  title: string | null | undefined,
) {
  return createSlug(`${edition} ${title}`)
}
