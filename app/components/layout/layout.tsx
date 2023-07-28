import { cn } from "~/libs"
import { Footer, HeaderNavigation, SiteHeader } from "~/components"

interface Props {
  className?: string
  children: React.ReactNode
  hasHeader?: boolean
  hasFooter?: boolean
}

export function Layout({
  className,
  children,
  hasHeader = true,
  hasFooter = true,
}: Props) {
  return (
    <div className="lg:ml-16">
      <HeaderNavigation />

      <div className="flex min-h-screen flex-col items-center">
        {hasHeader && <SiteHeader />}

        <main className={cn("max-w-7xl flex-[1]", className)}>{children}</main>

        {hasFooter && <Footer />}
      </div>
    </div>
  )
}
