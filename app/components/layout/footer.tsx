import { Link } from "@remix-run/react"

import { cn } from "~/libs"
import { Anchor } from "~/components"

const footerNavItems = [
  { to: "search", text: "Search" },
  { to: "login", text: "Login" },
]

interface Props {
  className?: string
}

export function Footer({ className }: Props) {
  const today = new Date()

  return (
    <footer className={cn("flex justify-center pb-20 pt-80 lg:pb-10", className)}>
      <div className="flex flex-col flex-wrap items-center justify-center gap-4 text-muted-foreground sm:flex-row sm:gap-8">
        <p>
          <span>&copy; {today.getFullYear()} </span>
          <Anchor href="https://github.com/superdupergallery">🐈 Super Duper Gallery</Anchor>
        </p>

        {/* <FooterNavigation /> */}
      </div>
    </footer>
  )
}

export function FooterNavigation() {
  return (
    <nav>
      <ul className="flex flex-wrap gap-4">
        {footerNavItems.map(navItem => {
          return (
            <li key={navItem.to}>
              <Link to={navItem.to} className="hover-opacity font-bold">
                {navItem.text}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
