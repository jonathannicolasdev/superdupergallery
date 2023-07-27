import { NavLink } from "@remix-run/react"

type NavItem = {
  to: string
  text: string
  icon?: React.ReactNode
}

const navPublicItems: NavItem[] = [
  {
    to: "/",
    text: "Home",
  },
  {
    to: "/search",
    text: "Search",
  },
  {
    to: "/artworks",
    text: "Artworks",
  },
  {
    to: "/artists",
    text: "Artists",
  },
  {
    to: "/exhibitions",
    text: "Exhibitions",
  },
]

export function SiteHeader() {
  return (
    <header className="p-4 lg:ml-16">
      <div className="flex flex-wrap justify-between border-4 border-white lg:flex-nowrap">
        <div className="w-full max-w-[250px] border-r-4 border-white p-2">
          <NavLink to="/" className="flex gap-2">
            <img
              src="/images/superdupergallery.png"
              alt="Super Duper Gallery"
              className="h-24 w-24"
            />
            <span className="flex flex-col justify-center gap-1 text-2xl font-bold uppercase">
              <span>Super</span>
              <span>Duper</span>
              <span>Gallery</span>
            </span>
          </NavLink>
        </div>

        <div className="flex w-full max-w-[250px] items-center justify-center p-2">
          <p>Contemporary Art Gallery based in 🇵🇭 QC, Philippines</p>
        </div>

        <nav className="flex w-full items-center justify-center border-t-4 border-white px-10 py-4 lg:border-l-4 lg:border-t-0">
          <ul className="flex flex-wrap gap-4">
            {navPublicItems.map(navItem => {
              return (
                <li key={navItem.to}>
                  <NavLink
                    to={navItem.to}
                    className="border-b-4 border-b-black pb-2 text-lg font-bold uppercase hover:border-b-4 hover:border-b-pink-600"
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
