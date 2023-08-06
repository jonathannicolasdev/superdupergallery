import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  Anchor,
  Button,
  Card,
  CardHeader,
  CardTitle,
  ImageArtwork,
  ImageExhibition,
  Layout,
} from "~/components"

export async function loader({ request }: LoaderArgs) {
  const [artworks, exhibitions] = await prisma.$transaction([
    prisma.artwork.findMany({
      orderBy: { createdAt: "desc" },
      take: 16,
      include: {
        images: true,
        artist: true,
        exhibition: true,
      },
    }),

    prisma.exhibition.findMany({
      orderBy: { date: "desc" },
      take: 16,
      include: {
        images: true,
        artworks: true,
        artists: true,
      },
    }),
  ])

  return json({ artworks, exhibitions }, { headers: createCacheHeaders(request, 60) })
}

export default function Index() {
  return (
    <Layout className="flex flex-col items-center justify-center gap-32 px-4 sm:px-8">
      <LandingHero />
      <LandingArtworks />
      <LandingExhibitions />
      <LandingStory />
    </Layout>
  )
}

export function LandingHero() {
  const { userSession } = useRootLoaderData()

  return (
    <article className="w-full space-y-8 pt-20">
      <section className="flex max-w-3xl gap-8">
        <div className="flex w-full flex-col items-center justify-center space-y-4 text-center lg:items-start lg:text-left">
          <h1 className="flex flex-col flex-wrap items-center gap-4 lg:flex-row">
            <span className="text-brand md:text-5xl lg:text-6xl">Super Duper Gallery</span>
          </h1>
          <p>
            Contemporary art gallery based in 🇵🇭 QC, Philippines for super duper interesting
            artworks
          </p>
          {!userSession && (
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
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

      <section>
        <img src="/images/landing-cover.jpeg" alt="Cover" className="rounded" />
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
          <h2 className="hover-opacity text-brand">Latest Artworks</h2>
        </Link>
      </header>

      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
        {artworks.map(artwork => {
          return (
            <li key={artwork.id} className="w-full">
              <Link to={`/artworks/${artwork.slug}`}>
                <Card className="hover-opacity h-full space-y-2">
                  <CardHeader className="flex flex-col items-center space-y-2">
                    <ImageArtwork className="w-full object-contain">{artwork}</ImageArtwork>

                    <div className="flex-grow" />

                    <CardTitle className="text-center text-2xl">{artwork.title}</CardTitle>

                    <p>{artwork.artist?.name}</p>
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

export function LandingExhibitions() {
  const { exhibitions } = useLoaderData<typeof loader>()

  if (exhibitions.length <= 0) {
    return null
  }

  return (
    <article className="w-full max-w-7xl space-y-4">
      <header className="space-y-1">
        <Link to="/exhibitions">
          <h2 className="hover-opacity text-brand">Latest Exhibitions</h2>
        </Link>
      </header>

      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
        {exhibitions.map(exhibition => {
          return (
            <li key={exhibition.id} className="w-full">
              <Link to={`/exhibitions/${exhibition.slug}`}>
                <Card className="hover-opacity space-y-2">
                  <CardHeader className="flex flex-col items-center space-y-2">
                    <ImageExhibition className="object-contain">{exhibition}</ImageExhibition>

                    <div className="flex-grow" />

                    <CardTitle className="text-center text-2xl">
                      <span>{exhibition.title}</span>
                    </CardTitle>
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
      <section className="space-y-4">
        <div className="prose dark:prose-invert space-y-4">
          <h3 className="uppercase">Super Duper Gallery Offers a Portal Further Beyond</h3>
          <p>A contemporary art gallery that welcomes a wide range of artistic provocations.</p>
          <p>
            Artists are given the opportunity to explore and creatively labor upon the energy that
            drives their limitless imagination.
          </p>
          <p>
            The gallery embraces a range of expressions and intentions, from serious to the
            unapologetically whimsical.
          </p>
          <p>
            Artists may freely choose the contemplative in challenging yet innovative ways or
            provide an occasional jesting commentary.
          </p>
          <p>
            They can also renegotiate ontologies of art and rethink parameters of validity in the
            market.
          </p>
          <p>
            Although it is physically located in Quezon City, the gallery offers a glimpse into the
            diverse contemporary art practices and media that artists have to offer regardless of
            ethnicity, nationality, and geographic borders.
          </p>
          <p>
            Super Duper is a contemporary art gallery that features carefully curated exhibitions
            that transcend conceptual boundaries, established trends, and cliques.
          </p>
          <p>
            The innovative program of exhibitions is reflective of the gallery’s dictum: ignore the
            compulsory and pursue the super duper.
          </p>
          <h3 className="uppercase">Our Expertise</h3>
          <p>
            The gallery offers facilities and services for solo and group exhibitions, artist
            exchanges, and other collateral activities.
          </p>
          <p>
            It has a team of artists with a wealth of experience in curation, exhibition design,
            marketing, and project management.
          </p>
          <p>
            The gallery serves as a platform for emerging and established artists from across and
            outside the archipelago.
          </p>
          <p>
            It is a node within a network of art institutions, collectives, and artworld
            stakeholders.
          </p>
          <p>
            Last but not the least, it is a haven and playground for artists who wish to experiment
            and even play.
          </p>
        </div>
      </section>

      <section>
        <Anchor href="https://goo.gl/maps/2nvSCizCzoK3xwjo8">
          <img
            src="/images/superdupergallery-maps.png"
            alt="Maps"
            className="hover-opacity rounded border-2 border-white"
          />
        </Anchor>
      </section>
    </article>
  )
}
