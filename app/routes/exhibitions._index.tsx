import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatDateOnly, formatPluralItems, formatTitle } from "~/utils"
import {
  Card,
  CardDescription,
  CardTitle,
  getPaginationConfigs,
  getPaginationOptions,
  ImageExhibition,
  Layout,
  PaginationNavigation,
  PaginationSearch,
} from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.queryParam
  const count = data?.count || 0
  const pluralItems = formatPluralItems("exhibition", count)

  if (!query) {
    return [
      { title: formatTitle(`All exhibitions`) },
      { name: "description", content: `All exhibitions in Super Duper Gallery.` },
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
    ? {
        images: { some: { url: { not: "" } } },
      }
    : {
        images: { some: { url: { not: "" } } },
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
export default function Route() {
  const { count, exhibitions, ...loaderData } = useLoaderData<typeof loader>()

  return (
    <Layout className="space-y-8 p-4">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/cat-trophy.png" alt="Cat" className="h-10" />
          <span>Exhibitions</span>
        </h1>
        <p className="text-muted-foreground">
          An art exhibition or a show, is the space in which art objects meet an audience. The
          exhibit is universally understood to be for some temporary period.
        </p>
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
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {exhibitions.map(exhibition => {
              return (
                <li key={exhibition.id} className="w-full">
                  <Link to={`/exhibitions/${exhibition.slug}`}>
                    <Card className="hover-opacity flex h-full flex-col space-y-2">
                      <ImageExhibition className="w-full object-contain">
                        {exhibition}
                      </ImageExhibition>
                      <CardTitle className="text-center text-2xl">{exhibition.title}</CardTitle>
                      <CardDescription className="text-center">
                        <time>{formatDateOnly(exhibition.date)}</time>
                      </CardDescription>
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
