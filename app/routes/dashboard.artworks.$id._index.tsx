import { json, redirect } from "@remix-run/node"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { getNameInitials } from "~/utils"
import { AvatarAuto, Button, Card, CardTitle, ImageArtwork } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  const artwork = await prisma.artwork.findFirst({
    where: { id: params.id },
    include: {
      images: true,
      artist: {
        include: {
          image: { select: { url: true } },
          artworks: { select: { id: true } },
        },
      },
      exhibition: true,
      status: true,
    },
  })
  if (!artwork) return redirect("..")
  return json({ artwork })
}

export default function Route() {
  const { artwork } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="space-y-2">
        <p>
          Artwork: <code>{artwork.id}</code>
        </p>
        <div className="flex items-center gap-2">
          <Button asChild size="xs">
            <Link to={`/artworks/${artwork.slug}`}>View</Link>
          </Button>
          <Button asChild size="xs" variant="secondary">
            <Link to="edit">Edit</Link>
          </Button>
          <Form method="DELETE">
            <Button size="xs" variant="destructive">
              Delete
            </Button>
          </Form>
        </div>
      </header>

      <section className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-4">
          <h1>{artwork.title}</h1>
          <ul className="space-y-1">
            <li>
              <b>Slug: </b>
              <code>{artwork.slug}</code>
            </li>
            <li>
              <b>Size: </b>
              <span>{artwork.size}</span>
            </li>
            <li>
              <b>Medium: </b>
              <span>{artwork.medium}</span>
            </li>
            <li>
              <b>Year: </b>
              <span>{artwork.year}</span>
            </li>
            <li>
              <b>Exhibition: </b>
              {artwork.exhibition?.id ? (
                <Link
                  to={`/dashboard/exhibitions/${artwork.exhibition.id}`}
                  className="hover-opacity"
                >
                  {artwork.exhibition.title}
                </Link>
              ) : (
                <span>-</span>
              )}
            </li>
          </ul>

          {artwork.artist && (
            <Link to={`/dashboard/artists/${artwork.artist.id}`} className="block">
              <Card className="hover-opacity flex max-w-xl items-center gap-4">
                <AvatarAuto
                  src={artwork.artist.image?.url}
                  alt={`${artwork.artist.name}`}
                  fallback={getNameInitials(artwork.artist.name)}
                  className="h-12 w-12"
                />

                <div className="flex flex-col justify-between">
                  <CardTitle className="text-xl">{artwork.artist.name}</CardTitle>
                </div>
              </Card>
            </Link>
          )}
        </div>

        <ImageArtwork className="w-full max-w-lg object-contain">{artwork}</ImageArtwork>
      </section>
    </>
  )
}

export const action = async ({ params }: ActionArgs) => {
  await prisma.artwork.delete({ where: { id: params.id } })

  return redirect(`/dashboard/artworks`)
}
