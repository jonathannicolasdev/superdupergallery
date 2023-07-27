import type { Artwork } from "@prisma/client"

export type DataArtwork = Pick<Artwork, "title" | "medium" | "size">

export const dataArtworks: DataArtwork[] = [
  {
    title: "Artwork by Admin 1",
    medium: "Canvas",
    size: `20" x 20" x 20"`,
  },
  {
    title: "Artwork by Admin 2",
    medium: "Acrylic",
    size: `15" x 15" x 15"`,
  },
]
