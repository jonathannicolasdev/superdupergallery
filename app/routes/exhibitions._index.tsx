import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems, formatTitle } from "~/utils"
import { Card, CardTitle, ImageExhibition, Layout, SearchForm } from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query
  const count = data?.count

  if (!query) {
    return [
      { title: formatTitle(`All exhibitions`) },
      {
        name: "description",
        content: `All exhibitions in Super Duper Gallery.`,
      },
    ]
  }

  return [
    { title: formatTitle(`Keyword "${query}" found ${count} exhibitions`) },
    {
      name: "description",
      content: `Searching for "${query}" found ${count} exhibitions.`,
    },
  ]
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    const exhibitions = await prisma.exhibition.findMany({
      orderBy: { edition: "asc" },
      include: {
        images: true,
        artworks: true,
        artists: true,
      },
    })

    return json(
      { query, count: exhibitions.length, exhibitions },
      { headers: createCacheHeaders(request, 5) },
    )
  }

  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { edition: "asc" },
    include: {
      images: true,
      artworks: true,
      artists: true,
    },
    where: {
      OR: [{ title: { contains: query } }],
    },
  })

  return json({ query, count: exhibitions.length, exhibitions })
}

export default function RouteComponent() {
  const { query, count, exhibitions } = useLoaderData<typeof loader>()

  return (
    <Layout className="space-y-8 p-4">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/cat-trophy.png" alt="Cat" className="h-10" />
          <span>Exhibitions</span>
        </h1>
        <p className="text-muted-foreground">
          An art exhibition is traditionally the space in which art objects meet an audience. The
          exhibit is universally understood to be for some temporary period.
        </p>
      </header>

      <section className="w-full space-y-4">
        <SearchForm action="/exhibitions" placeholder="Search for exhibitions" />

        {query && count <= 0 && (
          <p className="text-muted-foreground">No exhibition found with keyword "{query}"</p>
        )}

        {!query && count > 0 && (
          <p className="text-muted-foreground">{formatPluralItems("exhibition", count)}</p>
        )}

        {query && count > 0 && (
          <p className="text-muted-foreground">
            Found {formatPluralItems("exhibition", count)} with keyword "{query}"
          </p>
        )}
      </section>

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

                      <CardTitle className="text-2xl">{exhibition.title}</CardTitle>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </Layout>
  )
}
