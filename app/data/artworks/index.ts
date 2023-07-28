import type { Artwork } from "@prisma/client"

import artworks1 from "./1-like-candy.json"
import artworks2 from "./44-journey.json"
import artworks3 from "./45-wound.json"

export type DataArtwork = Pick<Artwork, "title" | "medium" | "size"> &
  Partial<Artwork> & {
    isSold?: boolean
    artistName?: string
    exhibitionName?: string
    imageURL?: string
  }

export const dataArtworks: DataArtwork[] = [
  ...artworks1,
  ...artworks2,
  ...artworks3,
]
