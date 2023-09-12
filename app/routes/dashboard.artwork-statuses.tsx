import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"

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

      <section>
        <ul className="max-w-xs space-y-1">
          {artworkStatuses.map(artworkStatus => {
            return (
              <li key={artworkStatus.id}>
                <Card withBorder className="px-2 py-1">
                  <h6>{artworkStatus.name}</h6>
                </Card>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
