import type { LinkProps } from "@remix-run/react"
import { Link } from "@remix-run/react"
import type { VariantProps } from "class-variance-authority"

import { cn } from "~/libs"
import { buttonVariants } from "~/components"

import { Button } from "./button"

interface ButtonLinkProps extends LinkProps, VariantProps<typeof buttonVariants> {}

const ButtonLink = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonLinkProps) => {
  return (
    <Link className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </Link>
  )
}
ButtonLink.displayName = "ButtonLink"

interface ButtonNavLinkProps extends LinkProps, VariantProps<typeof buttonVariants> {}

const ButtonNavLink = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonNavLinkProps) => {
  return (
    <Link className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </Link>
  )
}
ButtonNavLink.displayName = "ButtonNavLink"

interface ButtonLinkIconProps extends LinkProps, VariantProps<typeof buttonVariants> {}

function ButtonChildLink({ ...props }: ButtonLinkIconProps) {
  return (
    <Button asChild>
      <Link {...props}>Back to Home</Link>
    </Button>
  )
}

export { ButtonLink, ButtonNavLink, ButtonChildLink }
