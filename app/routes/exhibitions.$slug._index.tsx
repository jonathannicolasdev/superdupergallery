import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders, formatDateOnly } from "~/utils"
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Image,
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

export default function ExhibitionsRoute() {
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
              className="h-40 object-contain"
            />
            <h2>
              Exhibition <span className="text-pink-500">"{params.slug}"</span>{" "}
              is not found
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
    <Layout className="flex justify-center p-10">
      <div className="flex w-full flex-col flex-wrap justify-center gap-10 sm:flex-row">
        {exhibition.images?.length > 0 && exhibition.images[0]?.url && (
          <img
            src={`${exhibition.images[0].url}`}
            alt={`${exhibition.title}`}
            className="h-100 w-100 object-contain"
          />
        )}

        <header className="space-y-4">
          <h1 className="flex">
            <Link
              to={`/exhibitions/${exhibition.slug}`}
              className="hover-opacity"
            >
              {exhibition.title || "Unknown Title"}
            </Link>
          </h1>

          <div className="space-y-4">
            <p>{formatDateOnly(String(exhibition.date))}</p>
          </div>

          {exhibition?.artists.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {exhibition.artists.map(artist => {
                return (
                  <Link
                    key={artist.id}
                    to={`/artists/${artist.slug}`}
                    className="hover-opacity"
                  >
                    <span className="text-xl font-bold">{artist.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </header>

        {exhibition?.artworks.length > 0 && (
          <section>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {exhibition.artworks.map(artwork => {
                return (
                  <li key={artwork.id} className="w-full">
                    <Link to={`/artworks/${artwork.slug}`}>
                      <Card className="hover-opacity h-full space-y-2">
                        <CardHeader className="flex flex-col items-center space-y-2 p-4">
                          {artwork.images?.length > 0 &&
                            artwork.images[0]?.url && (
                              <Image
                                src={`${artwork.images[0].url}`}
                                alt={`${artwork.title}`}
                                className="h-60 w-60 object-contain"
                              />
                            )}

                          <div className="flex-grow" />

                          <CardTitle className="text-center text-2xl">
                            {artwork.title}
                          </CardTitle>
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
