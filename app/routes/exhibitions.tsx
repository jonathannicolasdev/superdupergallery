import { json, type LoaderArgs } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatTitle } from "~/utils"
import { Debug, Layout, SearchForm } from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query
  const count = data?.count

  if (!query) {
    return [
      { title: formatTitle(`All exhibitions`) },
      {
        name: "description",
        content: `All exhibitions in Super Duper Gallery.`,
      },
    ]
  }

  return [
    { title: formatTitle(`Keyword "${query}" found ${count} exhibitions`) },
    {
      name: "description",
      content: `Searching for "${query}" found ${count} exhibitions.`,
    },
  ]
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    const exhibitions = await prisma.exhibition.findMany({
      orderBy: { date: "asc" },
    })

    return json(
      { query, count: exhibitions.length, exhibitions },
      { headers: createCacheHeaders(request, 60) },
    )
  }

  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { date: "asc" },
    where: {
      OR: [{ title: { contains: query } }],
    },
  })

  return json({ query, count: exhibitions.length, exhibitions })
}

export default function RouteComponent() {
  const { exhibitions } = useLoaderData<typeof loader>()

  return (
    <Layout className="flex flex-col gap-8 px-4 py-4">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/cat-trophy.png" alt="Cat" className="h-10" />
          <span>Exhibitions</span>
        </h1>
        <p className="text-muted-foreground">
          An art exhibition is traditionally the space in which art objects meet
          an audience. The exhibit is universally understood to be for some
          temporary period.
        </p>
        <SearchForm
          action="/exhibitions"
          placeholder="Search for exhibitions"
        />
      </header>

      <Debug>{exhibitions}</Debug>
    </Layout>
  )
}
