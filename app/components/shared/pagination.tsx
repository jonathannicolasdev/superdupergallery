import { Link, useLocation } from "@remix-run/react"
import {
  CaretLeftIcon,
  CaretRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"

import { cn } from "~/libs"
import { formatPluralItems } from "~/utils"
import { SearchForm } from "~/components"

/**
 * Pagination Helpers
 *
 * See app/routes/_example.pagination.tsx
 */

interface PaginationItem {
  pageNumber: number
  to: string
}

interface PaginationConfigs {
  request: Request
  defaultLimit?: number
  defaultPage?: number
}

interface PaginationOptionsConfig {
  request: Request
  totalItems: number
  defaultMaxPageLinks?: number
}

interface CommonPaginationProps {
  queryParam: string
  pageParam: number
  totalItems: number
  totalPages: number
}

interface PaginationNavigationProps extends CommonPaginationProps {
  limitParam: number
  paginationItems: PaginationItem[]
}

interface PaginationSearchProps extends CommonPaginationProps {
  itemName?: string
  searchPlaceholder?: string
  count: number
  isVerbose?: boolean
}

export function getPaginationConfigs({
  request,
  defaultLimit = 20,
  defaultPage = 1,
}: PaginationConfigs) {
  const url = new URL(request.url)

  const queryParam = url.searchParams.get("q") || ""
  const statusParam = url.searchParams.get("status") || ""

  const limitParam = Number(url.searchParams.get("limit")) || defaultLimit
  const pageParam = Number(url.searchParams.get("page")) || defaultPage
  const skip = (pageParam - 1) * limitParam

  return { url, request, queryParam, statusParam, limitParam, pageParam, skip }
}

export function getPaginationOptions({
  request,
  totalItems,
  defaultMaxPageLinks = 5,
}: PaginationOptionsConfig) {
  const url = new URL(request.url)
  const { queryParam, limitParam, pageParam } = getPaginationConfigs({
    request,
  })

  const totalPages = Math.ceil(totalItems / limitParam)
  const visiblePageCount = Math.min(defaultMaxPageLinks, totalPages)

  let startPage = Math.max(1, pageParam - Math.floor(visiblePageCount / 2))
  let endPage = Math.min(totalPages, startPage + visiblePageCount - 1)

  if (endPage - startPage + 1 < visiblePageCount) {
    startPage = Math.max(1, endPage - visiblePageCount + 1)
  }

  const paginationItems: PaginationItem[] = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => {
      const pageNumber = startPage + index
      const queryParams = new URLSearchParams({
        q: queryParam,
        limit: limitParam.toString() || "",
        page: pageNumber.toString() || "",
      }).toString()
      return { pageNumber, to: `${url.pathname}?${queryParams}` }
    },
  )

  return {
    queryParam,
    limitParam,
    pageParam,
    totalItems,
    totalPages,
    paginationItems,
  }
}

export function PaginationNavigation({
  queryParam,
  limitParam,
  pageParam,
  totalPages,
  paginationItems,
}: PaginationNavigationProps) {
  const location = useLocation()

  const renderArrowLink = (direction: string, icon: React.ReactNode, targetPage: number) => {
    const isPrev = direction === "prev"
    const isNext = direction === "next"
    const isFirst = direction === "first"
    const isLast = direction === "last"

    const newPage = isPrev ? pageParam - 1 : isNext ? pageParam + 1 : targetPage
    const isPossible =
      (isFirst && pageParam !== 1) ||
      (isLast && pageParam !== totalPages) ||
      (!isFirst && !isLast && pageParam === newPage) ||
      (isPrev && pageParam > 1) ||
      (isNext && pageParam < totalPages)

    if (!isPossible) {
      return <span className="flex w-8 select-none justify-center px-1 opacity-10">{icon}</span>
    }

    const searchParams = new URLSearchParams({
      q: queryParam,
      limit: String(limitParam),
      page: String(targetPage),
    }).toString()

    return (
      <Link
        to={`${location.pathname}?${searchParams}`}
        className="flex w-8 justify-center px-1 text-muted-foreground hover:text-white"
      >
        {icon}
      </Link>
    )
  }

  const renderArrowMostLink = (direction: "first" | "last", icon: React.ReactNode) => {
    const targetPage = direction === "first" ? 1 : totalPages
    return renderArrowLink(direction, icon, targetPage)
  }

  return (
    <nav className="flex items-center justify-center gap-4">
      {renderArrowMostLink("first", <DoubleArrowLeftIcon className="icon" />)}
      {renderArrowLink("prev", <CaretLeftIcon className="icon" />, pageParam - 1)}

      {pageParam > 0 && (
        <ul className="flex gap-4">
          {paginationItems.map(({ pageNumber, to }, index) => {
            const isActive = pageParam === pageNumber
            return (
              <li key={index}>
                <Link
                  to={to}
                  className={cn(
                    "hover-opacity",
                    "flex w-8 justify-center rounded p-2 font-bold",
                    isActive && "bg-pink-600 text-white",
                    !isActive && "text-muted-foreground hover:text-white",
                  )}
                >
                  {pageNumber}
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {renderArrowLink("next", <CaretRightIcon className="icon" />, pageParam + 1)}
      {renderArrowMostLink("last", <DoubleArrowRightIcon className="icon" />)}
    </nav>
  )
}

export function PaginationSearch({
  itemName = "item",
  searchPlaceholder = "Search with keyword...",
  count,
  queryParam,
  pageParam,
  totalItems,
  totalPages,
  isVerbose = false,
}: PaginationSearchProps) {
  const location = useLocation()
  const pluralItemsText = formatPluralItems(itemName, count)

  return (
    <section className="w-full space-y-4">
      <SearchForm action={location.pathname} placeholder={searchPlaceholder} />

      {/* Not found anything from search */}
      {!queryParam && count <= 0 && <p className="text-muted-foreground">No {itemName} found</p>}

      {/* Not found anything from search */}
      {queryParam && count <= 0 && (
        <p className="text-muted-foreground">
          No {itemName} found with keyword "{queryParam}"
        </p>
      )}

      {/* Without search query keyword */}
      {!queryParam && count > 0 && (
        <p className="space-x-2 text-muted-foreground">
          <span>
            {pluralItemsText} in page {pageParam}
          </span>
          {isVerbose && (
            <span>
              (from total of {formatPluralItems(itemName, totalItems)} in{" "}
              {formatPluralItems("page", totalPages)})
            </span>
          )}
        </p>
      )}

      {/* With search query keyword */}
      {queryParam && count > 0 && (
        <p className="space-x-2 text-muted-foreground">
          <span>
            "{queryParam}" found {pluralItemsText} in page {pageParam}
          </span>
          {isVerbose && (
            <span>
              (from total of {formatPluralItems(itemName, totalItems)} in{" "}
              {formatPluralItems("page", totalPages)})
            </span>
          )}
        </p>
      )}
    </section>
  )
}
