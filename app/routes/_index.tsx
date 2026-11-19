import { useEffect, useRef } from "react"
import { json } from "@remix-run/node"
import type { LinksFunction, LoaderArgs } from "@remix-run/node"
import { Link, NavLink, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatDateOnly } from "~/utils"
import homeStyles from "~/styles/home.css"

/**
 * Homepage redesign (idea 2: type and colour).
 * The homepage has its own shell for now; the other pages keep the old Layout
 * until the redesign moves to them.
 */

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap",
  },
  { rel: "stylesheet", href: homeStyles },
]

const MAPS_URL = "https://goo.gl/maps/3D1xSmpc9Qc6eaD17"
const EMAIL = "superdupergallery@gmail.com"

const navItems = [
  { to: "/exhibitions", text: "Exhibitions" },
  { to: "/artworks", text: "Artworks" },
  { to: "/artists", text: "Artists" },
  { to: "/about", text: "About" },
  { to: "/search", text: "Search" },
]

export async function loader({ request }: LoaderArgs) {
  const [artworks, exhibitions, exhibitionCount, artistCount, artworkCount] =
    await prisma.$transaction([
      prisma.artwork.findMany({
        where: {
          exhibition: { id: { not: "" } },
          images: { some: { url: { not: "" } } },
        },
        orderBy: { exhibition: { edition: "desc" } },
        take: 8,
        include: { images: true, artist: true },
      }),
      prisma.exhibition.findMany({
        where: { images: { some: { url: { not: "" } } } },
        orderBy: { edition: "desc" },
        take: 7,
        include: { images: true, artists: { select: { name: true } } },
      }),
      prisma.exhibition.count(),
      prisma.artist.count(),
      prisma.artwork.count(),
    ])

  return json(
    { artworks, exhibitions, counts: { exhibitionCount, artistCount, artworkCount } },
    { headers: createCacheHeaders(request, 60) },
  )
}

const FALLBACK_IMAGE = "/images/superdupergallery.png"

/** Image that swaps to the gallery cat when the remote file does not load. */
function ArtImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null)
  const swapToFallback = (img: HTMLImageElement) => {
    if (img.src.endsWith(FALLBACK_IMAGE)) return
    img.src = FALLBACK_IMAGE
    img.dataset.fallback = "true"
  }
  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) swapToFallback(img)
  }, [])
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      ref={ref}
      {...props}
      src={props.src || FALLBACK_IMAGE}
      onError={e => swapToFallback(e.currentTarget)}
    />
  )
}

function excerpt(text: string | null | undefined, max = 220) {
  if (!text) return ""
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, clean.lastIndexOf(" ", max))}…`
}

type LoaderData = ReturnType<typeof useLoaderData<typeof loader>>

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="sd-home">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <HomeBar />
      <main id="main">
        <HomeHero data={data} />
        <HomeLatestShow data={data} />
        <HomeArtworks data={data} />
        <HomePastShows data={data} />
        <HomeManifesto />
        <HomeVisit />
      </main>
      <HomeFooter />
    </div>
  )
}

function HomeBar() {
  return (
    <header className="sd-bar">
      <div className="sd-wrap sd-bar__in">
        <Link to="/" className="sd-brand" aria-label="Super Duper Gallery, home">
          <img src="/images/superdupergallery.png" alt="" />
          <span>Super Duper Gallery</span>
        </Link>
        <nav aria-label="Main" className="sd-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className="sd-link">
              {item.text}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function HomeHero({ data }: { data: LoaderData }) {
  const latest = data.exhibitions[0]
  const { exhibitionCount, artistCount, artworkCount } = data.counts

  return (
    <section className="sd-hero" aria-labelledby="hero-title">
      <div className="sd-wrap sd-hero__grid">
        <div className="sd-hero__text sd-enter">
          <div className="sd-hero__title">
            <p className="sd-kicker">Contemporary art gallery · Diliman, Quezon City</p>
            <h1 id="hero-title" className="sd-h1">
              Quezon City&rsquo;s gallery for the <span className="sd-pink-word">super duper</span>
            </h1>
          </div>
          <div className="sd-hero__side">
            <p className="sd-lead">
              Solo and group shows by emerging and established artists, from the serious to the
              whimsical. Come and see the work on the wall.
            </p>
            <div className="sd-hero__actions">
              {latest && (
                <Link to={`/exhibitions/${latest.slug}`} className="sd-btn sd-btn--solid">
                  See the latest show
                </Link>
              )}
              <a href="#visit" className="sd-btn sd-btn--line">
                Plan your visit
              </a>
            </div>
            <div className="sd-facts">
              <p>
                <b>{exhibitionCount}</b>
                <span>exhibitions</span>
              </p>
              <p>
                <b>{artistCount}</b>
                <span>artists</span>
              </p>
              <p>
                <b>{artworkCount}</b>
                <span>artworks</span>
              </p>
            </div>
          </div>
        </div>

        <div className="sd-hero__photo sd-enter">
          <img
            src="/images/landing-cover.jpeg"
            width={1440}
            height={600}
            alt="Inside Super Duper Gallery: a long white room hung with colourful paintings"
          />
          {latest && (
            <Link to={`/exhibitions/${latest.slug}`} className="sd-sticker">
              <i aria-hidden="true" />
              Latest show: {latest.title}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

function listNames(names: string[]) {
  if (names.length <= 1) return names.join("")
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
}

function HomeLatestShow({ data }: { data: LoaderData }) {
  const show = data.exhibitions[0]
  if (!show) return null

  const artists = listNames(show.artists.map(artist => artist.name))

  return (
    <section className="sd-section sd-now" aria-labelledby="now-title">
      <div className="sd-wrap sd-now__grid">
        <Link to={`/exhibitions/${show.slug}`} className="sd-now__poster">
          <ArtImage src={show.images[0]?.url} alt={`${show.title} exhibition poster`} />
        </Link>
        <div className="sd-now__text">
          <p className="sd-kicker">
            Latest exhibition{show.date ? ` · ${formatDateOnly(show.date)}` : ""}
          </p>
          <h2 id="now-title" className="sd-h2 sd-now__title">
            {show.title}
          </h2>
          {artists && <p className="sd-lead">With {artists}.</p>}
          {show.description && <p className="sd-now__about">{excerpt(show.description)}</p>}
          <div className="sd-hero__actions">
            <Link to={`/exhibitions/${show.slug}`} className="sd-btn sd-btn--solid">
              View the exhibition
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeArtworks({ data }: { data: LoaderData }) {
  if (data.artworks.length <= 0) return null

  return (
    <section className="sd-section" aria-labelledby="art-title">
      <div className="sd-wrap">
        <div className="sd-section__head">
          <h2 id="art-title" className="sd-h2">
            New on the wall
          </h2>
          <Link to="/artworks" className="sd-btn sd-btn--line">
            Browse all artworks
          </Link>
        </div>
        <ul className="sd-wall">
          {data.artworks.map(artwork => (
            <li key={artwork.id}>
              <Link to={`/artworks/${artwork.slug}`} className="sd-card">
                <div className="sd-card__frame">
                  <ArtImage src={artwork.images[0]?.url} alt={artwork.title} loading="lazy" />
                </div>
                <p className="sd-label">
                  <strong>{artwork.title}</strong>
                  {artwork.artist?.name}
                  {artwork.year ? `, ${artwork.year}` : ""}
                  {artwork.medium && (
                    <>
                      <br />
                      {artwork.medium}
                    </>
                  )}
                  {artwork.size && (
                    <>
                      <br />
                      {artwork.size}
                    </>
                  )}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HomePastShows({ data }: { data: LoaderData }) {
  const past = data.exhibitions.slice(1)
  if (past.length <= 0) return null

  return (
    <section className="sd-section sd-shows" aria-labelledby="shows-title">
      <div className="sd-wrap">
        <div className="sd-section__head">
          <h2 id="shows-title" className="sd-h2">
            Past exhibitions
          </h2>
          <Link to="/exhibitions" className="sd-btn sd-btn--line">
            See all {data.counts.exhibitionCount} exhibitions
          </Link>
        </div>
        <ul className="sd-shows__grid">
          {past.map(show => (
            <li key={show.id}>
              <Link to={`/exhibitions/${show.slug}`} className="sd-show">
                <div className="sd-show__img">
                  <ArtImage src={show.images[0]?.url} alt={`${show.title} poster`} loading="lazy" />
                </div>
                <div>
                  <h3 className="sd-h3">{show.title}</h3>
                  {show.date && (
                    <p className="sd-label" style={{ marginTop: 8 }}>
                      {formatDateOnly(show.date)}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HomeManifesto() {
  return (
    <section className="sd-section sd-manifesto" aria-labelledby="rule-title">
      <div className="sd-wrap">
        <p className="sd-kicker" style={{ marginBottom: 24 }}>
          The gallery rule
        </p>
        <h2 id="rule-title" className="sd-h2 sd-manifesto__quote">
          Ignore the compulsory. Pursue the super duper.
        </h2>
        <div className="sd-manifesto__grid">
          <div>
            <h3 className="sd-h3">Serious or playful</h3>
            <p>We show work that does not follow trends or cliques. Thoughtful, funny, or both.</p>
          </div>
          <div>
            <h3 className="sd-h3">Artists from everywhere</h3>
            <p>Emerging and established artists from across the archipelago and further.</p>
          </div>
          <div>
            <h3 className="sd-h3">Run by artists</h3>
            <p>Our team curates and designs solo and group shows, and runs artist exchanges.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeVisit() {
  return (
    <section id="visit" className="sd-section sd-visit" aria-labelledby="visit-title">
      <div className="sd-wrap sd-visit__grid">
        <div>
          <h2 id="visit-title" className="sd-h2">
            Visit the gallery
          </h2>
          <dl>
            <div>
              <dt>Where</dt>
              <dd>11th Jamboree, Diliman, Quezon City</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${EMAIL}`} className="sd-link">
                  {EMAIL}
                </a>
              </dd>
            </div>
          </dl>
          <div className="sd-hero__actions">
            <a href={MAPS_URL} target="_blank" rel="noreferrer" className="sd-btn sd-btn--solid">
              Get directions
            </a>
            <a href={`mailto:${EMAIL}`} className="sd-btn sd-btn--line">
              Email the gallery
            </a>
          </div>
        </div>
        <a href={MAPS_URL} target="_blank" rel="noreferrer" className="sd-visit__map">
          <img
            src="/images/superdupergallery-maps.png"
            width={1000}
            height={500}
            alt="Map of Super Duper Gallery in Diliman, Quezon City"
            loading="lazy"
          />
        </a>
      </div>
    </section>
  )
}

function HomeFooter() {
  return (
    <footer className="sd-foot">
      <div className="sd-wrap sd-foot__in">
        <Link to="/" className="sd-brand">
          <img src="/images/superdupergallery.png" alt="" />
          <span>Super Duper Gallery</span>
        </Link>
        <nav aria-label="Footer" className="sd-nav">
          {navItems.map(item => (
            <Link key={item.to} to={item.to} className="sd-link">
              {item.text}
            </Link>
          ))}
        </nav>
        <small>&copy; {new Date().getFullYear()} Super Duper Gallery</small>
      </div>
    </footer>
  )
}
