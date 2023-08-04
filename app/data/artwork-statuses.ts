import type { ArtworkStatus } from "@prisma/client"

export type DataArtworkStatus = Pick<ArtworkStatus, "name" | "symbol"> & {
  symbol: DataArtworkStatusSymbol
  sequence?: ArtworkStatus["sequence"]
  description?: ArtworkStatus["description"]
}

export type DataArtworkStatusSymbol =
  | "AVAILABLE"
  | "SOLD"
  | "PULLED-OUT"
  | "RESERVED"
  | "UNKNOWN"

export const dataArtworkStatuses: DataArtworkStatus[] = [
  {
    symbol: "AVAILABLE",
    name: "Available",
    sequence: 1,
    description: "Available to be seen and buy",
  },
  {
    symbol: "SOLD",
    name: "Sold",
    sequence: 2,
    description: "Sold to someone.",
  },
  {
    symbol: "PULLED-OUT",
    name: "Pulled Out",
    sequence: 3,
    description: "Pulled out and cannot be seen or buy anymore.",
  },
  {
    symbol: "RESERVED",
    name: "Reserved",
    sequence: 4,
    description: "Reserved for someone.",
  },
  {
    symbol: "UNKNOWN",
    name: "Unknown",
    sequence: 5,
    description: "Unknown is not known.",
  },
]
