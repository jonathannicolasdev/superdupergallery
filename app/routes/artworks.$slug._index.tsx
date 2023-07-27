import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders } from "~/utils"
import { Layout } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, "Artwork slug not found")

  const artwork = await prisma.artwork.findFirst({
    where: { slug: params.slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          nick: true,
          avatars: { select: { url: true } },
        },
      },
    },
  })
  if (!artwork) return notFound({ artwork: null })

  return json({ artwork }, { headers: createCacheHeaders(request, 10) })
}

export default function ArtworksRoute() {
  const { artwork } = useLoaderData<typeof loader>()

  if (!artwork) return null

  return (
    <Layout className="flex justify-center pt-10">
      <div className="w-full max-w-xl space-y-6">
        <header className="space-y-2">
          <h1 className="flex">
            <Link to={`/artworks/${artwork.slug}`} className="hover-opacity">
              {artwork.title || "Unknown Title"}
            </Link>
          </h1>
          <p>Medium: {artwork.medium || "Unknown Medium"}</p>
          <p>Size: {artwork.size || "Unknown Size"}</p>
        </header>
      </div>
    </Layout>
  )
}
