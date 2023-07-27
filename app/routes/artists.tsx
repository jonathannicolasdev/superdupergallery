import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems, formatTitle } from "~/utils"
import {
  AvatarAuto,
  Card,
  CardHeader,
  CardTitle,
  Debug,
  Layout,
  SearchForm,
} from "~/components"

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
    <Layout className="flex flex-col gap-8 px-4 py-4">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/cat-star.png" alt="Cat" className="h-10" />
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
            {artists?.length > 0 &&
              artists.map(artist => {
                return (
                  <li key={artist.id} className="w-full">
                    <Link to={`/artists/${artist.slug}`}>
                      <Card className="hover-opacity max-w-2xl">
                        <CardHeader className="flex gap-4">
                          {artist.image?.url && (
                            <AvatarAuto
                              className="h-24 w-24"
                              src={artist.image.url}
                              alt={artist.name}
                              fallback={artist.name[0].toUpperCase()}
                            />
                          )}

                          <div className="flex flex-col justify-between">
                            <CardTitle className="text-2xl">
                              {artist.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
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
