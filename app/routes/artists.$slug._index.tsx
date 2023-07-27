import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders } from "~/utils"
import { Button, Layout } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, "Artist slug not found")

  const artist = await prisma.artist.findFirst({
    where: { slug: params.slug },
    include: {
      image: true,
      artworks: true,
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
              Artist <span className="text-pink-500">"{params.slug}"</span> is
              not found
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
    <Layout className="flex justify-center pt-10">
      <div className="flex w-full max-w-xl flex-wrap gap-10">
        {artist.image?.url && (
          <img
            src={`${artist.image.url}`}
            alt={`${artist.name}`}
            className="h-80 w-80"
          />
        )}

        <header className="space-y-2">
          <h1 className="flex">
            <Link to={`/artists/${artist.slug}`} className="hover-opacity">
              {artist.name || "Unknown Title"}
            </Link>
          </h1>
          <p>{artist.bio}</p>
        </header>
      </div>
    </Layout>
  )
}
