import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems, formatTitle } from "~/utils"
import { ArtistCard, Layout, SearchForm } from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query
  const count = data?.count

  if (!query) {
    return [
      { title: formatTitle(`All artists`) },
      { name: "description", content: `All artists in Bearartist.` },
    ]
  }

  return [
    { title: formatTitle(`Keyword "${query}" found ${count} artists`) },
    {
      name: "description",
      content: `Searching for "${query}" found ${count} artists.`,
    },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    const artists = await prisma.artist.findMany({
      orderBy: { updatedAt: "asc" },
      include: {
        image: { select: { url: true } },
      },
    })

    return json(
      { query, count: artists.length, artists },
      { headers: createCacheHeaders(request, 3600) },
    )
  }

  const artists = await prisma.artist.findMany({
    where: {
      OR: [{ name: { contains: query } }],
    },
    orderBy: { updatedAt: "asc" },
    include: {
      image: { select: { url: true } },
    },
  })

  return json({ query, count: artists.length, artists })
}

export default function Route() {
  const { query, count, artists } = useLoaderData<typeof loader>()

  return (
    <Layout className="max-w-7xl space-y-8 px-4 py-4 sm:px-8">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/bear-sunglasses.png" alt="Bear" className="h-10" />
          <span>Artists</span>
        </h1>
        <p className="text-muted-foreground">
          Artist is a person who produces artworks like paintings or drawings,
          as a profession or hobby.
        </p>
        <SearchForm action="/artists" placeholder="Search for artists" />
      </header>

      {count > 0 && (
        <section className="space-y-2">
          {!query && <p>{formatPluralItems("artist", count)}</p>}
          {query && (
            <p className="text-muted-foreground">
              Found {formatPluralItems("artist", count)} with keyword "{query}"
            </p>
          )}

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {artists.map(artist => {
              return (
                <li key={artist.id} className="w-full">
                  <Link to={`/artists/${artist.slug}`}>
                    <ArtistCard artist={artist as any} />
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
