import type { Artist } from "@prisma/client"

import { getNameInitials } from "~/utils"
import { AvatarAuto, Card, CardHeader, CardTitle } from "~/components"

interface Props {
  artist: Artist & {
    images: { url: string }[]
  }
}

export function ArtistCard({ artist }: Props) {
  return (
    <Card className="hover-opacity max-w-2xl">
      <CardHeader className="flex gap-4">
        {artist?.images[0]?.url && (
          <AvatarAuto
            className="h-24 w-24"
            src={artist.images[0]?.url}
            alt={artist.name}
            fallback={getNameInitials(artist.name)}
          />
        )}

        <div className="flex flex-col justify-between">
          <CardTitle className="text-2xl">{artist.name}</CardTitle>
        </div>
      </CardHeader>
    </Card>
  )
}
