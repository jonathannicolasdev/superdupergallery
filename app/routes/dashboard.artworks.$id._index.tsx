import { json, redirect } from "@remix-run/node"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { Button, ImageArtwork } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  const artwork = await prisma.artwork.findFirst({
    where: { id: params.id },
    include: {
      images: true,
      artist: true,
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
        <div className="space-y-2">
          <h1>{artwork.title}</h1>
          <ul>
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
              <b>Artist Name: </b>
              <Link to={`/dashboard/artists/${artwork.artist?.id}`}>
                <span>{artwork.artist?.name}</span>
              </Link>
            </li>
          </ul>
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
