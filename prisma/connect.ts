import { prisma } from "~/libs"

async function main() {
  console.info(`🟢 Connect to database: ${process.env.DATABASE_URL}`)
  await prisma.$executeRaw`SELECT COUNT(1)`
}

main()
  .then(async () => {
    console.info("🔵 Checking complete")
    await prisma.$disconnect()
  })
  .catch(e => {
    console.error(e)
    console.error("🔴 Checking failed")
    prisma.$disconnect()
    process.exit(1)
  })
