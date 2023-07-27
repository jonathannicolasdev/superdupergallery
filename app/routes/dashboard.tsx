import { type LoaderArgs } from "@remix-run/node"
import { Link } from "@remix-run/react"

import { authenticator } from "~/services/auth.server"
import { useRootLoaderData } from "~/hooks"
import { Button, Layout, UserCard } from "~/components"

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
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header>
        <span>Welcome,</span>
        <Link to="/dashboard">
          <h1 className="hover-opacity text-brand">{userData?.name}</h1>
        </Link>
        <p className="text-muted-foreground">This is your dashboard.</p>
      </header>

      <section className="space-y-2">
        <h4>Your profile card:</h4>
        <Link to={`/${userData.username}`} className="block">
          <UserCard user={userData as any} />
        </Link>
      </section>

      <section className="flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <Link to="/settings">Settings</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/settings/profile">Edit Profile</Link>
        </Button>
        <Button asChild type="submit" variant="destructive">
          <Link to="/logout">Logout</Link>
        </Button>
      </section>
    </Layout>
  )
}
