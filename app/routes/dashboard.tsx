import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, Link, NavLink, Outlet } from "@remix-run/react"
import { parse } from "@conform-to/react"
import { PlusIcon } from "@radix-ui/react-icons"

import { navItems } from "~/configs"
import { cn } from "~/libs"
import { requireUserSession } from "~/utils"
import { Button, buttonVariants } from "~/components"
import { model } from "~/models"

export async function loader({ request }: LoaderArgs) {
  const { userIsAllowed } = await requireUserSession(request, ["ADMIN", "MANAGER", "EDITOR"])
  if (!userIsAllowed) {
    return redirect(`/`)
  }
  return null
}

export default function DashboardRoute() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="mb-20 grow space-y-8 px-4 pb-20 pt-4">{children}</main>
    </div>
  )
}

export function DashboardSidebar() {
  return (
    <aside
      className={cn(
        "hidden sm:block",
        "sticky top-0 h-screen", // sticky sidebar
        "min-w-fit space-y-4 p-4 sm:flex sm:flex-col",
        "border-r-2 border-white/50 bg-black",
      )}
    >
      <section className="flex items-center justify-between">
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
      </section>

      <ul className="grow space-y-2">
        {/* <SearchForm action="/admin/search" /> */}
        {navItems.map(navItem => {
          return (
            <li key={navItem.name} className="space-y-1">
              <div className="flex items-center gap-2">
                <NavLink
                  key={navItem.name}
                  to={navItem.to}
                  prefetch="intent"
                  end={navItem.end}
                  className={({ isActive }) =>
                    cn(
                      "block w-full",
                      buttonVariants({
                        variant: "navlink",
                        size: "navlink",
                        align: "left",
                        isActive,
                      }),
                    )
                  }
                >
                  {/* <Icon name={navItem.icon} /> */}
                  <span>{navItem.name}</span>
                </NavLink>

                {navItem.intent && (
                  <Form method="POST">
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      name="intent"
                      value={navItem.intent}
                    >
                      <PlusIcon />
                    </Button>
                  </Form>
                )}
              </div>

              {navItem?.items && navItem.items.length > 0 && (
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
                              buttonVariants({ variant: "navlink", align: "left", isActive }),
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
  if (!userIsAllowed) return redirect(`/`)

  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  const parsed = parse(formData)
  const { intent } = parsed.payload

  if (intent === "add-exhibition") {
    const { exhibition } = await model.exhibition.mutation.addNewExhibition()
    if (!exhibition) return null
    return redirect(`/dashboard/exhibitions/${exhibition.id}/edit`)
  }

  if (intent === "add-artist") {
    const { artist } = await model.artist.mutation.addNewArtist()
    if (!artist) return null
    return redirect(`/dashboard/artists/${artist.id}/edit`)
  }

  if (intent === "add-artwork") {
    const { artwork } = await model.artwork.mutation.addNewArtwork()
    if (!artwork) return null
    return redirect(`/dashboard/artworks/${artwork.id}/edit`)
  }

  return null
}
