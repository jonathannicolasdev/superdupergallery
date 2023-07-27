import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import arrayShuffle from "array-shuffle"

import { prisma } from "~/libs"
import { createCacheHeaders } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import { AvatarAuto, Button, Layout, UserCard } from "~/components"

export async function loader({ request }: LoaderArgs) {
  const mentors = await prisma.user.findMany({
    where: { tags: { some: { symbol: "MENTOR" } } },
    orderBy: { createdAt: "asc" },
    take: 12,
    select: {
      id: true,
      name: true,
      username: true,
      avatars: { select: { url: true } },
      tags: { select: { id: true, symbol: true, name: true } },
      profiles: { select: { headline: true, links: true } },
    },
  })

  const mentees = await prisma.user.findMany({
    where: { tags: { some: { symbol: "MENTEE" } } },
    orderBy: { createdAt: "asc" },
    take: 24,
    select: {
      id: true,
      name: true,
      username: true,
      avatars: { select: { url: true } },
    },
  })

  return json(
    { mentors: arrayShuffle(mentors), mentees: arrayShuffle(mentees) },
    { headers: createCacheHeaders(request, 60) },
  )
}

export default function Index() {
  return (
    <Layout className="flex flex-col items-center justify-center gap-20 px-4 sm:px-8">
      <LandingHero />
      <LandingMentors />
      <LandingMentees />
      <LandingDevelopment />
    </Layout>
  )
}

export function LandingHero() {
  const { userSession } = useRootLoaderData()

  return (
    <article className="w-full max-w-3xl space-y-8 pb-10 pt-20">
      <section className="flex gap-8">
        <div className="flex w-full flex-col items-center justify-center space-y-4 text-center lg:items-start lg:text-left">
          <h1 className="flex flex-col flex-wrap items-center gap-2 lg:flex-row">
            <span className="text-brand md:text-5xl lg:text-6xl">
              Super Duper Gallery
            </span>
          </h1>
          <p>Super Duper Gallery Offers a Portal Further Beyond</p>
          <p>The gallery for super duper interesting artworks</p>
          <p>Contemporary Art Gallery based in 🇵🇭 QC, Philippines</p>
          {!userSession && (
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/artworks">Discover Artworks</Link>
              </Button>
              <Button size="lg" asChild variant="secondary">
                <Link to="/artists">Get to know Artists</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </article>
  )
}

export function LandingMentors() {
  const { mentors } = useLoaderData<typeof loader>()

  if (mentors.length <= 0) {
    return null
  }

  return (
    <article className="w-full max-w-7xl space-y-4">
      <header className="space-y-1">
        <Link to="/mentors">
          <h2 className="hover-opacity text-brand">Available Mentors</h2>
        </Link>
        <p>In randomized order</p>
      </header>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mentors.map(user => {
          return (
            <li key={user.id} className="w-full">
              <Link to={`/${user.username}`} className="block">
                <UserCard user={user as any} />
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export function LandingMentees() {
  const { mentees } = useLoaderData<typeof loader>()

  if (mentees.length <= 0) {
    return null
  }

  return (
    <article className="w-full max-w-7xl space-y-4">
      <header className="space-y-1">
        <Link to="/mentees">
          <h2 className="hover-opacity text-brand">Featured Mentees</h2>
        </Link>
        <p>In randomized order</p>
      </header>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mentees.map(user => {
          return (
            <li key={user.id}>
              <Link
                to={`/${user.username}`}
                className="hover-opacity flex gap-2 py-1"
              >
                <AvatarAuto
                  className="h-14 w-14"
                  src={user.avatars[0]?.url}
                  alt={user.username}
                  fallback={user.username[0].toUpperCase()}
                />
                <div>
                  <h3 className="text-base">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export function LandingDevelopment() {
  return (
    <article className="w-full max-w-3xl space-y-8 py-20">
      <section className="space-y-4">
        <div className="prose dark:prose-invert space-y-4">
          <h3 className="uppercase">
            Super Duper Gallery Offers a Portal Further Beyond
          </h3>
          <p>
            A contemporary art gallery that welcomes a wide range of artistic
            provocations.
          </p>
          <p>
            Artists are given the opportunity to explore and creatively labor
            upon the energy that drives their limitless imagination.
          </p>
          <p>
            The gallery embraces a range of expressions and intentions, from
            serious to the unapologetically whimsical.
          </p>
          <p>
            Artists may freely choose the contemplative in challenging yet
            innovative ways or provide an occasional jesting commentary.
          </p>
          <p>
            They can also renegotiate ontologies of art and rethink parameters
            of validity in the market.
          </p>
          <p>
            Although it is physically located in Quezon City, the gallery offers
            a glimpse into the diverse contemporary art practices and media that
            artists have to offer regardless of ethnicity, nationality, and
            geographic borders.
          </p>
          <p>
            Super Duper is a contemporary art gallery that features carefully
            curated exhibitions that transcend conceptual boundaries,
            established trends, and cliques.
          </p>
          <p>
            The innovative program of exhibitions is reflective of the gallery’s
            dictum: ignore the compulsory and pursue the super duper.
          </p>
          <h3 className="uppercase">Our Expertise</h3>
          <p>
            The gallery offers facilities and services for solo and group
            exhibitions, artist exchanges, and other collateral activities.
          </p>
          <p>
            It has a team of artists with a wealth of experience in curation,
            exhibition design, marketing, and project management.
          </p>
          <p>
            The gallery serves as a platform for emerging and established
            artists from across and outside the archipelago.
          </p>
          <p>
            It is a node within a network of art institutions, collectives, and
            artworld stakeholders.
          </p>
          <p>
            Last but not the least, it is a haven and playground for artists who
            wish to experiment and even play.
          </p>
        </div>
      </section>
    </article>
  )
}
