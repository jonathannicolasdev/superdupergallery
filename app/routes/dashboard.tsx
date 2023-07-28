import { type LoaderArgs } from "@remix-run/node"
import { Link } from "@remix-run/react"

import { authenticator } from "~/services/auth.server"
import { useRootLoaderData } from "~/hooks"
import { Button, Layout } from "~/components"

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" })
  return null
}

export default function DashboardRoute() {
  const { userData } = useRootLoaderData()

  if (!userData) {
    return <p>Sorry something went wrong</p>
  }

  return (
    <Layout
      hasHeader={false}
      hasFooter={false}
      className="space-y-8 p-4 sm:px-8"
    >
      <header>
        <p className="text-muted-foreground">
          This is the Administration dashboard. You're logged in as{" "}
          <b>{userData?.name}</b>
        </p>
        <Button asChild size="sm" type="submit" variant="destructive">
          <Link to="/logout">Logout</Link>
        </Button>
      </header>
    </Layout>
  )
}
