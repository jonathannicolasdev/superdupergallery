import type { Exhibition } from "@prisma/client"

export type DataExhibition = Pick<Exhibition, "title"> & {
  date?: Exhibition["date"]
}

export const dataExhibitions: DataExhibition[] = [
  {
    title: "Exhibition Super",
    date: new Date("2023-01-01"),
  },
  {
    title: "Exhibition Duper",
    date: new Date("2023-02-02"),
  },
  {
    title: "Exhibition Gallery",
    date: new Date("2023-03-03"),
  },
  {
    title: "Wound",
    date: new Date("2023-07-15"),
  },
]
