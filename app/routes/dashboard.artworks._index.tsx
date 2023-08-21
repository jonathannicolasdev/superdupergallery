import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { createArtworkSlug, formatTitle } from "~/utils"
import {
  Card,
  getPaginationConfigs,
  getPaginationOptions,
  ImageArtwork,
  PaginationNavigation,
  PaginationSearch,
} from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Artworks`) }]

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

export default function RouteComponent() {
  const { count, artworks, ...loaderData } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="space-y-2">
        <p>Artworks</p>
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

      <PaginationNavigation {...loaderData} />
    </>
  )
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const redirectTo = formData.get("redirectTo")?.toString()

  const count = await prisma.artwork.count()

  const number = count + 1
  const title = `Artwork ${number}`

  const artwork = await prisma.artwork.create({
    data: {
      title,
      slug: createArtworkSlug(title, "unknown"),
      year: 2023,
      medium: "Canvas",
      size: "20x20 inches",
      price: 0,
    },
  })

  if (redirectTo) return redirect(`${artwork.id}/edit?redirectTo=${redirectTo}`)
  return redirect(`${artwork.id}/edit`)
}
