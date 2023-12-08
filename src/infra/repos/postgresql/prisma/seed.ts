import { prisma } from '.'
import { specieSeed, sizeSeed } from './seeds'

async function main (): Promise<void> {
  await specieSeed()
  await sizeSeed()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
