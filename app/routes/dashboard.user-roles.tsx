import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, formatTitle } from "~/utils"
import { Card } from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All User Roles`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const userRoles = await prisma.userRole.findMany({
    orderBy: { sequence: "asc" },
  })
  if (!userRoles) return json({ userRoles: [] })
  return json({ userRoles })
}
export default function RouteComponent() {
  const { userRoles } = useLoaderData<typeof loader>()

  return (
    <>
      <header>
        <h1>User Roles</h1>
        <p className="text-muted-foreground">{formatPluralItems("user role", userRoles.length)}</p>
      </header>

      <section>
        <ul className="space-y-2">
          {userRoles.map(userRole => {
            return (
              <li key={userRole.id}>
                <Card withBorder className="p-2">
                  <h3>{userRole.name}</h3>
                  <p>{userRole.symbol}</p>
                </Card>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
