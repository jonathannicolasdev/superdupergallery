import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatDateOnly, formatPluralItems, formatTitle } from "~/utils"
import { Card, Image } from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Exhibitions`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { edition: "asc" },
    include: { images: true, artworks: true, artists: true },
  })
  return json({ count: exhibitions.length, exhibitions })
}

export default function RouteComponent() {
  const { count, exhibitions } = useLoaderData<typeof loader>()
  return (
    <>
      <h1 className="flex items-center gap-2 text-4xl text-brand">Exhibitions</h1>

      <section>
        {count <= 0 && <p>No exhibition found</p>}
        {count > 0 && <p>{formatPluralItems("exhibition", count)}</p>}
      </section>

      {count > 0 && (
        <section>
          <ul className="space-y-4">
            {exhibitions.map(exhibition => {
              return (
                <li key={exhibition.id}>
                  <Link to={`/dashboard/exhibitions/${exhibition.id}`}>
                    <Card className="hover-opacity grid max-w-xl grid-cols-4 items-center gap-4">
                      <div>
                        {exhibition.images[0]?.url && (
                          <Image
                            src={`${exhibition.images[0].url}`}
                            alt={`${exhibition.title}`}
                            className="h-24 object-contain"
                          />
                        )}
                      </div>
                      <div className="col-span-3">
                        <h4>
                          {exhibition.edition}. {exhibition.title}
                        </h4>
                        <div className="text-muted-foreground">
                          <p>{exhibition.slug}</p>
                          <p>
                            <time>{formatDateOnly(String(exhibition.date))}</time>
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
