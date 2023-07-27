import type { Artist, Artwork } from "@prisma/client"

export type DataArtwork = Pick<Artwork, "title" | "medium" | "size"> & {
  exhibitionName?: string
  artistName?: Artist["name"]
  year?: Artwork["year"]
  price?: Artwork["price"]
  imageURL?: string
}

export const dataArtworks: DataArtwork[] = [
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
