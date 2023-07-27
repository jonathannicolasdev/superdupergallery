import type { Artwork } from "@prisma/client"

export type DataArtwork = Pick<Artwork, "title" | "medium" | "size">

export const dataArtworks: DataArtwork[] = [
  {
    title: "Artwork ABC",
    medium: "Canvas",
    size: `20" x 20" x 20"`,
  },
  {
    title: "Artwork DEF",
    medium: "Acrylic",
    size: `15" x 15" x 15"`,
  },
  {
    title: "Artwork XYZ",
    medium: "Acrylic",
    size: `15" x 15" x 15"`,
  },
]
