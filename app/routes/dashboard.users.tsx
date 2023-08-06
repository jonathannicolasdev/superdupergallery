import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, formatTitle } from "~/utils"
import { Badge, Card } from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Users`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const users = await prisma.user.findMany({
    orderBy: { name: "desc" },
    include: {
      role: true,
    },
  })
  if (!users) return json({ users: [] })
  return json({ users })
}
export default function RouteComponent() {
  const { users } = useLoaderData<typeof loader>()

  return (
    <>
      <header>
        <h1>Users</h1>
        <p className="text-muted-foreground">{formatPluralItems("user", users.length)}</p>
      </header>

      <section>
        <ul className="space-y-2">
          {users.map(user => {
            return (
              <li key={user.id}>
                <Card hasBorder className="p-2">
                  <h3>{user.name}</h3>
                  <p>{user.username}</p>
                  <Badge>{user.role?.name}</Badge>
                </Card>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
