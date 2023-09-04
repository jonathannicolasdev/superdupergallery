import { prisma } from "~/libs"
import { createExhibitionSlug } from "~/utils"

export const query = {
  count() {
    return prisma.exhibition.count()
  },
}

export const mutation = {
  async addNewExhibition() {
    const lastExhibiton = await prisma.exhibition.findFirst({ orderBy: { edition: "desc" } })
    if (!lastExhibiton?.edition) return { exhibition: null, error: null }

    const edition = lastExhibiton?.edition + 1
    const title = `Exhibition ${edition}`
    const exhibition = await prisma.exhibition.create({
      data: {
        edition: edition,
        title: title,
        slug: createExhibitionSlug(edition, title),
        date: new Date(),
        description: `Description of ${title}`,
        isPublished: false,
      },
    })

    return { exhibition, error: null }
  },
}
