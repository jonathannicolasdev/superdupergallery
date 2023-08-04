import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems, formatTitle } from "~/utils"
import { AvatarAuto, Card, CardTitle, Debug, Layout, SearchForm } from "~/components"

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
      { headers: createCacheHeaders(request, 60) },
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
    <Layout className="space-y-8 p-4">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/cat-star.png" alt="Cat" className="h-10" />
          <span>Artists</span>
        </h1>
        <p className="text-muted-foreground">
          Artist is a person who produces artworks like paintings or drawings, as a
          profession or hobby.
        </p>
      </header>

      <section className="w-full space-y-4">
        <SearchForm action="/artists" placeholder="Search artists with keyword..." />

        {query && count <= 0 && (
          <p className="text-muted-foreground">No artist found with keyword "{query}"</p>
        )}

        {!query && count > 0 && (
          <p className="text-muted-foreground">{formatPluralItems("artist", count)}</p>
        )}

        {query && count > 0 && (
          <p className="text-muted-foreground">
            Found {formatPluralItems("artist", count)} with keyword "{query}"
          </p>
        )}
      </section>

      {count > 0 && (
        <section className="space-y-2">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8 lg:grid-cols-4">
            {artists?.length > 0 &&
              artists.map(artist => {
                return (
                  <li key={artist.id} className="w-full">
                    <Link to={`/artists/${artist.slug}`}>
                      <Card className="hover-opacity flex max-w-2xl items-center gap-4">
                        {artist.image?.url && (
                          <AvatarAuto
                            className="h-20 w-20"
                            src={artist.image.url}
                            alt={artist.name}
                            fallback={artist.name[0].toUpperCase()}
                          />
                        )}

                        <div className="flex flex-col justify-between">
                          <CardTitle className="text-xl sm:text-2xl">
                            {artist.name}
                          </CardTitle>
                        </div>
                      </Card>
                    </Link>
                  </li>
                )
              })}
          </ul>
        </section>
      )}

      <section>
        <Debug>{artists}</Debug>
      </section>
    </Layout>
  )
}
