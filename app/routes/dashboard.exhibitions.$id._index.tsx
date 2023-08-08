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
      <header className="space-y-2">
        <p>Exhibition</p>
        <p>
          <b>ID: </b>
          {exhibition.id}
        </p>
        <div className="flex items-center gap-2">
          <Button asChild size="xs">
            <Link to={`/exhibitions/${exhibition.slug}`}>View</Link>
          </Button>
          <Button asChild size="xs" variant="secondary">
            <Link to="edit">Edit</Link>
          </Button>
          <Form>
            <Button size="xs" variant="destructive">
              Delete
            </Button>
          </Form>
        </div>
      </header>

      <section className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1>{exhibition.title}</h1>

          <ul>
            <li>
              <b>ID: </b>
              <code>{exhibition.id}</code>
            </li>
            <li>
              <b>Edition: </b>
              <code>{exhibition.edition}</code>
            </li>
            <li>
              <b>Slug: </b>
              <code>{exhibition.slug}</code>
            </li>
            <li>
              <b>Date: </b>
              <time>{formatDateAndRelative(exhibition.date)}</time>
            </li>
          </ul>

          <p>{exhibition.description}</p>
        </div>

        <ImageExhibition className="max-w-xs object-contain">{exhibition}</ImageExhibition>
      </section>

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
