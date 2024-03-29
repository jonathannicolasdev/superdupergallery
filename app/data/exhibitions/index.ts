import type { Exhibition } from "@prisma/client"

import dataAllExhibitions from "./all-exhibitions.json"

export type DataExhibition = Pick<Exhibition, "edition" | "title" | "isPublished"> & {
  date?: string
  imageURL?: string
}

export const dataExhibitions: DataExhibition[] = dataAllExhibitions
