import bcrypt from "bcryptjs"

import { createAvatarImageURL, prisma } from "~/libs"
import { createArtistSlug, createArtworkSlug, createExhibitionSlug } from "~/utils"
import {
  dataArtists,
  dataArtworksInExhibitions,
  dataExhibitions,
  dataUserRoles,
  dataUsers,
  dataUserTags,
} from "~/data"
// Check README.md for the guide to setup the credentials
import dataUsersCredentials from "~/data/users-credentials.json"

// Enable and disable by commenting in/out the enabled items
const enabledItems = [
  "userRoles",
  "userTags",
  "users",
  "exhibitions",
  "artists",
  "artworks",
]

async function main() {
  const seeds: { [key: string]: () => Promise<any> } = {
    userRoles: seedUserRoles,
    userTags: seedUserTags,
    users: seedUsers,
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
  console.info(`✅ Created user roles`)
}

async function seedUserTags() {
  console.info("🟢 Seed user tags...")
  await prisma.userTag.deleteMany()
  console.info("🟡 Deleted existing user tags...")

  await prisma.userTag.createMany({
    data: dataUserTags,
  })
  console.info(`✅ Created user tags`)
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
  const COLLABORATOR = tags.find(tag => tag.symbol === "COLLABORATOR")
  const ARTIST = tags.find(tag => tag.symbol === "artistName")
  const UNKNOWN = tags.find(tag => tag.symbol === "UNKNOWN")
  if (!COLLABORATOR || !ARTIST || !UNKNOWN) return null

  // Setup data users to connect to the tag ids
  const dataUsersWithTags = dataUsers.map(user => {
    const tags = user.tags?.map(tag => {
      if (tag === "COLLABORATOR") return { id: COLLABORATOR.id }
      if (tag === "artistName") return { id: ARTIST.id }
      return { id: UNKNOWN.id }
    })

    const isCollaborator = user.tags?.find(tag => tag === "COLLABORATOR")

    return {
      ...user,
      tags: { connect: tags },
      role: { connect: { id: isCollaborator ? ADMIN.id : NORMAL.id } },
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

    console.info(`✅ User "${upsertedUser.username}" upserted`)
  }
}

async function seedExhibitions() {
  console.info("🟢 Seed exhibitions...")
  await prisma.exhibition.deleteMany()
  console.info("🟡 Deleted existing exhibitions...")

  const user = await prisma.user.findFirst({
    where: { username: "admin" },
  })
  if (!user) return null

  for (const exhibition of dataExhibitions) {
    const createdExhibition = await prisma.exhibition.create({
      data: {
        userId: user.id,
        edition: exhibition.edition,
        slug: createExhibitionSlug(exhibition),
        title: exhibition.title,
        date: new Date(String(exhibition.date)),
        images: { create: { url: String(exhibition.imageURL) } },
      },
    })
    if (!createdExhibition) return null
    console.info(`✅ Exhibition "${createdExhibition.slug}" created`)
  }
}

async function seedArtists() {
  console.info("🟢 Seed artists...")
  await prisma.artist.deleteMany()
  console.info("🟡 Deleted existing artists...")

  const user = await prisma.user.findFirst({
    where: { username: "admin" },
  })
  if (!user) return null

  for (const artist of dataArtists) {
    const createdArtist = await prisma.artist.create({
      data: {
        userId: user.id,
        slug: createArtistSlug(artist.name),
        name: artist.name,
        bio: artist?.bio || "",
      },
    })
    if (!createdArtist) return null
    console.info(`✅ Artist "${createdArtist.slug}" created`)
  }
}

async function seedArtworks() {
  console.info("🟢 Seed artworks...")
  await prisma.artwork.deleteMany()
  console.info("🟡 Deleted existing artworks...")

  const user = await prisma.user.findFirst({
    where: { username: "admin" },
  })
  if (!user) return null

  const allExhibitions = await prisma.exhibition.findMany()

  for (const artworkInExhibition of dataArtworksInExhibitions) {
    const exhibitionTitle = artworkInExhibition.exhibitionTitle
    const exhibition = allExhibitions.find(
      exhibition => exhibition.title.toLowerCase() === exhibitionTitle.toLowerCase(),
    )
    if (!exhibition) {
      console.error(`🔴 Exhibition ${artworkInExhibition.exhibitionTitle} not found`)
      return null
    }

    for (const artwork of artworkInExhibition.artworks) {
      let artist
      artist = await prisma.artist.findUnique({ where: { name: artwork.artistName } })

      if (!artist) {
        const newArtist = {
          name: artwork.artistName,
          slug: createArtistSlug(artwork.artistName),
        }
        artist = await prisma.artist.upsert({
          where: { name: newArtist.name },
          update: newArtist,
          create: newArtist,
        })
      }

      const connectedExhibition = await prisma.exhibition.update({
        where: { id: exhibition.id },
        data: { artists: { connect: { id: artist.id } } },
      })

      const createdArtwork = await prisma.artwork.create({
        data: {
          exhibitionId: exhibition?.id,
          artistId: artist?.id,
          userId: user.id,
          slug: createArtworkSlug(artwork),
          title: artwork.title || "Untitled Artwork",
          medium: artwork.medium || "No Medium Info",
          size: artwork.size || "No Size Info",
          year: artwork.year || 2023,
          price: artwork.price || 0,
          images: { create: { url: String(artwork.imageURL) } },
        },
      })
      if (!createdArtwork) return null

      console.info(
        `✅ Artwork "${createdArtwork.slug}" in "${connectedExhibition.title}"`,
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
