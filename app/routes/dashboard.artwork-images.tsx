import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, formatTitle } from "~/utils"
import { Anchor, Image } from "~/components"

export const meta: V2_MetaFunction = () => [{ title: formatTitle(`All Artwork Images`) }]

export const loader = async ({ request }: LoaderArgs) => {
  const artworkImages = await prisma.artworkImage.findMany({
    orderBy: { updatedAt: "desc" },
  })
  if (!artworkImages) return json({ artworkImages: [] })
  return json({ artworkImages })
}
export default function RouteComponent() {
  const { artworkImages } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="space-y-2">
        <p>Artwork Images</p>
        <p className="text-muted-foreground">
          {formatPluralItems("artwork image", artworkImages.length)}
        </p>
      </header>

      <section>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {artworkImages.map(artworkImage => {
            return (
              <li key={artworkImage.id}>
                <Anchor href={artworkImage.url} className="hover-opacity">
                  <Image
                    src={artworkImage.url || "https://placehold.co/500x500/111/FFF?text=Artwork"}
                    alt={artworkImage.id}
                  />
                </Anchor>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
