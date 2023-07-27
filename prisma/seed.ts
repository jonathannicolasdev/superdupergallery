/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs"

import { createAvatarImageURL, prisma } from "~/libs"
import {
  createArtistSlug,
  createArtworkSlug,
  createExhibitionSlug,
  log,
} from "~/utils"
import {
  dataArtists,
  dataArtworks,
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
  "artists",
  "artworks",
  "exhibitions",
]

async function main() {
  const seeds: { [key: string]: () => Promise<any> } = {
    userRoles: seedUserRoles,
    userTags: seedUserTags,
    users: seedUsers,
    artists: seedArtists,
    artworks: seedArtworks,
    exhibitions: seedExhibitions,
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
  const ARTIST = tags.find(tag => tag.symbol === "ARTIST")
  const UNKNOWN = tags.find(tag => tag.symbol === "UNKNOWN")
  if (!COLLABORATOR || !ARTIST || !UNKNOWN) return null

  // Setup data users to connect to the tag ids
  const dataUsersWithTags = dataUsers.map(user => {
    const tags = user.tags?.map(tag => {
      if (tag === "COLLABORATOR") return { id: COLLABORATOR.id }
      if (tag === "ARTIST") return { id: ARTIST.id }
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

  for (const artwork of dataArtworks) {
    const createdArtwork = await prisma.artwork.create({
      data: {
        userId: user.id,
        slug: createArtworkSlug(artwork.title),
        title: artwork.title,
        medium: "Canvas",
        size: `20" x 20" x 20"`,
      },
    })
    if (!createdArtwork) return null
    console.info(`✅ Artwork "${createdArtwork.slug}" created`)
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
        slug: createExhibitionSlug(exhibition.title),
        title: exhibition.title,
        date: exhibition.date,
      },
    })
    if (!createdExhibition) return null
    console.info(`✅ Exhibition "${createdExhibition.slug}" created`)
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
