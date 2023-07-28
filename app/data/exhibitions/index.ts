import type { Exhibition } from "@prisma/client"

import exhibitionsAll from "./all-exhibitions.json"

export type DataExhibition = Pick<Exhibition, "edition" | "title"> & {
  date?: string
  imageURL?: string
}

export const dataExhibitions: DataExhibition[] = exhibitionsAll
