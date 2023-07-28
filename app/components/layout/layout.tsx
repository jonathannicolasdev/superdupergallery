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
    <div className="flex min-h-screen flex-col lg:items-center">
      <HeaderNavigation />
      {hasHeader && <SiteHeader />}

      <main className={cn("max-w-7xl flex-[1] lg:ml-16", className)}>
        {children}
      </main>

      {hasFooter && <Footer className="lg:ml-16" />}
    </div>
  )
}
