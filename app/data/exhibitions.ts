import type { Exhibition } from "@prisma/client"

export type DataExhibition = Pick<Exhibition, "title"> & {
  date?: Exhibition["date"]
}

export const dataExhibitions: DataExhibition[] = [
  {
    // edition: 45,
    title: "Wound",
    date: new Date("2023-07-15"),
  },
]
