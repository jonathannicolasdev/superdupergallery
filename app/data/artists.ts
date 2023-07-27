import type { Artist } from "@prisma/client"

export type DataArtist = Pick<Artist, "name" | "bio"> & {
  exhibitions?: string[]
}

export const dataArtists: DataArtist[] = [
  {
    name: "Laura Abejo",
    bio: "",
    // exhibitions: ["Wound"]
  },
  {
    name: "Nicole Conwi",
    bio: "",
    // exhibitions: ["Wound"]
  },
]
