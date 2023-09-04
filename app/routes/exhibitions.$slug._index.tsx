import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { LocationIcon } from "@primer/octicons-react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { cn, prisma } from "~/libs"
import {
  createCacheHeaders,
  formatDateAndRelative,
  formatPluralItems,
  getColorFromString,
} from "~/utils"
import {
  Anchor,
  Button,
  Card,
  CardHeader,
  CardTitle,
  ImageArtwork,
  ImageExhibition,
  Layout,
} from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, "Exhibition slug not found")

  const exhibition = await prisma.exhibition.findFirst({
    where: { slug: params.slug },
    include: {
      images: true,
      artworks: {
        include: {
          images: {
            select: {
              url: true,
            },
          },
        },
      },
      artists: true,
    },
  })
  if (!exhibition) return notFound({ exhibition: null })

  return json({ exhibition }, { headers: createCacheHeaders(request, 10) })
}

export const predefinedArtistColors = [
  "text-red-500",
  "text-orange-500",
  "text-amber-500",
  "text-yellow-500",
  "text-lime-500",
  "text-green-500",
  "text-emerald-500",
  "text-teal-500",
  "text-cyan-500",
  "text-sky-500",
  "text-blue-500",
  "text-indigo-500",
  "text-violet-500",
  "text-purple-500",
  "text-fuchsia-500",
  "text-pink-500",
  "text-rose-500",
]

export default function Route() {
  const params = useParams()
  const { exhibition } = useLoaderData<typeof loader>()

  if (!exhibition) {
    return (
      <Layout className="px-4 sm:px-8">
        <section className="flex flex-col items-center justify-center pt-4">
          <div className="flex max-w-md flex-col justify-center space-y-4 pt-24 text-center">
            <img
              src="/images/cat-sunset.png"
              alt="Not Found Illustration"
              className="h-40 rounded object-contain"
            />
            <h2>
              Exhibition <span className="text-pink-500">"{params.slug}"</span> is not found
            </h2>
            <Button asChild>
              <Link to="/exhibitions">Back to All Exhibitions</Link>
            </Button>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout className="flex justify-center px-4">
      <div className="flex w-full flex-col flex-wrap gap-10 sm:flex-row">
        <header className="flex w-full justify-center">
          <div className="flex flex-col justify-center space-y-4">
            <ImageExhibition className="h-80 object-contain">{exhibition}</ImageExhibition>

            <h1 className="flex justify-center">
              <Link to={`/exhibitions/${exhibition.slug}`} className="hover-opacity">
                {exhibition.title}
              </Link>
            </h1>

            <div className="space-y-2 text-center">
              <p>Exhibition #{exhibition.edition}</p>

              <p className="space-y-4">
                <time>{formatDateAndRelative(exhibition.date)}</time>
              </p>

              <p className="flex justify-center">
                <Anchor
                  href="https://goo.gl/maps/3D1xSmpc9Qc6eaD17"
                  className="flex items-center gap-2"
                >
                  <LocationIcon size="small" />
                  <span>Maps to the Gallery</span>
                </Anchor>
              </p>
            </div>

            <div className="flex justify-center">
              <p className="prose dark:prose-invert max-w-lg whitespace-pre-wrap">
                {exhibition.description}
              </p>
            </div>
          </div>
        </header>

        {exhibition?.artists.length > 0 && (
          <section className="flex flex-col justify-center space-y-4">
            <p>{formatPluralItems("artist", exhibition.artists.length)}</p>
            <ul className="flex flex-wrap gap-4">
              {exhibition.artists.map(artist => {
                return (
                  <Link key={artist.id} to={`/artists/${artist.slug}`} className="hover-opacity">
                    <span
                      className={cn(
                        "text-xl font-bold",
                        `text-${getColorFromString(artist.slug)}-500`,
                      )}
                    >
                      {artist.name}
                    </span>
                  </Link>
                )
              })}
            </ul>
          </section>
        )}

        {exhibition?.artworks.length > 0 && (
          <section className="space-y-4">
            <p>{formatPluralItems("artwork", exhibition.artworks.length)}</p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {exhibition.artworks.map(artwork => {
                return (
                  <li key={artwork.id} className="w-full">
                    <Link to={`/artworks/${artwork.slug}`}>
                      <Card className="hover-opacity h-full space-y-2">
                        <CardHeader className="flex flex-col items-center space-y-2">
                          <ImageArtwork className="h-60 w-60 object-contain">
                            {artwork}
                          </ImageArtwork>
                          <CardTitle className="text-center text-2xl">{artwork.title}</CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>
    </Layout>
  )
}
