import type { Exhibition } from "@prisma/client"

export type DataExhibition = Pick<Exhibition, "title"> & {
  date?: Exhibition["date"]
  imageURL?: string
}

export const dataExhibitions: DataExhibition[] = [
  {
    // edition: 6,
    title: "Sixth",
    date: new Date("2021-01-01"),
    imageURL: "",
  },
  {
    // edition: 43,
    title: "Divine Foolishness",
    date: new Date("2023-06-11"),
    imageURL:
      "https://ucarecdn.com/1e48a0fd-881f-4537-a076-0c37deb9ceda/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    // edition: 44,
    title: "Journey",
    date: new Date("2023-06-11"),
    imageURL:
      "https://ucarecdn.com/b352054e-065c-46c8-9142-53030bb18cb1/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    // edition: 45,
    title: "Wound",
    date: new Date("2023-07-15"),
    imageURL:
      "https://ucarecdn.com/92d40530-041d-4fec-9da5-6e80464e9710/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
]
