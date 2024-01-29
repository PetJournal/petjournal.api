import { prisma } from '..'

export async function sizeSeed (): Promise<void> {
  console.log('Creating sizes...')

  const cat = await prisma.specie.findFirst({ where: { name: 'Gato' } })
  const dog = await prisma.specie.findFirst({ where: { name: 'Cachorro' } })
  const bird = await prisma.specie.findFirst({ where: { name: 'Pássaro' } })
  const fish = await prisma.specie.findFirst({ where: { name: 'Peixe' } })
  const reptile = await prisma.specie.findFirst({ where: { name: 'Réptil' } })
  const rodent = await prisma.specie.findFirst({ where: { name: 'Roedor' } })
  const otherSpecie = await prisma.specie.findFirst({ where: { name: 'Outros' } })

  if (!cat || !dog || !otherSpecie || !bird || !fish || !reptile || !rodent) {
    throw new Error('Error on get species')
  }

  const catSizes = [
    await prisma.size.upsert({
      where: { name: 'Pequeno (Até 10Kg)' },
      update: {},
      create: {
        name: 'Pequeno (Até 10Kg)',
        specieId: cat.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Médio (11 à 24Kg)' },
      update: {},
      create: {
        name: 'Médio (11 à 24Kg)',
        specieId: cat.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Grande (25 à 45Kg)' },
      update: {},
      create: {
        name: 'Grande (25 à 45Kg)',
        specieId: cat.id
      }
    })
  ]

  const dogSizes = [
    await prisma.size.upsert({
      where: { name: 'Mini (Até 6Kg)' },
      update: {},
      create: {
        name: 'Mini (Até 6Kg)',
        specieId: dog.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Pequeno (6 à 14Kg)' },
      update: {},
      create: {
        name: 'Pequeno (6 à 14Kg)',
        specieId: dog.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Médio (15 à 24Kg)' },
      update: {},
      create: {
        name: 'Médio (15 à 24Kg)',
        specieId: dog.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Grande (25 à 45Kg)' },
      update: {},
      create: {
        name: 'Grande (25 à 45Kg)',
        specieId: dog.id
      }
    }),
    await prisma.size.upsert({
      where: { name: 'Gigante (Acima de 45Kg)' },
      update: {},
      create: {
        name: 'Gigante (Acima de 45Kg)',
        specieId: dog.id
      }
    })
  ]

  const birdSize = await prisma.size.upsert({
    where: { name: 'Sem porte Pássaro' },
    update: {},
    create: {
      name: 'Sem porte Pássaro',
      specieId: bird.id
    }
  })

  const fishSize = await prisma.size.upsert({
    where: { name: 'Sem porte Peixe' },
    update: {},
    create: {
      name: 'Sem porte Peixe',
      specieId: fish.id
    }
  })

  const reptileSize = await prisma.size.upsert({
    where: { name: 'Sem porte Réptil' },
    update: {},
    create: {
      name: 'Sem porte Réptil',
      specieId: reptile.id
    }
  })

  const rodentSize = await prisma.size.upsert({
    where: { name: 'Sem porte Roedor' },
    update: {},
    create: {
      name: 'Sem porte Roedor',
      specieId: rodent.id
    }
  })

  const otherSpecieSize = await prisma.size.upsert({
    where: { name: 'Sem porte' },
    update: {},
    create: {
      name: 'Sem porte',
      specieId: otherSpecie.id
    }
  })

  const sizes = [
    ...catSizes,
    ...dogSizes,
    birdSize,
    fishSize,
    reptileSize,
    rodentSize,
    otherSpecieSize
  ]

  console.log('Sizes created:\n', sizes)
}
