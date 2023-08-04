import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons"

import { cn, prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems } from "~/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  Debug,
  Image,
  Layout,
  SearchForm,
} from "~/components"

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)

  const query = url.searchParams.get("q") || undefined
  const page = Number(url.searchParams.get("page")) || 1
  const limit = Number(url.searchParams.get("limit")) || 10
  const maxPaginationNumber = 10

  let where = {}
  if (query) {
    where = { OR: [{ title: { contains: query } }, { medium: { contains: query } }] }
  }

  const skip = (page - 1) * limit

  const [totalItems, artworks] = await prisma.$transaction([
    prisma.artwork.count({ where }),
    prisma.artwork.findMany({
      skip,
      take: limit,
      orderBy: { updatedAt: "asc" },
      include: { images: true, artist: true, exhibition: true },
      where,
    }),
  ])

  const totalPages = Math.ceil(totalItems / limit)

  const visiblePageCount = Math.min(maxPaginationNumber, totalPages)
  let startPage = Math.max(1, page - Math.floor(visiblePageCount / 2))
  let endPage = Math.min(totalPages, startPage + visiblePageCount - 1)

  if (endPage - startPage + 1 < visiblePageCount) {
    startPage = Math.max(1, endPage - visiblePageCount + 1)
  }

  const navigationItems = Array.from({ length: endPage - startPage + 1 }, (_, index) => {
    const pageNumber = startPage + index

    const queryParams = new URLSearchParams({
      q: query || "",
      limit: limit.toString() || "",
      page: pageNumber.toString() || "",
    }).toString()

    return { pageNumber, to: `/artworks?${queryParams}` }
  })

  return json(
    {
      query,
      count: artworks.length,
      artworks,
      totalItems,
      totalPages,
      page,
      limit,
      navigationItems,
    },
    { headers: createCacheHeaders(request, 5) },
  )
}

export default function ArtworksRoute() {
  const { query, count, artworks, page, totalPages } = useLoaderData<typeof loader>()

  return (
    <Layout className="space-y-8 p-4">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/cat-wood.png" alt="Cat" className="h-10" />
          <span>Artworks</span>
        </h1>
      </header>

      <section id="artworks" className="w-full space-y-4">
        <SearchForm action="/artworks" placeholder="Search artworks with keyword..." />

        {query && count <= 0 && (
          <p className="text-muted-foreground">No artwork found with keyword "{query}"</p>
        )}

        {!query && count > 0 && (
          <p className="text-muted-foreground">
            {formatPluralItems("artwork", count)} in page {page}
          </p>
        )}

        {query && count > 0 && (
          <p className="text-muted-foreground">
            Found {formatPluralItems("artwork", count)} with keyword "{query}" in page{" "}
            {page}
          </p>
        )}
      </section>

      {totalPages > 1 && <Pagination />}

      {count > 0 && (
        <section>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {artworks.map(artwork => {
              return (
                <li key={artwork.id} className="w-full">
                  <Link to={`/artworks/${artwork.slug}`}>
                    <Card className="hover-opacity h-full space-y-2">
                      <CardHeader className="flex flex-col items-center space-y-2 p-4">
                        {artwork.images?.length > 0 && artwork.images[0]?.url && (
                          <Image
                            src={`${artwork.images[0].url}`}
                            alt={`${artwork.title}`}
                            className="h-60 w-60 object-contain"
                          />
                        )}

                        <div className="flex-grow" />

                        <CardTitle className="text-center text-2xl">
                          {artwork.title}
                        </CardTitle>

                        <p>{artwork.artist?.name}</p>
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {totalPages > 1 && <Pagination />}

      <section>
        <Debug>{artworks}</Debug>
      </section>
    </Layout>
  )
}

function Pagination() {
  const { query, page, limit, totalPages, navigationItems } =
    useLoaderData<typeof loader>()

  const renderArrowLink = (direction: string, icon: React.ReactNode) => {
    const isPrev = direction === "prev"
    const isNext = direction === "next"

    const newPage = isPrev ? page - 1 : page + 1
    const isPossible =
      page === newPage || (isPrev && page > 1) || (isNext && page < totalPages)

    if (!isPossible) {
      return (
        <span className="flex w-8 select-none justify-center px-2 opacity-20">
          {icon}
        </span>
      )
    }

    return (
      <Link
        to={`/artworks?q=${query || ""}&limit=${limit}&page=${newPage}`}
        className="flex w-8 justify-center px-2 text-gray-500 hover:text-white"
      >
        {icon}
      </Link>
    )
  }

  return (
    <nav className="flex items-center justify-center gap-4">
      {renderArrowLink("prev", <DoubleArrowLeftIcon className="h-10 w-10" />)}

      <ul className="flex gap-2">
        {navigationItems.map(({ pageNumber, to }, index) => {
          const isActive = page === pageNumber
          return (
            <li key={index}>
              <Link
                to={to}
                className={cn(
                  "flex w-8 justify-center",
                  "hover-opacity rounded p-2 font-bold",
                  isActive && "bg-pink-600 text-white",
                  !isActive && "text-gray-500 hover:text-white",
                )}
              >
                {pageNumber}
              </Link>
            </li>
          )
        })}
      </ul>

      {renderArrowLink("next", <DoubleArrowRightIcon className="h-10 w-10" />)}
    </nav>
  )
}
