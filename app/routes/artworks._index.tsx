import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import {
  Card,
  CardHeader,
  CardTitle,
  getPaginationConfigs,
  getPaginationOptions,
  ImageArtwork,
  Layout,
  PaginationNavigation,
  PaginationSearch,
} from "~/components"

export const loader = async ({ request }: LoaderArgs) => {
  const config = getPaginationConfigs({ request, defaultLimit: 20 })

  const where = !config.queryParam
    ? {}
    : {
        OR: [
          { title: { contains: config.queryParam } },
          { medium: { contains: config.queryParam } },
        ],
      }

  const [totalItems, items] = await prisma.$transaction([
    prisma.artwork.count({ where }),

    prisma.artwork.findMany({
      where,
      skip: config.skip,
      take: config.limitParam,
      orderBy: { createdAt: "desc" },
      include: { images: true, artist: true },
    }),
  ])

  return json({
    ...getPaginationOptions({ request, totalItems }),
    artworks: items,
    count: items.length,
  })
}

export default function ArtworksRoute() {
  const { count, artworks, ...loaderData } = useLoaderData<typeof loader>()

  return (
    <Layout className="space-y-8 p-4">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/cat-wood.png" alt="Cat" className="h-10" />
          <span>Artworks</span>
        </h1>
      </header>

      <PaginationSearch
        itemName="artwork"
        searchPlaceholder="Search artworks by title..."
        count={count}
        isVerbose={true}
        {...loaderData}
      />

      <PaginationNavigation {...loaderData} />

      {count > 0 && (
        <section>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {artworks.map(artwork => {
              return (
                <li key={artwork.id} className="w-full">
                  <Link to={`/artworks/${artwork.slug}`}>
                    <Card className="hover-opacity h-full space-y-2">
                      <CardHeader className="flex flex-col items-center space-y-2">
                        <ImageArtwork className="w-full object-contain">{artwork}</ImageArtwork>

                        <div className="flex-grow" />

                        <CardTitle className="text-center text-2xl">{artwork.title}</CardTitle>

                        <p>{artwork.artist?.name}</p>
                      </CardHeader>
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
