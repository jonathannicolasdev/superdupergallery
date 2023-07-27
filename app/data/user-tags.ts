import type { UserTag } from "@prisma/client"

export type DataUserTag = Pick<UserTag, "name" | "symbol"> & {
  symbol: DataUserTagSymbol
  sequence?: UserTag["sequence"]
  description?: UserTag["description"]
}

export type DataUserTagSymbol = "COLLABORATOR" | "ARTIST" | "UNKNOWN"

export const dataUserTags: DataUserTag[] = [
  {
    symbol: "COLLABORATOR",
    name: "Collaborator",
    sequence: 1,
    description: "Super Duper Gallery team members.",
  },
  { symbol: "ARTIST", name: "Artist" },
  { symbol: "UNKNOWN", name: "Unknown" },
]
