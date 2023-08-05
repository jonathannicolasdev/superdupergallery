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
    <footer className={cn("flex justify-center px-4 pb-20 pt-40 lg:pb-10", className)}>
      <div className="flex flex-wrap justify-center gap-8 text-center text-muted-foreground sm:text-left">
        <Link to="/">
          <img
            src="/images/superdupergallery.png"
            alt="Super Duper Gallery"
            className="hover-opacity h-12 w-12"
          />
        </Link>

        <div className="space-y-4">
          <p>
            <Anchor href="https://goo.gl/maps/NGtoAsrkYFCH1cud8">
              <address>
                <span>No.8-A 11th Jamboree, </span>
                <span>Diliman, </span>
                <span>Quezon City, </span>
                <span>1103 Metro Manila, </span>
                <span>Philippines</span>
              </address>
            </Anchor>
          </p>

          <p>
            <Anchor href="mailto:superdupergallery@gmail.com">
              <span>superdupergallery@gmail.com</span>
            </Anchor>
          </p>

          <p>
            <span>&copy; {today.getFullYear()} </span>
            <span>🐈 Super Duper Gallery</span>
          </p>
        </div>

        {/* <div>
          <Anchor href="https://instagram.com/superdupergallery">
            <img src="/images/instagram.svg" alt="Instagram" />
          </Anchor>
          <Anchor href="https://facebook.com/superdupergallery">
            <img src="/images/facebook.svg" alt="Facebook" />
          </Anchor>
        </div> */}
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
