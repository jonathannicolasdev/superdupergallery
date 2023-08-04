import type { Artwork } from "@prisma/client"

import { Card, CardHeader, CardTitle } from "~/components"

interface Props {
  artwork: Artwork & {
    images: { url: string }[]
    artist: { name: string }
  }
}

export function ArtworkCard({ artwork }: Props) {
  return (
    <Card className="hover-opacity max-w-2xl">
      <CardHeader className="flex gap-4">
        {artwork?.images[0]?.url && (
          <img className="h-30 w-30" src={artwork.images[0]?.url} alt={artwork.title} />
        )}

        <div>
          <CardTitle className="text-2xl">{artwork.title}</CardTitle>
        </div>
      </CardHeader>
    </Card>
  )
}
