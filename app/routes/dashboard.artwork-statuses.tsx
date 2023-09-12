import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, formatTitle } from "~/utils"
import { Card } from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Artwork Statuses`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const artworkStatuses = await prisma.artworkStatus.findMany({
    orderBy: { sequence: "asc" },
  })
  if (!artworkStatuses) return json({ artworkStatuses: [] })
  return json({ artworkStatuses })
}
export default function RouteComponent() {
  const { artworkStatuses } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="space-y-2">
        <p>Artwork Statuses</p>
        <p className="text-muted-foreground">
          {formatPluralItems("artwork status", artworkStatuses.length)}
        </p>
      </header>

      <section className="space-y-2">
        <p>Filter by status</p>
        <ul className="max-w-[150px] space-y-1">
          {artworkStatuses.map(artworkStatus => {
            return (
              <li key={artworkStatus.id}>
                <Link to={`/dashboard/artworks?status=${artworkStatus.symbol}`}>
                  <Card withBorder className="px-2 py-1">
                    <p>{artworkStatus.name}</p>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
