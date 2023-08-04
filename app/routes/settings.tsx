import type { LoaderArgs } from "@remix-run/node"
import { Link, NavLink, Outlet } from "@remix-run/react"

import { authenticator } from "~/services/auth.server"
import { cn } from "~/libs"
import { buttonVariants, Layout } from "~/components"

export const settingsNavItems = [
  { title: "General", to: "/settings/general" },
  { title: "Profile", to: "/settings/profile" },
  { title: "Email", to: "/settings/email" },
  { title: "Password", to: "/settings/password" },
  { title: "Account", to: "/settings/account" },
  { title: "Appearance", to: "/settings/appearance" },
  { title: "Notifications", to: "/settings/notifications" },
  { title: "Display", to: "/settings/display" },
]

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" })
  return null
}

export default function Route() {
  return (
    <Layout className="px-4 sm:px-8">
      <header className="py-10">
        <Link to="/settings">
          <h1 className="hover-opacity text-brand">Settings</h1>
        </Link>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </header>

      <div className="flex max-w-4xl flex-col gap-8 sm:-mx-4 sm:flex-row">
        {/* Maximum width is less than xs */}
        <aside className="w-full sm:block sm:max-w-[240px]">
          <SidebarNav items={settingsNavItems} />
        </aside>

        <Outlet />
      </div>
    </Layout>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  return (
    <nav className={cn("flex w-full gap-2 overflow-auto sm:flex-col", className)} {...props}>
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: "ghost" }),
              isActive ? "bg-pink-950 hover:bg-pink-900" : "hover:bg-muted",
              "justify-start",
            )
          }
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  )
}
