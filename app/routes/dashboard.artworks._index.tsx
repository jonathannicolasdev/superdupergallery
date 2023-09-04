import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Form, Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatNumberToPHP, formatTitle } from "~/utils"
import {
  Badge,
  Button,
  Card,
  getPaginationConfigs,
  getPaginationOptions,
  ImageArtwork,
  PaginationNavigation,
  PaginationSearch,
} from "~/components"
import { model } from "~/models"

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
      orderBy: { updatedAt: "desc" },
      include: { images: true, artist: true, status: true },
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
      <header className="flex items-center gap-2">
        <p>Artworks</p>
        <Form method="POST">
          <Button type="submit" size="sm">
            Add New Artwork
          </Button>
        </Form>
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
                        <div className="text-sm text-muted-foreground">
                          <p>{artwork.artist?.name}</p>
                          <p>{formatNumberToPHP(artwork.price)}</p>
                          <p className="space-x-2">
                            <span>{artwork.isPublished ? "✅ Published" : "❌ Unpublished"}</span>
                            {artwork.status?.name && <Badge>{artwork.status.name}</Badge>}
                          </p>
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

  const { artwork } = await model.artwork.mutation.addNewArtwork()
  if (!artwork) return null

  if (redirectTo) {
    return redirect(`${artwork.id}/edit?redirectTo=${redirectTo}`)
  } else {
    return redirect(`${artwork.id}/edit`)
  }
}
