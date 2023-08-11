import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, formatTitle, getNameInitials } from "~/utils"
import {
  AvatarAuto,
  Card,
  CardDescription,
  CardTitle,
  getPaginationConfigs,
  getPaginationOptions,
  Layout,
  PaginationNavigation,
  PaginationSearch,
} from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.queryParam
  const count = data?.count || 0
  const pluralItems = formatPluralItems("artist", count)

  if (!query) {
    return [
      { title: formatTitle(`All artists`) },
      { name: "description", content: `All artists in Super Duper Gallery.` },
    ]
  }

  return [
    { title: formatTitle(`Keyword "${query}" found ${pluralItems}`) },
    { name: "description", content: `Searching for "${query}" found ${pluralItems}.` },
  ]
}

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

export default function Route() {
  const { count, artists, ...loaderData } = useLoaderData<typeof loader>()

  return (
    <Layout className="space-y-8 p-4">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/cat-star.png" alt="Cat" className="h-10" />
          <span>Artists</span>
        </h1>
        <p className="text-muted-foreground">
          Artist is a person who produces artworks like paintings or drawings, as a profession or
          hobby.
        </p>
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
        <section className="space-y-2">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8 lg:grid-cols-4">
            {artists?.length > 0 &&
              artists.map(artist => {
                return (
                  <li key={artist.id} className="w-full">
                    <Link to={`/artists/${artist.slug}`}>
                      <Card className="hover-opacity flex max-w-2xl items-center gap-4">
                        <AvatarAuto
                          src={artist.image?.url}
                          alt={`${artist.name}`}
                          fallback={getNameInitials(artist.name)}
                          className="h-20 w-20"
                        />

                        <div className="flex flex-col justify-between">
                          <CardTitle className="text-xl">{artist.name}</CardTitle>
                          <CardDescription>
                            {formatPluralItems("artwork", artist.artworks.length)}
                          </CardDescription>
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
    </Layout>
  )
}
