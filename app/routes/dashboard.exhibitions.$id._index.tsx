import { json, redirect } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatDateAndRelative, formatPluralItems } from "~/utils"
import { Button, Card, ImageArtwork, ImageExhibition } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  const exhibition = await prisma.exhibition.findFirst({
    where: { id: params.id },
    include: {
      images: true,
      artworks: {
        include: {
          images: { select: { url: true } },
          artist: true,
        },
      },
    },
  })
  if (!exhibition) return redirect("..")
  return json({ exhibition })
}

export default function Route() {
  const { exhibition } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="flex flex-wrap justify-between gap-4">
        <div className="space-y-4">
          <p>Exhibition</p>
          <div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link to="edit">Edit</Link>
              </Button>
              <Form>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </Form>
            </div>
            <h1>{exhibition.title}</h1>
            <p>
              <span>ID: </span>
              <code>{exhibition.id}</code>
            </p>
            <p>
              <span>Slug: </span>
              <code>{exhibition.slug}</code>
            </p>
            <p>
              <span>Date: </span>
              <time>{formatDateAndRelative(exhibition.date)}</time>
            </p>
          </div>
        </div>

        <ImageExhibition className="max-w-xs object-contain">{exhibition}</ImageExhibition>
      </header>

      {exhibition?.artworks.length > 0 && (
        <section className="space-y-4">
          <p>
            {formatPluralItems("artwork", exhibition.artworks.length)} in {exhibition.title}
          </p>

          <ul className="grid grid-cols-2 gap-4">
            {exhibition.artworks.map(artwork => {
              return (
                <li key={artwork.id}>
                  <Card className="flex items-center gap-4">
                    <Link to={`/dashboard/artworks/${artwork.id}`} className="hover-opacity ">
                      <ImageArtwork className="h-32 w-32 object-contain">{artwork}</ImageArtwork>
                    </Link>
                    <div>
                      <h6>{artwork.title}</h6>
                      <p>
                        <Link
                          to={`/dashboard/artists/${artwork.artist?.id}`}
                          className="hover-opacity"
                        >
                          {artwork.artist?.name}
                        </Link>
                      </p>
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}
