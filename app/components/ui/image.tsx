import { cn } from "~/libs"

/**
 * Image
 *
 * Display image with default styles.
 */

interface ImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  src: string
  alt: string
}

export function Image({ src, alt, className, ...props }: ImageProps) {
  return <img src={src} alt={alt} className={cn("rounded", className)} {...props} />
}

interface ImageDataProps {
  children: { title: string; images: { url: string | undefined }[] }
  className?: string
}

export function ImageExhibition({ children, ...props }: ImageDataProps) {
  return (
    <Image
      src={children?.images[0]?.url || "https://placehold.co/500x500/111/FFF?text=Exhibition"}
      alt={children.title}
      {...props}
    />
  )
}

export function ImageArtwork({ children, ...props }: ImageDataProps) {
  return (
    <Image
      src={children?.images[0]?.url || "https://placehold.co/500x500/111/FFF?text=Artwork"}
      alt={children.title}
      {...props}
    />
  )
}
