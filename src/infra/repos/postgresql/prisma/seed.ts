import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main (): Promise<void> {
  console.log('Creating species...')
  const species = [
    await prisma.specie.upsert({
      where: { name: 'Cachorro' },
      update: {},
      create: {
        name: 'Cachorro'
      }
    }),
    await prisma.specie.upsert({
      where: { name: 'Pássaro' },
      update: {},
      create: {
        name: 'Pássaro'
      }
    }),
    await prisma.specie.upsert({
      where: { name: 'Gato' },
      update: {},
      create: {
        name: 'Gato'
      }
    }),
    await prisma.specie.upsert({
      where: { name: 'Peixe' },
      update: {},
      create: {
        name: 'Peixe'
      }
    }),
    await prisma.specie.upsert({
      where: { name: 'Réptil' },
      update: {},
      create: {
        name: 'Réptil'
      }
    }),
    await prisma.specie.upsert({
      where: { name: 'Roedor' },
      update: {},
      create: {
        name: 'Roedor'
      }
    }),
    await prisma.specie.upsert({
      where: { name: 'Outros' },
      update: {},
      create: {
        name: 'Outros'
      }
    })
  ]
  console.log('species created:\n', species)
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
