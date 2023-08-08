import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, formatTitle, getNameInitials } from "~/utils"
import { AvatarAuto, Card } from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Artists`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const artists = await prisma.artist.findMany({
    orderBy: { name: "asc" },
    include: { image: true, artworks: true },
  })
  return json({ count: artists.length, artists })
}

export default function RouteComponent() {
  const { count, artists } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="space-y-2">
        <p>All {formatPluralItems("artist", count)}</p>
      </header>

      {count > 0 && (
        <section>
          <ul className="space-y-4">
            {artists.map(artist => {
              return (
                <li key={artist.id}>
                  <Link to={`/dashboard/artists/${artist.id}`}>
                    <Card className="hover-opacity grid max-w-xl grid-cols-4 items-center gap-4">
                      <AvatarAuto
                        className="h-20 w-20"
                        src={artist.image?.url}
                        alt={artist.name}
                        fallback={getNameInitials(artist.name)}
                      />

                      <div className="col-span-3">
                        <h4>{artist.name}</h4>
                        <div className="text-muted-foreground">
                          <p>{artist.slug}</p>
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
