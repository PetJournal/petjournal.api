import { prisma } from '..'

export async function sizeSeed (): Promise<void> {
  console.log('Creating sizes...')

  const catId = await prisma.specie.findFirst({ where: { name: 'Gato' } })
  const dogId = await prisma.specie.findFirst({ where: { name: 'Cachorro' } })

  if (!catId || !dogId) {
    throw new Error('Error on get species')
  }

  const catSizes = [
    await prisma.size.upsert({
      where: { name: 'Pequeno (Até 10Kg)' },
      update: {},
      create: {
        name: 'Pequeno (Até 10Kg)',
        specieId: catId.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Médio (11 à 24Kg)' },
      update: {},
      create: {
        name: 'Médio (11 à 24Kg)',
        specieId: catId.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Grande (25 à 45Kg)' },
      update: {},
      create: {
        name: 'Grande (25 à 45Kg)',
        specieId: catId.id
      }
    })
  ]

  const dogSizes = [
    await prisma.size.upsert({
      where: { name: 'Mini (Até 6Kg' },
      update: {},
      create: {
        name: 'Mini (Até 6Kg)',
        specieId: dogId.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Pequeno (6 à 14Kg)' },
      update: {},
      create: {
        name: 'Pequeno (6 à 14Kg)',
        specieId: dogId.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Médio (15 à 24Kg)' },
      update: {},
      create: {
        name: 'Médio (15 à 24Kg)',
        specieId: dogId.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Grande (25 à 45Kg)' },
      update: {},
      create: {
        name: 'Grande (25 à 45Kg)',
        specieId: dogId.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Gigante (Acima de 45Kg)' },
      update: {},
      create: {
        name: 'Gigante (Acima de 45Kg)',
        specieId: dogId.id
      }
    })
  ]

  const sizes = [
    ...catSizes,
    ...dogSizes
  ]

  console.log('Sizes created:\n', sizes)
}
