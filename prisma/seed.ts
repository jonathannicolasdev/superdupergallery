import bcrypt from "bcryptjs"

import { createAvatarImageURL, prisma } from "~/libs"
import { createArtistSlug, createArtworkSlug, createExhibitionSlug } from "~/utils"
import {
  dataArtists,
  dataArtworksInExhibitions,
  dataArtworkStatuses,
  dataExhibitions,
  dataUserRoles,
  dataUsers,
  dataUserTags,
} from "~/data"
// Check README.md for the guide to setup the credentials
import dataUsersCredentials from "~/data/users-credentials.json"

// Enable and disable by commenting in/out the enabled items
const enabledItems = [
  // "userRoles",
  // "userTags",
  // "artworkStatuses",
  // "users",
  "exhibitions",
  // "artists",
  // "artworks",
]

async function main() {
  const seeds: { [key: string]: () => Promise<any> } = {
    userRoles: seedUserRoles,
    userTags: seedUserTags,
    users: seedUsers,
    artworkStatuses: seedArtworkStatuses,
    exhibitions: seedExhibitions,
    artists: seedArtists,
    artworks: seedArtworks,
  }

  for (const seedName of enabledItems) {
    const seed = seeds[seedName]
    if (seed) {
      await seed()
    }
  }
}

async function seedUserRoles() {
  console.info("🟢 Seed user roles...")
  await prisma.userRole.deleteMany()
  console.info("🟡 Deleted existing user roles...")

  await prisma.userRole.createMany({
    data: dataUserRoles,
  })
  console.info(`✅ Created ${dataUserRoles.length} user roles`)
}

async function seedUserTags() {
  console.info("🟢 Seed user tags...")
  await prisma.userTag.deleteMany()
  console.info("🟡 Deleted existing user tags...")

  await prisma.userTag.createMany({
    data: dataUserTags,
  })
  console.info(`✅ Created ${dataUserTags.length} user tags`)
}

async function seedArtworkStatuses() {
  console.info("🟢 Seed artwork statuses...")
  await prisma.artworkStatus.deleteMany()
  console.info("🟡 Deleted existing artwork statuses...")

  await prisma.artworkStatus.createMany({
    data: dataArtworkStatuses,
  })
  console.info(`✅ Created ${dataArtworkStatuses.length} artwork statuses`)
}

async function seedUsers() {
  if (dataUsersCredentials?.length <= 0) {
    console.error(`🔴 Please create app/data/users-credentials.json file`)
    console.error(`🔴 Check README for the guide`)
    return null
  }

  console.info("🟢 Seed users...")
  await prisma.user.deleteMany()
  console.info("🟡 Deleted existing users...")
  await prisma.userAvatarImage.deleteMany()
  console.info("🟡 Deleted existing user avatar images...")

  // Get existing roles
  const roles = await prisma.userRole.findMany()
  const ADMIN = roles.find(role => role.symbol === "ADMIN")
  const NORMAL = roles.find(role => role.symbol === "NORMAL")
  if (!ADMIN || !NORMAL) return null

  // Get existing tags
  const tags = await prisma.userTag.findMany()
  const TEAM = tags.find(tag => tag.symbol === "TEAM")
  const ARTIST = tags.find(tag => tag.symbol === "ARTIST")
  const UNKNOWN = tags.find(tag => tag.symbol === "UNKNOWN")
  if (!TEAM || !ARTIST || !UNKNOWN) return null

  // Setup data users to connect to the tag ids
  const dataUsersWithTags = dataUsers.map(user => {
    const tags = user.tags?.map(tag => {
      if (tag === "TEAM") return { id: TEAM.id }
      if (tag === "ARTIST") return { id: ARTIST.id }
      return { id: UNKNOWN.id }
    })

    const isTEAM = user.tags?.find(tag => tag === "TEAM")

    return {
      ...user,
      tags: { connect: tags },
      role: { connect: { id: isTEAM ? ADMIN.id : NORMAL.id } },
      avatars: { create: { url: createAvatarImageURL(user.username) } },
    }
  })

  // Setup data users to have email and passwords
  const dataUsersWithCredentials = dataUsersWithTags.map(user => {
    const newCred = dataUsersCredentials.find(cred => {
      return cred.username === user.username
    })

    const hash = bcrypt.hashSync(newCred?.password || "", 10)

    const newUser = {
      ...user,
      email: newCred?.email,
      password: { create: { hash } },
    }

    return newUser
  })

  // Upsert (update or insert/create if new) the users with complete fields
  for (const user of dataUsersWithCredentials) {
    const upsertedUser = await prisma.user.upsert({
      where: { username: user.username },
      update: user,
      create: user,
    })

    console.info(`✅ 👤 User "${upsertedUser.username}" upserted`)
  }
}

async function seedExhibitions() {
  console.info("🟢 Seed exhibitions...")
  // console.info("🟡 Deleted existing exhibitions...")
  // await prisma.exhibition.deleteMany()
  // console.info("🟡 Deleted existing exhibition images...")
  // await prisma.exhibitionImage.deleteMany()

  const user = await prisma.user.findFirst({
    where: { username: "admin" },
  })
  if (!user) return null

  for (const exhibition of dataExhibitions) {
    const exhibitionData = {
      userId: user.id,
      edition: exhibition.edition,
      slug: createExhibitionSlug(exhibition.edition, exhibition.title),
      title: exhibition.title,
      date: new Date(String(exhibition.date)),
      description: `Description of "${exhibition.title}"`,
      images: exhibition.imageURL ? { create: { url: exhibition.imageURL } } : undefined,
      isPublished: exhibition.isPublished,
    }

    const newExhibition = await prisma.exhibition.upsert({
      where: { slug: createExhibitionSlug(exhibition.edition, exhibition.title) },
      create: exhibitionData,
      update: exhibitionData,
      include: { images: { select: { url: true } } },
    })
    console.info(`✅ 🗓️ Exhibition "${newExhibition.title}" upserted`)
  }
}

async function seedArtists() {
  console.info("🟢 Seed artists...")
  console.info("🟡 Deleted existing artists...")
  await prisma.artist.deleteMany()
  console.info("🟡 Deleted existing artist images...")
  await prisma.artistImage.deleteMany()

  const user = await prisma.user.findFirst({
    where: { username: "admin" },
  })
  if (!user) return null

  for (const artist of dataArtists) {
    const slug = createArtistSlug(artist.name)
    const createdArtist = await prisma.artist.create({
      data: {
        userId: user.id,
        slug,
        name: artist.name,
        bio: artist.bio || `Bio of ${artist.name}`,
        image: { create: { url: createAvatarImageURL(slug) } },
      },
    })
    if (!createdArtist) return null
    console.info(`✅ 🧑‍🎨 Artist "${createdArtist.slug}" created`)
  }
}

async function seedArtworks() {
  console.info("🟢 Seed artworks...")
  console.info("🟡 Deleted existing artworks...")
  await prisma.artwork.deleteMany()
  console.info("🟡 Deleted existing artwork images...")
  await prisma.artworkImage.deleteMany()

  const user = await prisma.user.findFirst({
    where: { username: "admin" },
  })
  if (!user) return null

  const manyExhibitions = await prisma.exhibition.findMany()
  if (!manyExhibitions) return null

  // Get existing artwork statuses
  const statuses = await prisma.artworkStatus.findMany()
  const AVAILABLE = statuses.find(status => status.symbol === "AVAILABLE")
  const SOLD = statuses.find(status => status.symbol === "SOLD")
  const PULLED_OUT = statuses.find(status => status.symbol === "PULLED-OUT")
  const RESERVED = statuses.find(status => status.symbol === "RESERVED")
  const UNKNOWN = statuses.find(status => status.symbol === "UNKNOWN")
  if (!AVAILABLE || !SOLD || !PULLED_OUT || !RESERVED || !UNKNOWN) return null

  for (const artworkInExhibition of dataArtworksInExhibitions) {
    const exhibitionTitle = artworkInExhibition.exhibitionTitle
    const exhibition = manyExhibitions.find(
      exhibition => exhibition.title.toLowerCase() === exhibitionTitle.toLowerCase(),
    )
    if (!exhibition) {
      console.error(`🔴 🗓️ Exhibition ${artworkInExhibition.exhibitionTitle} not found`)
      return null
    }

    for (const artwork of artworkInExhibition.artworks) {
      let artist
      artist = await prisma.artist.findUnique({ where: { name: artwork.artistName } })

      if (!artist) {
        artist = await prisma.artist.create({
          data: {
            userId: user.id,
            name: artwork.artistName,
            slug: createArtistSlug(artwork.artistName),
            bio: `Bio of ${artwork.artistName}`,
          },
        })
      }

      const connectedExhibition = await prisma.exhibition.update({
        where: { id: exhibition.id },
        data: { artists: { connect: { id: artist.id } } },
      })

      let status
      if (artwork.statusSymbol === "AVAILABLE") status = AVAILABLE
      else if (artwork.statusSymbol === "SOLD") status = SOLD
      else if (artwork.statusSymbol === "PULLED-OUT") status = PULLED_OUT
      else if (artwork.statusSymbol === "RESERVED") status = RESERVED
      else status = UNKNOWN
      if (!status) return null

      const createdArtwork = await prisma.artwork.create({
        data: {
          userId: user.id,
          exhibitionId: exhibition?.id,
          artistId: artist?.id,
          slug: createArtworkSlug(artwork),
          title: artwork.title || "Untitled Artwork",
          medium: artwork.medium || "No Medium Info",
          size: artwork.size || "No Size Info",
          year: artwork.year || 2023,
          price: artwork.price || 0,
          images: artwork.imageURL ? { create: { url: artwork.imageURL } } : undefined,
          statusId: status.id,
        },
      })
      if (!createdArtwork) return null

      console.info(
        `✅ 🗓️ Exhibition "${connectedExhibition.edition} ${connectedExhibition.title}" has 🖼️ Artwork "${createdArtwork.title}" is [${status.symbol}]`,
      )
    }
  }
}

main()
  .then(async () => {
    console.info("🔵 Seeding complete")
    await prisma.$disconnect()
  })
  .catch(e => {
    console.error(e)
    console.error("🔴 Seeding failed")
    prisma.$disconnect()
    process.exit(1)
  })
