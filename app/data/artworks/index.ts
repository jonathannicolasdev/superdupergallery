import type { Artwork } from "@prisma/client"

import artworks1 from "./01.json"
import artworks2 from "./02.json"
import artworks3 from "./03.json"
import artworks4 from "./04.json"
import artworks5 from "./05.json"
import artworks6 from "./06.json"
import artworks7 from "./07.json"
import artworks8 from "./08.json"
import artworks9 from "./09.json"
import artworks10 from "./10.json"
import artworks11 from "./11.json"
import artworks12 from "./12.json"
// import artworks13 from "./13.json";
// import artworks14 from "./14.json";
// import artworks15 from "./15.json";
// import artworks16 from "./16.json";
// import artworks17 from "./17.json";
// import artworks18 from "./18.json";
// import artworks19 from "./19.json";
// import artworks20 from "./20.json";
// import artworks21 from "./21.json";
// import artworks22 from "./22.json";
// import artworks23 from "./23.json";
// import artworks24 from "./24.json";
// import artworks25 from "./25.json";
import artworks26 from "./26.json"
import artworks27 from "./27.json"
import artworks28 from "./28.json"
import artworks29 from "./29.json"
import artworks30 from "./30.json"
import artworks31 from "./31.json"
import artworks32 from "./32.json"
import artworks33 from "./33.json"
import artworks34 from "./34.json"
import artworks35 from "./35.json"
import artworks36 from "./36.json"
import artworks37 from "./37.json"
// import artworks38 from "./38.json"
import artworks39 from "./39.json"
import artworks40 from "./40.json"
// import artworks41 from "./41.json";
// import artworks42 from "./42.json";
// import artworks43 from "./43.json";
import artworks44 from "./44.json"
import artworks45 from "./45.json"

export type DataArtwork = Pick<Artwork, "title" | "medium" | "size"> & {
  artistName: string
  price?: number | null
  sequence?: number | null
  imageURL?: string | null
  year?: number | null | undefined
  statusSymbol?: string | null | undefined
}

export type DataArtworksInExhibition = {
  edition: number
  exhibitionTitle: string
  artworks: DataArtwork[]
}

export const dataArtworksInExhibitions: DataArtworksInExhibition[] = [
  { edition: 1, exhibitionTitle: "Like Candy", artworks: artworks1 },
  { edition: 2, exhibitionTitle: "The Universe Smiles Back At You", artworks: artworks2 },
  { edition: 3, exhibitionTitle: "Double Burner", artworks: artworks3 },
  { edition: 4, exhibitionTitle: "Here Still", artworks: artworks4 },
  { edition: 5, exhibitionTitle: "Too Much Love Will Kill You", artworks: artworks5 },
  { edition: 6, exhibitionTitle: "Gorgonesque", artworks: artworks6 },
  { edition: 7, exhibitionTitle: "Shhhhh", artworks: artworks7 },
  { edition: 8, exhibitionTitle: "Forever Young", artworks: artworks8 },
  { edition: 9, exhibitionTitle: "Warm & Fuzzy Memories", artworks: artworks9 },
  { edition: 10, exhibitionTitle: "AC 50th Anniversary", artworks: artworks10 },
  { edition: 11, exhibitionTitle: "Coronial by Muklay", artworks: artworks11 },
  { edition: 12, exhibitionTitle: "A Day in Paradise", artworks: artworks12 },
  // 13
  // ...
  // 25
  { edition: 26, exhibitionTitle: "Continuing", artworks: artworks26 },
  { edition: 27, exhibitionTitle: "Barely Placid", artworks: artworks27 },
  { edition: 28, exhibitionTitle: "High Jinks", artworks: artworks28 },
  { edition: 29, exhibitionTitle: "Erasing Traces", artworks: artworks29 },
  { edition: 30, exhibitionTitle: "Awake & Sleep", artworks: artworks30 },
  { edition: 31, exhibitionTitle: "AFP Dancing in Supernova", artworks: artworks31 },
  { edition: 32, exhibitionTitle: "Gathering Flowers", artworks: artworks32 },
  { edition: 33, exhibitionTitle: "Fragments", artworks: artworks33 },
  { edition: 34, exhibitionTitle: "Aesthetic Gang", artworks: artworks34 },
  { edition: 35, exhibitionTitle: "Dark Lenses", artworks: artworks35 },
  { edition: 36, exhibitionTitle: "Fill The Empty Room", artworks: artworks36 },
  { edition: 37, exhibitionTitle: "Flåner", artworks: artworks37 },
  // 38
  { edition: 39, exhibitionTitle: "Come Over", artworks: artworks39 },
  { edition: 40, exhibitionTitle: "Nawong", artworks: artworks40 },
  // 41
  // 42
  // 43
  { edition: 44, exhibitionTitle: "Journey", artworks: artworks44 },
  { edition: 45, exhibitionTitle: "Wound", artworks: artworks45 },
  // 46
]
