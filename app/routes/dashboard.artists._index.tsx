import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatTitle, getNameInitials } from "~/utils"
import {
  AvatarAuto,
  Card,
  getPaginationConfigs,
  getPaginationOptions,
  PaginationNavigation,
  PaginationSearch,
} from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Artists`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const config = getPaginationConfigs({ request, defaultLimit: 20 })

  const where = !config.queryParam
    ? {}
    : {
        OR: [
          { name: { contains: config.queryParam } },
          // { bio: { contains: config.queryParam } },
        ],
      }

  const [totalItems, items] = await prisma.$transaction([
    prisma.artist.count({ where }),

    prisma.artist.findMany({
      where,
      skip: config.skip,
      take: config.limitParam,
      orderBy: { name: "asc" },
      include: {
        image: { select: { url: true } },
        artworks: { select: { id: true } },
      },
    }),
  ])

  return json({
    ...getPaginationOptions({ request, totalItems }),
    artists: items,
    count: items.length,
  })
}

export default function RouteComponent() {
  const { count, artists, ...loaderData } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="space-y-2">
        <p>Artists</p>
      </header>

      <PaginationSearch
        itemName="artist"
        searchPlaceholder="Search artists by name and bio..."
        count={count}
        isVerbose={true}
        {...loaderData}
      />

      <PaginationNavigation {...loaderData} />

      {count > 0 && (
        <section>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {artists.map(artist => {
              return (
                <li key={artist.id}>
                  <Link to={`/dashboard/artists/${artist.id}`}>
                    <Card className="hover-opacity flex max-w-xl items-center gap-4">
                      <AvatarAuto
                        className="h-20 w-20"
                        src={artist.image?.url}
                        alt={artist.name}
                        fallback={getNameInitials(artist.name)}
                      />

                      <div>
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

      <PaginationNavigation {...loaderData} />
    </>
  )
}
