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

    const AVAILABLE = await prisma.artworkStatus.findUnique({ where: { symbol: "AVAILABLE" } })
    if (!AVAILABLE) return { artwork: null, error: null }

    const artwork = await prisma.artwork.create({
      data: {
        title,
        slug: createArtworkSlug(title, "unknown"),
        year: 2023,
        medium: "Canvas",
        size: "20x20 inches",
        price: 0,
        isPublished: false,
        statusId: AVAILABLE?.id,
      },
    })

    return { artwork, error: null }
  },
}
