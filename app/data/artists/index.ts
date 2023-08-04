import type { Artist } from "@prisma/client"

import dataAllArtists from "./all-artists.json"

export type DataArtist = Pick<Artist, "name"> & {
  bio?: Artist["bio"]
  exhibitions?: string[]
}

export const dataArtists: DataArtist[] = dataAllArtists
