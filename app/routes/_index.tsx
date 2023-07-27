import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import arrayShuffle from "array-shuffle"

import { prisma } from "~/libs"
import { createCacheHeaders } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Image,
  Layout,
} from "~/components"

export async function loader({ request }: LoaderArgs) {
  const artworks = await prisma.artwork.findMany({
    orderBy: { createdAt: "asc" },
    take: 10,
    include: {
      images: true,
      artist: true,
      exhibition: true,
    },
  })

  return json(
    { artworks: arrayShuffle(artworks) },
    { headers: createCacheHeaders(request, 60) },
  )
}

export default function Index() {
  return (
    <Layout className="flex flex-col items-center justify-center gap-20 px-4 sm:px-8">
      <LandingHero />
      <LandingArtworks />
      <LandingStory />
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
          <p>
            Contemporary art gallery based in 🇵🇭 QC, Philippines for super duper
            interesting artworks
          </p>
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

export function LandingArtworks() {
  const { artworks } = useLoaderData<typeof loader>()

  if (artworks.length <= 0) {
    return null
  }

  return (
    <article className="w-full max-w-7xl space-y-4">
      <header className="space-y-1">
        <Link to="/artworks">
          <h2 className="hover-opacity text-brand">Featured Artworks</h2>
        </Link>
      </header>
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
                        className="h-40 w-40"
                      />
                    )}

                    <div className="flex-grow" />

                    <CardTitle className="text-2xl">{artwork.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export function LandingStory() {
  return (
    <article className="w-full max-w-3xl space-y-8 py-20">
      <section>
        <img
          src="https://superdupergallery.com/images/cover.jpeg"
          alt="Cover"
          className="rounded"
        />
      </section>
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
