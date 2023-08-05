import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders, getNameInitials } from "~/utils"
import { AvatarAuto, Badge, Button, ImageArtwork, Layout } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, "Artwork slug not found")

  const artwork = await prisma.artwork.findFirst({
    where: { slug: params.slug },
    include: {
      images: true,
      artist: { include: { image: { select: { url: true } } } },
      status: true,
    },
  })
  if (!artwork) return notFound({ artwork: null })

  return json({ artwork }, { headers: createCacheHeaders(request, 10) })
}

export default function ArtworksRoute() {
  const params = useParams()
  const { artwork } = useLoaderData<typeof loader>()

  if (!artwork) {
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
              Artwork <span className="text-pink-500">"{params.slug}"</span> is not found
            </h2>
            <Button asChild>
              <Link to="/artworks">Back to All Artworks</Link>
            </Button>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout className="flex justify-center p-10">
      <div className="flex w-full flex-col flex-wrap justify-center gap-10 sm:flex-row">
        <ImageArtwork className="h-100 w-fuull object-contain">{artwork}</ImageArtwork>

        <header className="space-y-8">
          <div className="flex">
            {artwork.artist && (
              <Link
                to={`/artists/${artwork.artist.slug}`}
                className="hover-opacity flex items-center gap-2"
              >
                <AvatarAuto
                  className="h-10 w-10"
                  src={artwork.artist.image?.url}
                  alt={artwork.artist.name}
                  fallback={getNameInitials(artwork.artist.name)}
                />
                <span className="text-xl font-bold">{artwork.artist.name}</span>
              </Link>
            )}
          </div>

          <h1 className="flex">
            <Link to={`/artworks/${artwork.slug}`} className="hover-opacity">
              {artwork.title || "Unknown Title"}
            </Link>
          </h1>

          <div className="space-y-4">
            <p>{artwork.year}</p>
            <p>Medium: {artwork.medium || "Unknown Medium"}</p>
            <p>Size: {artwork.size || "Unknown Size"}</p>
            <p className="flex items-center gap-2">
              <span>Status: </span>
              <Badge>{artwork.status?.name}</Badge>
            </p>
          </div>
        </header>
      </div>
    </Layout>
  )
}
