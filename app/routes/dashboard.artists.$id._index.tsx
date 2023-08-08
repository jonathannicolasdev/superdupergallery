import { json, redirect } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, getNameInitials } from "~/utils"
import { AvatarAuto, Button, Card, ImageArtwork } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  const artist = await prisma.artist.findFirst({
    where: { id: params.id },
    include: {
      image: true,
      artworks: {
        include: {
          images: { select: { url: true } },
        },
      },
    },
  })
  if (!artist) return redirect("..")
  return json({ artist })
}

export default function Route() {
  const { artist } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="space-y-2">
        <p>
          Artist: <code>{artist.id}</code>
        </p>
        <div className="flex items-center gap-2">
          <Button asChild size="xs">
            <Link to={`/artists/${artist.slug}`}>View</Link>
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
          <h1>{artist.name}</h1>

          <ul>
            <li>
              <b>Slug: </b>
              <code>{artist.slug}</code>
            </li>
          </ul>

          <p>{artist.bio}</p>
        </div>

        <AvatarAuto
          className="h-32 w-32 "
          src={artist.image?.url}
          alt={artist.name}
          fallback={getNameInitials(artist.name)}
        />
      </section>

      {artist?.artworks.length > 0 && (
        <section className="space-y-4">
          <p>
            {formatPluralItems("artwork", artist.artworks.length)} by {artist.name}
          </p>

          <ul className="grid grid-cols-2 gap-4">
            {artist.artworks.map(artwork => {
              return (
                <li key={artwork.id}>
                  <Card className="flex items-center gap-4">
                    <Link to={`/dashboard/artworks/${artwork.id}`} className="hover-opacity ">
                      <ImageArtwork className="h-32 w-32 object-contain">{artwork}</ImageArtwork>
                    </Link>
                    <div>
                      <h6>{artwork.title}</h6>
                      <p>{artwork.year}</p>
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
