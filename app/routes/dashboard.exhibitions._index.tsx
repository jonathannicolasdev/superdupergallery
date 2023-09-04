import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Form, Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatDateAndRelative, formatTitle } from "~/utils"
import {
  Button,
  Card,
  getPaginationConfigs,
  getPaginationOptions,
  ImageExhibition,
  PaginationNavigation,
  PaginationSearch,
} from "~/components"
import { model } from "~/models"

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
          <Button type="submit" size="sm" name="intent" value="add-exhibition">
            Add New Exhibition
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
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {exhibitions.map(exhibition => {
              return (
                <li key={exhibition.id}>
                  <Link to={`/dashboard/exhibitions/${exhibition.id}`}>
                    <Card className="hover-opacity flex max-w-xl items-start gap-4">
                      <ImageExhibition className="h-24 object-contain">
                        {exhibition}
                      </ImageExhibition>

                      <div className="space-y-1">
                        <h4>{exhibition.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            <time>{formatDateAndRelative(exhibition.date)}</time>
                          </p>
                          <p>{exhibition.isPublished ? "✅ Published" : "❌ Unpublished"}</p>
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
  const { exhibition } = await model.exhibition.mutation.addNewExhibition()
  if (!exhibition) return null
  return redirect(`${exhibition.id}/edit`)
}
