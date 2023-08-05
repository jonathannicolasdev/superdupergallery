import { json, redirect } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatDateOnly, formatPluralItems } from "~/utils"
import { Card, Image } from "~/components"

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
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-4">
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
            <span>Date Time: </span>
            <time>{formatDateOnly(String(exhibition.date))}</time>
          </p>
        </div>

        <Image
          src={`${exhibition.images[0].url}`}
          alt={`${exhibition.title}`}
          className="max-w-xs object-contain"
        />
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
                      <Image
                        src={`${artwork.images[0].url}`}
                        alt={`${artwork.title}`}
                        className="h-32 w-full object-contain"
                      />
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
