import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatDateAndRelative, formatPluralItems, formatTitle } from "~/utils"
import { Card, ImageExhibition } from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Exhibitions`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { edition: "desc" },
    include: { images: true, artworks: true, artists: true },
  })
  return json({ count: exhibitions.length, exhibitions })
}

export default function RouteComponent() {
  const { count, exhibitions } = useLoaderData<typeof loader>()
  return (
    <>
      <header>
        <h1 className="flex items-center gap-2 text-4xl text-brand">Exhibitions</h1>
        <p>{formatPluralItems("exhibition", count)}</p>
      </header>

      {count > 0 && (
        <section>
          <ul className="space-y-4">
            {exhibitions.map(exhibition => {
              return (
                <li key={exhibition.id}>
                  <Link to={`/dashboard/exhibitions/${exhibition.id}`}>
                    <Card className="hover-opacity grid max-w-xl grid-cols-4 items-center gap-4">
                      <ImageExhibition className="h-24 object-contain">
                        {exhibition}
                      </ImageExhibition>

                      <div className="col-span-3">
                        <h4>{exhibition.title}</h4>
                        <div className="text-muted-foreground">
                          <p>{exhibition.slug}</p>
                          <p>
                            <time>{formatDateAndRelative(exhibition.date)}</time>
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
