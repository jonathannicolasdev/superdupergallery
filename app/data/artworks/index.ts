import type { Artwork } from "@prisma/client"

import artworks1 from "./1-like-candy.json"
import artworks44 from "./44-journey.json"
import artworks45 from "./45-wound.json"

export type DataArtwork = Pick<Artwork, "title" | "medium" | "size"> &
  Partial<Artwork> & {
    isSold?: boolean
    artistName?: string
    imageURL?: string
  }

export type DataArtworksInExhibition = {
  exhibitionName: string
  artworks: DataArtwork[]
}

export const dataArtworksInExhibitions: DataArtworksInExhibition[] = [
  {
    exhibitionName: "Like Candy",
    artworks: artworks1,
  },
  {
    exhibitionName: "Journey",
    artworks: artworks44,
  },
  {
    exhibitionName: "Wound",
    artworks: artworks45,
  },
]
