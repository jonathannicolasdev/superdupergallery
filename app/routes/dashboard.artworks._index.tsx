import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, formatTitle } from "~/utils"
import { Card, ImageArtwork } from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Artworks`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const artworks = await prisma.artwork.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true, artist: true },
  })
  return json({ count: artworks.length, artworks })
}

export default function RouteComponent() {
  const { count, artworks } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="space-y-2">
        <p>All {formatPluralItems("artwork", count)}</p>
      </header>

      {count > 0 && (
        <section>
          <ul className="grid grid-cols-2 gap-4">
            {artworks.map(artwork => {
              return (
                <li key={artwork.id}>
                  <Link to={`/dashboard/artworks/${artwork.id}`}>
                    <Card className="hover-opacity grid max-w-xl grid-cols-4 items-center gap-4">
                      <ImageArtwork className="w-full object-contain">{artwork}</ImageArtwork>

                      <div className="col-span-3">
                        <h4>{artwork.title}</h4>
                        <div className="text-muted-foreground">
                          <p>{artwork.slug}</p>
                          <p>{artwork.artist?.name}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}
