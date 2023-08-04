import type { UserTag } from "@prisma/client"

export type DataUserTag = Pick<UserTag, "name" | "symbol"> & {
  symbol: DataUserTagSymbol
  sequence?: UserTag["sequence"]
  description?: UserTag["description"]
}

export type DataUserTagSymbol = "TEAM" | "ARTIST" | "UNKNOWN"

export const dataUserTags: DataUserTag[] = [
  {
    symbol: "TEAM",
    name: "Team Member",
    sequence: 1,
    description: "Super Duper Gallery team members.",
  },
  {
    symbol: "ARTIST",
    name: "Artist",
    sequence: 2,
    description: "The Artist.",
  },
  {
    symbol: "UNKNOWN",
    name: "Unknown",
    sequence: 3,
    description: "Unknown person.",
  },
]
