import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, formatTitle, getNameInitials } from "~/utils"
import {
  AvatarAuto,
  Card,
  CardHeader,
  CardTitle,
  ImageArtwork,
  Layout,
  SearchForm,
} from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query || ""
  const count = data?.count || 0

  if (!query && !count) {
    return [
      { title: formatTitle(`Search anything`) },
      { name: "description", content: `Search for various information.` },
    ]
  }

  if (query && !count) {
    return [
      { title: formatTitle(`Keyword "${query}" has no users`) },
      { name: "description", content: `No search users.` },
    ]
  }

  return [
    { title: formatTitle(`Keyword "${query}" found ${count} users`) },
    {
      name: "description",
      content: `Searching for "${query}" found ${count} users.`,
    },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    return json({ query, count: 0, artworks: [], artists: [], users: [] })
  }

  const [artworks, artists] = await prisma.$transaction([
    prisma.artwork.findMany({
      orderBy: [{ title: "asc" }],
      where: {
        images: { some: { url: { not: "" } } },
        OR: [{ title: { contains: query } }, { medium: { contains: query } }],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        medium: true,
        images: true,
      },
    }),

    prisma.artist.findMany({
      orderBy: [{ name: "asc" }],
      where: {
        OR: [{ name: { contains: query } }],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        image: true,
      },
    }),
  ])

  const artworksCount = artworks.length
  const artistsCount = artists.length

  const count = artworksCount + artistsCount

  return json({ query, count, artworks, artists })
}

export default function Route() {
  const { query, count, artworks, artists } = useLoaderData<typeof loader>()

  return (
    <Layout className="space-y-8 p-4">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/cat-hole.png" alt="Cat" className="h-10" />
          <span>Search</span>
        </h1>
        <p className="text-muted-foreground">Find anything in Super Duper Gallery</p>
        <SearchForm />
      </header>

      {count <= 0 && query && (
        <section>
          <p>No result found for keyword "{query}"</p>
        </section>
      )}

      {artworks.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-pink-700">Artworks</h2>
          <p className="text-muted-foreground">
            Found {formatPluralItems("artwork", count)} with keyword "{query}"
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {artworks.map(artwork => {
              return (
                <li key={artwork.id} className="w-full">
                  <Link to={`/artworks/${artwork.slug}`}>
                    <Card className="hover-opacity h-full space-y-2">
                      <CardHeader className="flex flex-col items-center space-y-2 p-4">
                        <ImageArtwork className="w-full object-contain">{artwork}</ImageArtwork>

                        <div className="flex-grow" />

                        <CardTitle className="text-2xl">{artwork.title}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {artists.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-pink-700">Artists</h2>
          <p className="text-muted-foreground">
            Found {formatPluralItems("artist", count)} with keyword "{query}"
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {artists.map(artist => {
              return (
                <li key={artist.id} className="w-full">
                  <Link to={`/artists/${artist.slug}`}>
                    <Card className="hover-opacity h-full space-y-2">
                      <CardHeader className="flex items-center gap-2 p-4">
                        <AvatarAuto
                          src={artist.image?.url}
                          alt={`${artist.name}`}
                          fallback={getNameInitials(artist.name)}
                          className="h-20 w-20"
                        />

                        <CardTitle className="text-2xl">{artist.name}</CardTitle>
                      </CardHeader>
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
