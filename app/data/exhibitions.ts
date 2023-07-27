import type { Exhibition } from "@prisma/client"

export type DataExhibition = Pick<Exhibition, "title"> & {
  date?: Exhibition["date"]
}

export const dataExhibitions: DataExhibition[] = [
  {
    title: "Exhibition Super",
  },
  {
    title: "Exhibition Duper",
  },
  {
    title: "Exhibition Gallery",
  },
  {
    title: "Wound",
    date: new Date("15-07-2023"),
  },
]
