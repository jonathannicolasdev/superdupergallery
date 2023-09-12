import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { navItems } from "~/configs"
import { prisma } from "~/libs"
import { requireUserSession } from "~/utils"
import { Badge, Card } from "~/components"

export async function loader({ request }: LoaderArgs) {
  const { userSession, userData } = await requireUserSession(request)

  const counts = await prisma.$transaction([
    prisma.user.count(),
    prisma.exhibition.count(),
    prisma.artist.count(),
    prisma.artwork.count(),
  ])

  const metrics = navItems
    .filter(item => item.isMetric)
    .map((item, index) => {
      return { ...item, count: counts[index] }
    })

  return json({ userSession, userData, metrics })
}

export default function Route() {
  const { userData, metrics } = useLoaderData<typeof loader>()

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1>Dashboard</h1>
        <div className="space-y-2">
          <p>Welcome, {userData.name}!</p>
          <Badge>{userData.role?.name}</Badge>
        </div>
      </header>

      <section className="px-layout space-y-2">
        <p>Database Metrics/Statistics</p>
        <div className="grid max-w-3xl grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {metrics.map(metric => {
            return (
              <Link key={metric.name} to={metric.to}>
                <Card withBorder className="hover-opacity p-4 text-center">
                  <p className="text-6xl font-extrabold">{metric.count}</p>
                  <span>{metric.name}</span>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
