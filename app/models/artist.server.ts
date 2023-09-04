import { createAvatarImageURL, prisma } from "~/libs"
import { createArtistSlug } from "~/utils"

export const query = {
  count() {
    return prisma.artist.count()
  },
}

export const mutation = {
  async addNewArtist() {
    const count = await prisma.artist.count()
    const number = count + 1
    const name = `Artist Name ${number}`

    const slug = createArtistSlug(name)
    const artist = await prisma.artist.create({
      data: {
        name,
        slug: slug,
        bio: `Bio of ${name}`,
        image: { create: { url: createAvatarImageURL(slug) } },
      },
    })

    return { artist, error: null }
  },
}
