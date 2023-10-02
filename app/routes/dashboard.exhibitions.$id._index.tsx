import { json, redirect } from "@remix-run/node"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import {
  formatDateAndRelative,
  formatNumberToPHP,
  formatPluralItems,
  getNameInitials,
} from "~/utils"
import {
  AvatarAuto,
  Badge,
  Button,
  ButtonLink,
  Card,
  CardDescription,
  CardTitle,
  ImageArtwork,
  ImageExhibition,
} from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  const exhibition = await prisma.exhibition.findFirst({
    where: { id: params.id },
    include: {
      images: true,
      artworks: {
        include: {
          images: { select: { url: true } },
          artist: true,
          status: true,
        },
      },
      artists: {
        include: {
          image: { select: { url: true } },
          artworks: { select: { id: true } },
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
        <Link to={`/dashboard/exhibitions/${exhibition.id}`}>
          Exhibition: <code>{exhibition.id}</code>
        </Link>
        <div className="flex items-center gap-2">
          <ButtonLink size="xs" to={`/exhibitions/${exhibition.slug}`}>
            View
          </ButtonLink>
          <ButtonLink size="xs" variant="secondary" to="edit">
            Edit
          </ButtonLink>
          <Form method="DELETE">
            <Button size="xs" variant="destructive">
              Delete
            </Button>
          </Form>
        </div>
      </header>

      <section className="flex flex-wrap items-start gap-4">
        <ImageExhibition className="max-w-xs object-contain">{exhibition}</ImageExhibition>

        <div className="space-y-2">
          <h1>{exhibition.title}</h1>

          <ul>
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
            <p>{exhibition.isPublished ? "✅ Published" : "❌ Unpublished"}</p>
          </ul>

          <div className="prose dark:prose-invert max-w-lg whitespace-pre-wrap">
            {exhibition.description}
          </div>
        </div>
      </section>

      {exhibition?.artists.length > 0 && (
        <section className="flex flex-col justify-center space-y-4">
          <p>
            {formatPluralItems("artist", exhibition.artists.length)} in {exhibition.title}
          </p>

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {exhibition.artists.map(artist => {
              return (
                <li key={artist.id} className="w-full">
                  <Link to={`/dashboard/artists/${artist.id}`}>
                    <Card className="hover-opacity flex max-w-xl items-center gap-4">
                      <AvatarAuto
                        src={artist.image?.url}
                        alt={`${artist.name}`}
                        fallback={getNameInitials(artist.name)}
                        className="h-12 w-12"
                      />

                      <div className="flex flex-col justify-between">
                        <CardTitle className="text-xl">{artist.name}</CardTitle>
                        <CardDescription>
                          {formatPluralItems("artwork", artist.artworks.length)}
                        </CardDescription>
                      </div>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {exhibition?.artworks.length > 0 && (
        <section className="space-y-4">
          <p>
            {formatPluralItems("artwork", exhibition.artworks.length)} in {exhibition.title}
          </p>

          <ul className="grid grid-cols-2 gap-4">
            {exhibition.artworks.map(artwork => {
              return (
                <li key={artwork.id}>
                  <Link to={`/dashboard/artworks/${artwork.id}`} className="hover-opacity">
                    <Card className="hover-opacity grid max-w-xl grid-cols-4 items-center gap-4">
                      <ImageArtwork className="w-full object-contain">{artwork}</ImageArtwork>

                      <div className="col-span-3">
                        <h5>{artwork.title}</h5>
                        <div className="text-sm text-muted-foreground">
                          <p>{artwork.artist?.name}</p>
                          <p>{formatNumberToPHP(artwork.price)}</p>
                          <p className="space-x-2">
                            <span>{artwork.isPublished ? "✅ Published" : "❌ Unpublished"}</span>
                            {artwork.status?.name && <Badge>{artwork.status.name}</Badge>}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}

export const action = async ({ params }: ActionArgs) => {
  await prisma.exhibition.delete({ where: { id: params.id } })

  return redirect(`/dashboard/exhibitions`)
}
