import type { UserRole } from "@prisma/client"

import { prisma } from "~/libs"

export const fields = {
  public: {
    symbol: true,
    name: true,
    description: true,
  },
}

export const query = {
  count() {
    return prisma.userRole.count()
  },

  getAll() {
    return prisma.userRole.findMany({
      select: fields.public,
    })
  },

  getBySymbol({ symbol }: { symbol: UserRole["symbol"] }) {
    return prisma.userRole.findFirst({
      where: { symbol },
    })
  },
}
