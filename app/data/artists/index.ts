import type { Artist } from "@prisma/client"

export type DataArtist = Pick<Artist, "name"> & {
  bio?: Artist["bio"]
  exhibitions?: string[]
}

export const dataArtists: DataArtist[] = [
  { name: "Alburoto" },
  { name: "Angellica Lorente" },
  { name: "Jelly Fish Kisses" },
  { name: "Bea Aben" },
  { name: "Expi Perez" },
  { name: "Gab Colico" },
  { name: "Jessa Almirol" },
  { name: "John Loyd Benz De Leon" },
  { name: "Paulo Amparo" },
  { name: "Tisha Paculba" },
  { name: "Tokwa Penaflorida" },
  { name: "Trexia" },
  { name: "Viktor Tejada" },
  { name: "Sarcita Yasa" },
  { name: "Laura Abejo" },
  { name: "Nicole Conwi" },
]
