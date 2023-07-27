import { cn } from "~/libs"
import { Footer, HeaderNavigation, SiteHeader } from "~/components"

interface Props {
  className?: string
  children: React.ReactNode
  hasFooter?: boolean
}

export function Layout({ className, children, hasFooter = true }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNavigation />
      <SiteHeader />

      <main className={cn("flex-[1] lg:ml-16", className)}>{children}</main>
      {hasFooter && <Footer className="lg:ml-16" />}
    </div>
  )
}
