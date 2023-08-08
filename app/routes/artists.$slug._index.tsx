import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems, getNameInitials } from "~/utils"
import { AvatarAuto, Button, Card, CardHeader, CardTitle, ImageArtwork, Layout } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, "Artist slug not found")

  const artist = await prisma.artist.findFirst({
    where: { slug: params.slug },
    include: {
      image: true,
      artworks: {
        include: {
          images: {
            select: { url: true },
          },
        },
      },
    },
  })
  if (!artist) return notFound({ artist: null })

  return json({ artist }, { headers: createCacheHeaders(request, 10) })
}

export default function ArtistsRoute() {
  const params = useParams()
  const { artist } = useLoaderData<typeof loader>()

  if (!artist) {
    return (
      <Layout className="px-4 sm:px-8">
        <section className="flex flex-col items-center justify-center pt-4">
          <div className="flex max-w-md flex-col justify-center space-y-4 pt-24 text-center">
            <img
              src="/images/cat-sunset.png"
              alt="Not Found Illustration"
              className="h-40 object-contain"
            />
            <h2>
              Artist <span className="text-pink-500">"{params.slug}"</span> is not found
            </h2>
            <Button asChild>
              <Link to="/artists">Back to All Artists</Link>
            </Button>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout className="flex justify-center p-10">
      <div className="space-y-10">
        <header className="flex flex-col items-center space-y-2">
          <AvatarAuto
            className="mb-4 h-32 w-32 "
            src={artist.image?.url}
            alt={artist.name}
            fallback={getNameInitials(artist.name)}
          />

          <h1 className="flex">
            <Link to={`/artists/${artist.slug}`} className="hover-opacity">
              {artist.name || "Unknown Title"}
            </Link>
          </h1>
          <p>{artist.bio || "(Artist has no bio)"}</p>
          <p>{formatPluralItems("artwork", artist.artworks.length)}</p>
        </header>

        <section>
          {artist.artworks.length > 0 && (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {artist.artworks.map(artwork => {
                return (
                  <li key={artwork.id} className="w-full">
                    <Link to={`/artworks/${artwork.slug}`}>
                      <Card className="hover-opacity h-full space-y-2">
                        <CardHeader className="flex flex-col items-center space-y-2 p-4">
                          <ImageArtwork className="w-full object-contain">{artwork}</ImageArtwork>

                          <div className="flex-grow" />

                          <CardTitle className="text-center text-2xl">{artwork.title}</CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  )
}
