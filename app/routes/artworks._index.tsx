import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Layout,
  SearchForm,
} from "~/components"

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    const artworks = await prisma.artwork.findMany({
      orderBy: { updatedAt: "asc" },
    })

    return json(
      { query, count: artworks.length, artworks },
      { headers: createCacheHeaders(request, 60) },
    )
  }

  const artworks = await prisma.artwork.findMany({
    orderBy: { updatedAt: "asc" },
    where: {
      OR: [{ title: { contains: query } }],
    },
  })

  return json({ query, count: artworks.length, artworks })
}

export default function ArtworksRoute() {
  const { userData } = useRootLoaderData()
  const { query, count, artworks } = useLoaderData<typeof loader>()

  return (
    <Layout className="flex flex-wrap gap-8 px-4 py-4 sm:flex-nowrap">
      <section id="artworks-action" className="w-full space-y-8 sm:max-w-xs">
        <header className="space-y-4">
          <h1 className="flex items-center gap-2 text-4xl text-brand">
            <img src="/images/cat-wood.png" alt="Cat" className="h-10" />
            <span>Artworks</span>
          </h1>
        </header>

        {userData?.id && (
          <section>
            <Button asChild>
              <Link to="/artworks/add">Add new artwork</Link>
            </Button>
          </section>
        )}
      </section>

      <section id="artworks" className="w-full max-w-3xl space-y-4">
        <SearchForm
          action="/artworks"
          placeholder="Search artworks with keyword..."
        />
        {!query && count > 0 && (
          <p className="text-muted-foreground">{count} artworks</p>
        )}
        {query && count <= 0 && (
          <p className="text-muted-foreground">
            No artwork found with keyword "{query}"
          </p>
        )}
        {query && count > 0 && (
          <p className="text-muted-foreground">
            Found {formatPluralItems("artwork", count)} with keyword "{query}"
          </p>
        )}

        {count > 0 && (
          <section>
            <ul className="space-y-4">
              {artworks.map(artwork => {
                return (
                  <li key={artwork.id} className="w-full">
                    <Link to={`/artworks/${artwork.slug}`}>
                      <Card className="hover-opacity space-y-2">
                        <CardHeader className="space-y-2 p-4">
                          <div>
                            <CardTitle className="text-2xl">
                              {artwork.title}
                            </CardTitle>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </section>
    </Layout>
  )
}
