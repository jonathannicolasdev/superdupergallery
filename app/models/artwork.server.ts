import { prisma } from "~/libs"
import { createArtworkSlug } from "~/utils"

export const fields = {
  public: { headline: true, bio: true },
}

export const query = {
  count() {
    return prisma.artwork.count()
  },
}

export const mutation = {
  async addNewArtwork() {
    const count = await prisma.artwork.count()
    const number = count + 1
    const title = `Artwork ${number}`

    const artwork = await prisma.artwork.create({
      data: {
        title,
        slug: createArtworkSlug(title, "unknown"),
        year: 2023,
        medium: "Canvas",
        size: "20x20 inches",
        price: 0,
        isPublished: false,
      },
    })

    return { artwork, error: null }
  },
}
