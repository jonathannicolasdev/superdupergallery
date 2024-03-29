import { NavLink } from "@remix-run/react"

import { cn } from "~/libs"

type NavItem = {
  to: string
  text: string
  icon?: React.ReactNode
}

const navPublicItems: NavItem[] = [
  { to: "/artworks", text: "Artworks" },
  { to: "/artists", text: "Artists" },
  { to: "/exhibitions", text: "Exhibitions" },
  { to: "/search", text: "Search" },
  { to: "/about", text: "About" },
  // { to: "/contact", text: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="w-full max-w-7xl p-4">
      <div className="flex flex-wrap justify-between rounded border-2 border-white lg:flex-nowrap">
        <div className="flex w-full justify-center border-white p-2 sm:max-w-[250px] sm:justify-start">
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src="/images/superdupergallery.png"
              alt="Super Duper Gallery"
              className="h-28 w-28"
            />
            <span className="flex flex-col justify-center gap-1 text-2xl font-bold uppercase">
              <span>Super</span>
              <span>Duper</span>
              <span>Gallery</span>
            </span>
          </NavLink>
        </div>

        <div className="hidden w-full max-w-[200px] items-center justify-center border-white px-6 py-2 sm:flex sm:border-l-2">
          <p>Contemporary Art Gallery based in 🇵🇭 QC, Philippines</p>
        </div>

        <nav className="flex w-full items-center justify-center border-t-2 border-white px-10 py-4 lg:border-l-2 lg:border-t-0">
          <ul className="flex flex-wrap justify-center gap-4">
            {navPublicItems.map(navItem => {
              return (
                <li key={navItem.to}>
                  <NavLink
                    to={navItem.to}
                    className={({ isActive }) => {
                      return cn(
                        "border-b-4 border-b-black pb-2 text-sm font-bold uppercase tracking-widest hover:border-b-4 sm:text-base md:text-lg",
                        isActive
                          ? "dark:border-b-pink-900 dark:hover:border-b-pink-600"
                          : "hover:border-b-zinc-600",
                      )
                    }}
                  >
                    {navItem.text}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
