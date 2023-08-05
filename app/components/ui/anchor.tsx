import * as React from "react"

import { cn } from "~/libs"

export interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ href, className, children, ...props }, ref) => {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("hover-opacity text-pink-700 dark:text-pink-300", className)}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    )
  },
)
Anchor.displayName = "Anchor"

export { Anchor }
