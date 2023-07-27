import type { Artist } from "@prisma/client"

export type DataArtist = Pick<Artist, "name" | "bio">

export const dataArtists: DataArtist[] = [
  {
    name: "Artist A",
    bio: "",
  },
  {
    name: "Artist B",
    bio: "",
  },
  {
    name: "Artist C",
    bio: "",
  },
]
