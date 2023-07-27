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
