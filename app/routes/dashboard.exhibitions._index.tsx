import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Form, Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { createExhibitionSlug, formatDateAndRelative, formatTitle } from "~/utils"
import {
  Button,
  Card,
  getPaginationConfigs,
  getPaginationOptions,
  ImageExhibition,
  PaginationNavigation,
  PaginationSearch,
} from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Exhibitions`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const config = getPaginationConfigs({ request, defaultLimit: 20 })

  const where = !config.queryParam
    ? {}
    : {
        OR: [
          { edition: { equals: Number(config.queryParam) } },
          { title: { contains: config.queryParam } },
        ],
      }

  const [totalItems, items] = await prisma.$transaction([
    prisma.exhibition.count({ where }),

    prisma.exhibition.findMany({
      where,
      skip: config.skip,
      take: config.limitParam,
      orderBy: { edition: "desc" },
      include: { images: true, artworks: true, artists: true },
    }),
  ])

  return json({
    ...getPaginationOptions({ request, totalItems }),
    exhibitions: items,
    count: items.length,
  })
}

export default function RouteComponent() {
  const { count, exhibitions, ...loaderData } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="flex items-center gap-2">
        <p>Exhibitions</p>
        <Form method="POST">
          <Button type="submit" size="sm">
            Create New
          </Button>
        </Form>
      </header>

      <PaginationSearch
        itemName="exhibition"
        searchPlaceholder="Search exhibitions by title and description..."
        count={count}
        isVerbose={true}
        {...loaderData}
      />

      <PaginationNavigation {...loaderData} />

      {count > 0 && (
        <section>
          <ul className="space-y-4">
            {exhibitions.map(exhibition => {
              return (
                <li key={exhibition.id}>
                  <Link to={`/dashboard/exhibitions/${exhibition.id}`}>
                    <Card className="hover-opacity grid max-w-xl grid-cols-4 items-center gap-4">
                      <ImageExhibition className="h-24 object-contain">
                        {exhibition}
                      </ImageExhibition>

                      <div className="col-span-3">
                        <h4>{exhibition.title}</h4>
                        <div className="text-muted-foreground">
                          <p>{exhibition.slug}</p>
                          <p>
                            <time>{formatDateAndRelative(exhibition.date)}</time>
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
  const lastExhibiton = await prisma.exhibition.findFirst({
    orderBy: { edition: "desc" },
  })
  if (!lastExhibiton?.edition) return null

  const edition = lastExhibiton?.edition + 1
  const title = `Exhibition ${edition}`

  const exhibition = await prisma.exhibition.create({
    data: {
      edition: edition,
      title: title,
      slug: createExhibitionSlug(edition, title),
      date: new Date(),
      description: `Description of ${title}`,
    },
  })

  return redirect(`${exhibition.id}/edit`)
}
