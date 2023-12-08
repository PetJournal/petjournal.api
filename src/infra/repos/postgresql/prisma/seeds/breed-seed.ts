import { prisma } from '..'

export async function breedSeed (): Promise<void> {
  console.log('Creating breeds...')

  const catId = await prisma.specie.findFirst({ where: { name: 'Gato' } })
  const dogId = await prisma.specie.findFirst({ where: { name: 'Cachorro' } })

  if (!catId || !dogId) {
    throw new Error('Error on get species')
  }

  const catBreeds = [
    await prisma.breed.upsert({
      where: { name: 'Abissínio' },
      update: {},
      create: {
        name: 'Abissínio',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Bobtail de Pelo Curto' },
      update: {},
      create: {
        name: 'American Bobtail de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Bobtail de Pelo Longo' },
      update: {},
      create: {
        name: 'American Bobtail de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Shorthair' },
      update: {},
      create: {
        name: 'American Shorthair',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Wirehair' },
      update: {},
      create: {
        name: 'American Wirehair',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Angorá Turco' },
      update: {},
      create: {
        name: 'Angorá Turco',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Arabian Mau' },
      update: {},
      create: {
        name: 'Arabian Mau',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ashera' },
      update: {},
      create: {
        name: 'Ashera',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Australian Mist' },
      update: {},
      create: {
        name: 'Australian Mist',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Balinês' },
      update: {},
      create: {
        name: 'Balinês',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bengal' },
      update: {},
      create: {
        name: 'Bengal',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bobtail americano' },
      update: {},
      create: {
        name: 'Bobtail americano',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bobtail japonês' },
      update: {},
      create: {
        name: 'Bobtail japonês',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bombay' },
      update: {},
      create: {
        name: 'Bombay',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Brazilian Shorthair' },
      update: {},
      create: {
        name: 'Brazilian Shorthair',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'British de Pelo Longo' },
      update: {},
      create: {
        name: 'British de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Burmês' },
      update: {},
      create: {
        name: 'Burmês',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Burmês vermelho' },
      update: {},
      create: {
        name: 'Burmês vermelho',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'California Spangled' },
      update: {},
      create: {
        name: 'California Spangled',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chartreux' },
      update: {},
      create: {
        name: 'Chartreux',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chausie' },
      update: {},
      create: {
        name: 'Chausie',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cornish Rex' },
      update: {},
      create: {
        name: 'Cornish Rex',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Curl Americano de Pelo Curto' },
      update: {},
      create: {
        name: 'Curl Americano de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Curl Americano de Pelo Longo' },
      update: {},
      create: {
        name: 'Curl Americano de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cymric' },
      update: {},
      create: {
        name: 'Cymric',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Devon Rex' },
      update: {},
      create: {
        name: 'Devon Rex',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Doméstico de Pelo Curto' },
      update: {},
      create: {
        name: 'Doméstico de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Doméstico de Pelo Longo' },
      update: {},
      create: {
        name: 'Doméstico de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Don Sphynx' },
      update: {},
      create: {
        name: 'Don Sphynx',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Egyptian Mau' },
      update: {},
      create: {
        name: 'Egyptian Mau',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Europeu' },
      update: {},
      create: {
        name: 'Europeu',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Exótico de Pelo Curto' },
      update: {},
      create: {
        name: 'Exótico de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Gato Asiático de Pelo Semi-Longo' },
      update: {},
      create: {
        name: 'Gato Asiático de Pelo Semi-Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'German Rex' },
      update: {},
      create: {
        name: 'German Rex',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Havana' },
      update: {},
      create: {
        name: 'Havana',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Himalaio' },
      update: {},
      create: {
        name: 'Himalaio',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Khao Manee' },
      update: {},
      create: {
        name: 'Khao Manee',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Korat' },
      update: {},
      create: {
        name: 'Korat',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Kurilian Bobtail de Pelo Curto' },
      update: {},
      create: {
        name: 'Kurilian Bobtail de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Kurilian Bobtail de Pelo Longo' },
      update: {},
      create: {
        name: 'Kurilian Bobtail de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'LaPerm de Pelo Curto' },
      update: {},
      create: {
        name: 'LaPerm de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'LaPerm de Pelo Longo' },
      update: {},
      create: {
        name: 'LaPerm de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Maine Coon' },
      update: {},
      create: {
        name: 'Maine Coon',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Manx' },
      update: {},
      create: {
        name: 'Manx',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mekong Bobtail' },
      update: {},
      create: {
        name: 'Mekong Bobtail',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mistura de serval, gato-leopardo e gato doméstico (Ashera)' },
      update: {},
      create: {
        name: 'Mistura de serval, gato-leopardo e gato doméstico (Ashera)',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Munchkin de Pelo Curto' },
      update: {},
      create: {
        name: 'Munchkin de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Munchkin de Pelo Longo' },
      update: {},
      create: {
        name: 'Munchkin de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Nebelung' },
      update: {},
      create: {
        name: 'Nebelung',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ocicat' },
      update: {},
      create: {
        name: 'Ocicat',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ojos Azules de Pelo Curto' },
      update: {},
      create: {
        name: 'Ojos Azules de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Oriental de Pelo Curto' },
      update: {},
      create: {
        name: 'Oriental de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Oriental de Pelo Longo' },
      update: {},
      create: {
        name: 'Oriental de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Persa' },
      update: {},
      create: {
        name: 'Persa',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Peterbald' },
      update: {},
      create: {
        name: 'Peterbald',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pixiebob de Pelo Curto' },
      update: {},
      create: {
        name: 'Pixiebob de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pixiebob de Pelo Longo' },
      update: {},
      create: {
        name: 'Pixiebob de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ragamuffin' },
      update: {},
      create: {
        name: 'Ragamuffin',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ragdoll' },
      update: {},
      create: {
        name: 'Ragdoll',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Russo Azul' },
      update: {},
      create: {
        name: 'Russo Azul',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sagrado da Birmânia' },
      update: {},
      create: {
        name: 'Sagrado da Birmânia',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Savannah' },
      update: {},
      create: {
        name: 'Savannah',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Scottish Fold' },
      update: {},
      create: {
        name: 'Scottish Fold',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Selkirk Rex de Pelo Curto' },
      update: {},
      create: {
        name: 'Selkirk Rex de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Selkirk Rex de Pelo Longo' },
      update: {},
      create: {
        name: 'Selkirk Rex de Pelo Longo',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Serengeti' },
      update: {},
      create: {
        name: 'Serengeti',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sem Raça Definida (SRD)' },
      update: {},
      create: {
        name: 'Sem Raça Definida (SRD)',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Siamês' },
      update: {},
      create: {
        name: 'Siamês',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Siberiano' },
      update: {},
      create: {
        name: 'Siberiano',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Singapura' },
      update: {},
      create: {
        name: 'Singapura',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Snowshoe' },
      update: {},
      create: {
        name: 'Snowshoe',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sokoke' },
      update: {},
      create: {
        name: 'Sokoke',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Somali' },
      update: {},
      create: {
        name: 'Somali',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sphynx' },
      update: {},
      create: {
        name: 'Sphynx',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Thai' },
      update: {},
      create: {
        name: 'Thai',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Tonquinês de Pelo Curto' },
      update: {},
      create: {
        name: 'Tonquinês de Pelo Curto',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Toyger' },
      update: {},
      create: {
        name: 'Toyger',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Van Turco' },
      update: {},
      create: {
        name: 'Van Turco',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'York Chocolate' },
      update: {},
      create: {
        name: 'York Chocolate',
        specieId: catId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Outra raça' },
      update: {},
      create: {
        name: 'Outra raça',
        specieId: catId.id
      }
    })
  ]

  const dogBreeds = [
    await prisma.breed.upsert({
      where: { name: 'Abissínio' },
      update: {},
      create: {
        name: 'Abissínio',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Bobtail de Pelo Curto' },
      update: {},
      create: {
        name: 'American Bobtail de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Bobtail de Pelo Longo' },
      update: {},
      create: {
        name: 'American Bobtail de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Shorthair' },
      update: {},
      create: {
        name: 'American Shorthair',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Wirehair' },
      update: {},
      create: {
        name: 'American Wirehair',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Angorá Turco' },
      update: {},
      create: {
        name: 'Angorá Turco',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Arabian Mau' },
      update: {},
      create: {
        name: 'Arabian Mau',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ashera' },
      update: {},
      create: {
        name: 'Ashera',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Australian Mist' },
      update: {},
      create: {
        name: 'Australian Mist',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Balinês' },
      update: {},
      create: {
        name: 'Balinês',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bengal' },
      update: {},
      create: {
        name: 'Bengal',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bobtail americano' },
      update: {},
      create: {
        name: 'Bobtail americano',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bobtail japonês' },
      update: {},
      create: {
        name: 'Bobtail japonês',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bombay' },
      update: {},
      create: {
        name: 'Bombay',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Brazilian Shorthair' },
      update: {},
      create: {
        name: 'Brazilian Shorthair',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'British de Pelo Longo' },
      update: {},
      create: {
        name: 'British de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Burmês' },
      update: {},
      create: {
        name: 'Burmês',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Burmês vermelho' },
      update: {},
      create: {
        name: 'Burmês vermelho',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'California Spangled' },
      update: {},
      create: {
        name: 'California Spangled',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chartreux' },
      update: {},
      create: {
        name: 'Chartreux',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chausie' },
      update: {},
      create: {
        name: 'Chausie',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cornish Rex' },
      update: {},
      create: {
        name: 'Cornish Rex',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Curl Americano de Pelo Curto' },
      update: {},
      create: {
        name: 'Curl Americano de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Curl Americano de Pelo Longo' },
      update: {},
      create: {
        name: 'Curl Americano de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cymric' },
      update: {},
      create: {
        name: 'Cymric',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Devon Rex' },
      update: {},
      create: {
        name: 'Devon Rex',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Doméstico de Pelo Curto' },
      update: {},
      create: {
        name: 'Doméstico de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Doméstico de Pelo Longo' },
      update: {},
      create: {
        name: 'Doméstico de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Don Sphynx' },
      update: {},
      create: {
        name: 'Don Sphynx',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Egyptian Mau' },
      update: {},
      create: {
        name: 'Egyptian Mau',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Europeu' },
      update: {},
      create: {
        name: 'Europeu',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Exótico de Pelo Curto' },
      update: {},
      create: {
        name: 'Exótico de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Gato Asiático de Pelo Semi-Longo' },
      update: {},
      create: {
        name: 'Gato Asiático de Pelo Semi-Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'German Rex' },
      update: {},
      create: {
        name: 'German Rex',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Havana' },
      update: {},
      create: {
        name: 'Havana',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Himalaio' },
      update: {},
      create: {
        name: 'Himalaio',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Khao Manee' },
      update: {},
      create: {
        name: 'Khao Manee',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Korat' },
      update: {},
      create: {
        name: 'Korat',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Kurilian Bobtail de Pelo Curto' },
      update: {},
      create: {
        name: 'Kurilian Bobtail de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Kurilian Bobtail de Pelo Longo' },
      update: {},
      create: {
        name: 'Kurilian Bobtail de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'LaPerm de Pelo Curto' },
      update: {},
      create: {
        name: 'LaPerm de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'LaPerm de Pelo Longo' },
      update: {},
      create: {
        name: 'LaPerm de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Maine Coon' },
      update: {},
      create: {
        name: 'Maine Coon',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Manx' },
      update: {},
      create: {
        name: 'Manx',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mekong Bobtail' },
      update: {},
      create: {
        name: 'Mekong Bobtail',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mistura de serval, gato-leopardo e gato doméstico (Ashera)' },
      update: {},
      create: {
        name: 'Mistura de serval, gato-leopardo e gato doméstico (Ashera)',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Munchkin de Pelo Curto' },
      update: {},
      create: {
        name: 'Munchkin de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Munchkin de Pelo Longo' },
      update: {},
      create: {
        name: 'Munchkin de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Nebelung' },
      update: {},
      create: {
        name: 'Nebelung',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ocicat' },
      update: {},
      create: {
        name: 'Ocicat',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ojos Azules de Pelo Curto' },
      update: {},
      create: {
        name: 'Ojos Azules de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Oriental de Pelo Curto' },
      update: {},
      create: {
        name: 'Oriental de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Oriental de Pelo Longo' },
      update: {},
      create: {
        name: 'Oriental de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Persa' },
      update: {},
      create: {
        name: 'Persa',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Peterbald' },
      update: {},
      create: {
        name: 'Peterbald',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pixiebob de Pelo Curto' },
      update: {},
      create: {
        name: 'Pixiebob de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pixiebob de Pelo Longo' },
      update: {},
      create: {
        name: 'Pixiebob de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ragamuffin' },
      update: {},
      create: {
        name: 'Ragamuffin',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ragdoll' },
      update: {},
      create: {
        name: 'Ragdoll',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Russo Azul' },
      update: {},
      create: {
        name: 'Russo Azul',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sagrado da Birmânia' },
      update: {},
      create: {
        name: 'Sagrado da Birmânia',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Savannah' },
      update: {},
      create: {
        name: 'Savannah',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Scottish Fold' },
      update: {},
      create: {
        name: 'Scottish Fold',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Selkirk Rex de Pelo Curto' },
      update: {},
      create: {
        name: 'Selkirk Rex de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Selkirk Rex de Pelo Longo' },
      update: {},
      create: {
        name: 'Selkirk Rex de Pelo Longo',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Serengeti' },
      update: {},
      create: {
        name: 'Serengeti',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sem Raça Definida (SRD)' },
      update: {},
      create: {
        name: 'Sem Raça Definida (SRD)',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Siamês' },
      update: {},
      create: {
        name: 'Siamês',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Siberiano' },
      update: {},
      create: {
        name: 'Siberiano',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Singapura' },
      update: {},
      create: {
        name: 'Singapura',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Snowshoe' },
      update: {},
      create: {
        name: 'Snowshoe',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sokoke' },
      update: {},
      create: {
        name: 'Sokoke',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Somali' },
      update: {},
      create: {
        name: 'Somali',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sphynx' },
      update: {},
      create: {
        name: 'Sphynx',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Thai' },
      update: {},
      create: {
        name: 'Thai',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Tonquinês de Pelo Curto' },
      update: {},
      create: {
        name: 'Tonquinês de Pelo Curto',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Toyger' },
      update: {},
      create: {
        name: 'Toyger',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Van Turco' },
      update: {},
      create: {
        name: 'Van Turco',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'York Chocolate' },
      update: {},
      create: {
        name: 'York Chocolate',
        specieId: dogId.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Outra raça' },
      update: {},
      create: {
        name: 'Outra raça',
        specieId: dogId.id
      }
    })
  ]

  const breeds = [
    ...catBreeds,
    ...dogBreeds
  ]

  console.log('breeds created:\n', breeds)
}
