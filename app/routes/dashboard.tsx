import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Link, NavLink, Outlet } from "@remix-run/react"

import { cn } from "~/libs"
import { requireUserSession } from "~/utils"
import { Button, buttonVariants } from "~/components"

const navItems = [
  { to: "/dashboard", name: "Overview", icon: "dashboard", items: [], end: true },
  {
    to: "users",
    name: "Users",
    icon: "users",
    isMetric: true,
    items: [{ to: "user-roles", name: "User Roles", icon: "userRole" }],
  },
  { to: "images", name: "Images", icon: "images", isMetric: true, items: [] },
  {
    to: "artworks",
    name: "Artworks",
    icon: "artworks",
    isMetric: true,
    items: [
      { to: "artwork-statuses", name: "Artwork Statuses", icon: "artworkStatus" },
      { to: "artwork-categories", name: "Artwork Categories", icon: "artworkCategory" },
      { to: "artwork-tags", name: "Artwork Tags", icon: "artworkTag" },
      { to: "artwork-images", name: "Artwork Images", icon: "artworkImage" },
    ],
  },
  { to: "/admin/search", name: "Search on Admin", icon: "searchAdmin", items: [] },
  { to: "/search", name: "Search on Site", icon: "search", items: [] },
  { to: "/", name: "Go to site", icon: "appWindow", items: [] },
]

export async function loader({ request }: LoaderArgs) {
  const { userIsAllowed } = await requireUserSession(request, ["ADMIN", "MANAGER", "EDITOR"])
  if (!userIsAllowed) {
    return redirect(`/`)
  }
  return null
}

export default function DashboardRoute() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="grow pb-10">{children}</main>
    </div>
  )
}

export function AdminSidebar() {
  return (
    <aside
      className={cn(
        "hidden sm:block",
        "sticky top-0 h-screen", // sticky sidebar
        "min-w-fit space-y-4 p-2 sm:flex sm:flex-col sm:p-4",
        "border-r-2 border-white bg-background",
      )}
    >
      <div className="flex items-center justify-between">
        <NavLink
          prefetch="intent"
          to="/"
          className="block min-w-fit transition-opacity hover:opacity-80"
        >
          <img
            src="/images/superdupergallery.png"
            alt="Super Duper Gallery"
            className="h-12 w-12"
          />
        </NavLink>
        <div className="flex items-center">
          <Button asChild size="xs" type="submit" variant="destructive">
            <Link to="/logout">Logout</Link>
          </Button>
        </div>
      </div>

      <ul className="grow space-y-2">
        {/* <SearchForm action="/admin/search" /> */}
        {navItems.map(navItem => {
          return (
            <li key={navItem.name} className="space-y-1">
              <NavLink
                key={navItem.name}
                to={navItem.to}
                prefetch="intent"
                end={navItem.end}
                className={({ isActive }) =>
                  cn(
                    "w-full",
                    buttonVariants({
                      variant: "navlink",
                      align: "left",
                      isActive,
                    }),
                  )
                }
              >
                {/* <Icon name={navItem.icon} /> */}
                <span>{navItem.name}</span>
              </NavLink>
              {navItem.items.length > 0 && (
                <ul className="ms-4 space-y-1">
                  {navItem.items.map(item => {
                    return (
                      <li key={item.name}>
                        <NavLink
                          key={item.name}
                          to={item.to}
                          prefetch="intent"
                          className={({ isActive }) =>
                            cn(
                              "w-full",
                              buttonVariants({
                                variant: "navlink",
                                align: "left",
                                isActive,
                              }),
                            )
                          }
                        >
                          <span>{item.name}</span>
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export async function action({ request }: ActionArgs) {
  const { userIsAllowed } = await requireUserSession(request, ["ADMIN", "MANAGER", "EDITOR"])
  if (!userIsAllowed) {
    return redirect(`/`)
  }
  return null
}
