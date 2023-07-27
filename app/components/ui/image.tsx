import { cn } from "~/libs"

/**
 * Image
 *
 * Display image with default styles.
 */

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string
  alt: string
}

export function Image({ src, alt, className, ...props }: Props) {
  return (
    <img src={src} alt={alt} className={cn("rounded", className)} {...props} />
  )
}
