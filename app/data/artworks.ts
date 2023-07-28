import type { Artwork } from "@prisma/client"

export type DataArtwork = Pick<Artwork, "title" | "medium" | "size"> &
  Partial<Artwork> & {
    isSold?: boolean
    artistName?: string
    exhibitionName?: string
    imageURL?: string
  }

export const dataArtworksName: DataArtwork[] = [
  {
    exhibitionName: "",
    artistName: "",
    title: "",
    medium: "",
    size: "",
    year: 2021,
    price: 100,
    imageURL: "",
  },
]

export const dataArtworksLikeCandy: DataArtwork[] = [
  {
    exhibitionName: "Like Candy",
    artistName: "Viktor Tejada",
    title: "Weekend Girl",
    medium: "Acrylic On Canvas",
    size: "36x26 Inches",
    year: 2021,
    price: 20000,
    imageURL:
      "https://ucarecdn.com/bf0d1141-a35b-4358-8532-68d567d5aff1/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    exhibitionName: "Like Candy",
    artistName: "Viktor Tejada",
    title: "6000 Freedoms Per Minute",
    medium: "Oil On Canvas",
    size: "24x 18 Inches",
    year: 2021,
    price: 15000,
    imageURL:
      "https://ucarecdn.com/16f67447-45ef-4e78-bbe6-76c51716bc80/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    artistName: "Aldrin Tamildes",
    title: "Corrupted",
    medium: "Acrylic On Canvas",
    size: `36" x 36" `,
    price: 40000,
    imageURL: "https://media.graphassets.com/buSCdJDcTpSHszovGd1T",
  },
  {
    artistName: "Tokwa Penaflorida",
    title: "Pearl Necklace",
    medium: "Acrylic on canvas",
    size: `12" x 12"`,
    price: 0,
    imageURL: "https://media.graphassets.com/xSDBUZfwTpeLQSf72qUA",
  },
  {
    artistName: "Anton Bolardo",
    title: "Forgive a girl for being lonely",
    medium: "Acrylic on canvas",
    size: `24" x 36"`,
    price: 0,
    isSold: true,
    imageURL: "https://media.graphassets.com/DMWgIi0RXSX24GvuKfZh",
  },
  {
    artistName: "Gabriel Colico",
    title: "Enjoy Life Today",
    medium: "Acrylic On Canvas",
    size: `24" x 36"`,
    price: 35998,
    imageURL: "https://media.graphassets.com/AcGRIJamTqCZYyvBpYp4",
  },
  {
    artistName: "Gabriel Colico",
    title: "Be Grateful For Everything",
    medium: "Acrylic On Canvas",
    size: `24" x 36"`,
    price: 36000,
    imageURL: "https://media.graphassets.com/WulRjqxhQlKWz05WB5sc",
  },
  {
    artistName: "Tisha Paculba",
    title: "Children Of The Forest First Series - Healer",
    medium: "Oil On Canvas",
    size: `24" x 18"`,
    price: 30000,
    imageURL: "https://media.graphassets.com/4mLvGFIYS3W0Fb7iR9s9",
  },
  {
    artistName: "Tisha Paculba",
    title: "Children Of The Forest First Series - Dancer",
    medium: "Oil On Canvas",
    size: `12" x 16"`,
    price: 20000,
    imageURL: "https://media.graphassets.com/lMWE6BLhQyaxoqkaL7dG",
  },
  {
    artistName: "Tisha Paculba",
    title:
      "Children Of The Forest First Series - Himalayan White-Browed Rosefinch",
    medium: "Oil On canvas",
    size: `9" x 11" `,
    price: 15000,
    imageURL: "https://media.graphassets.com/q4Or5AiRSXO5e9mB5vdr",
  },
  {
    artistName: "Bea Aben",
    title: "Stage R 1",
    medium: "Mixed Media on Water Color Paper",
    size: `14" x 18"`,
    price: 18000,
    imageURL: "https://media.graphassets.com/GvnGUSlNTcGgeRctLNEV",
  },
  {
    artistName: "Bea Aben",
    title: "Stage R 2",
    medium: "Mixed Media On Watercolor Paper",
    size: `14" x 18"`,
    price: 18000,
    imageURL: "https://media.graphassets.com/IlQi4jwMSeu36JB5SjVC",
  },
  {
    artistName: "Bea Aben",
    title: "Dream Surfer # 22:22",
    medium: "Mixed Media On Watercolor Paper",
    size: `31.5" x 23.5"`,
    price: 44000,
    imageURL: "https://media.graphassets.com/Y8Hv48n3RX25bNDDcjme",
  },
]

export const dataArtworksJourney: DataArtwork[] = [
  {
    exhibitionName: "Journey",
    artistName: "Sarcita Yasa",
    title: "Hope",
    medium: "MEDIUM",
    size: "0x0 inches",
    year: 2023,
    price: 100,
    imageURL:
      "https://ucarecdn.com/592991f0-cd0e-43b6-a495-b388be559ee4/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    exhibitionName: "Journey",
    artistName: "Sarcita Yasa",
    title: "K.O.",
    medium: "MEDIUM",
    size: "0x0 inches",
    year: 2023,
    price: 100,
    imageURL:
      "https://ucarecdn.com/605a6202-9dbd-4635-8f52-cf58f210086f/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    exhibitionName: "Journey",
    artistName: "Sarcita Yasa",
    title: "Hero",
    medium: "MEDIUM",
    size: "0x0 inches",
    year: 2023,
    price: 100,
    imageURL:
      "https://ucarecdn.com/51664df6-0178-4c16-8758-68886dd51b81/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    exhibitionName: "Journey",
    artistName: "Sarcita Yasa",
    title: "Hero",
    medium: "MEDIUM",
    size: "0x0 inches",
    year: 2023,
    price: 100,
    imageURL:
      "https://ucarecdn.com/6d40ae57-7ee4-4754-b39e-6812b298b5f7/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    exhibitionName: "Journey",
    artistName: "Sarcita Yasa",
    title: "Guard The Balloons",
    medium: "MEDIUM",
    size: "0x0 inches",
    year: 2023,
    price: 100,
    imageURL:
      "https://ucarecdn.com/aa531289-2e52-4b5d-85f7-abb0b83b72bb/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    exhibitionName: "Journey",
    artistName: "Sarcita Yasa",
    title: "Little Doll",
    medium: "MEDIUM",
    size: "0x0 inches",
    year: 2023,
    price: 100,
    imageURL:
      "https://ucarecdn.com/1e6708cc-e0f7-43ae-8277-651e81f4d51b/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
]

export const dataArtworksWound: DataArtwork[] = [
  {
    exhibitionName: "Wound",
    artistName: "Laura Abejo",
    title: "Adieu",
    medium: "Oil on Canvas",
    size: "24x40 inches",
    year: 2023,
    price: 35000,
    imageURL:
      "https://ucarecdn.com/538334dd-d483-4416-8d57-28254da97a5d/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    exhibitionName: "Wound",
    artistName: "Laura Abejo",
    title: "Bad Apples Are Free",
    medium: "Oil on Shaped Canvas with Crocheted Frame",
    size: "12x10 inches",
    year: 2023,
    price: 8000,
    imageURL:
      "https://ucarecdn.com/83fba0ef-10ce-47f5-acb9-b59aa1c2387e/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
  {
    exhibitionName: "Wound",
    artistName: "Nicole Conwi",
    title: "How Much Longer?",
    medium: "Acrylic and Yarn on Canvas",
    size: "18x24 inches",
    year: 2023,
    price: 20000,
    imageURL:
      "https://ucarecdn.com/7e266377-52d5-45d3-be88-f960e0560524/-/preview/938x432/-/quality/smart/-/format/auto/",
  },
]

export const dataArtworks = [
  ...dataArtworksLikeCandy, // 1
  ...dataArtworksJourney, // 44
  ...dataArtworksWound, // 35
]
