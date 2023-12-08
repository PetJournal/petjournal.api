import { prisma } from '..'

export async function breedSeed (): Promise<void> {
  console.log('Creating breeds...')

  const cat = await prisma.specie.findFirst({ where: { name: 'Gato' } })
  const dog = await prisma.specie.findFirst({ where: { name: 'Cachorro' } })

  if (!cat || !dog) {
    throw new Error('Error on get species')
  }

  const catBreeds = [
    await prisma.breed.upsert({
      where: { name: 'Abissínio' },
      update: {},
      create: {
        name: 'Abissínio',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Bobtail de Pelo Curto' },
      update: {},
      create: {
        name: 'American Bobtail de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Bobtail de Pelo Longo' },
      update: {},
      create: {
        name: 'American Bobtail de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Shorthair' },
      update: {},
      create: {
        name: 'American Shorthair',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Wirehair' },
      update: {},
      create: {
        name: 'American Wirehair',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Angorá Turco' },
      update: {},
      create: {
        name: 'Angorá Turco',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Arabian Mau' },
      update: {},
      create: {
        name: 'Arabian Mau',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ashera' },
      update: {},
      create: {
        name: 'Ashera',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Australian Mist' },
      update: {},
      create: {
        name: 'Australian Mist',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Balinês' },
      update: {},
      create: {
        name: 'Balinês',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bengal' },
      update: {},
      create: {
        name: 'Bengal',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bobtail americano' },
      update: {},
      create: {
        name: 'Bobtail americano',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bobtail japonês' },
      update: {},
      create: {
        name: 'Bobtail japonês',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bombay' },
      update: {},
      create: {
        name: 'Bombay',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Brazilian Shorthair' },
      update: {},
      create: {
        name: 'Brazilian Shorthair',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'British de Pelo Longo' },
      update: {},
      create: {
        name: 'British de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Burmês' },
      update: {},
      create: {
        name: 'Burmês',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Burmês vermelho' },
      update: {},
      create: {
        name: 'Burmês vermelho',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'California Spangled' },
      update: {},
      create: {
        name: 'California Spangled',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chartreux' },
      update: {},
      create: {
        name: 'Chartreux',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chausie' },
      update: {},
      create: {
        name: 'Chausie',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cornish Rex' },
      update: {},
      create: {
        name: 'Cornish Rex',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Curl Americano de Pelo Curto' },
      update: {},
      create: {
        name: 'Curl Americano de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Curl Americano de Pelo Longo' },
      update: {},
      create: {
        name: 'Curl Americano de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cymric' },
      update: {},
      create: {
        name: 'Cymric',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Devon Rex' },
      update: {},
      create: {
        name: 'Devon Rex',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Doméstico de Pelo Curto' },
      update: {},
      create: {
        name: 'Doméstico de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Doméstico de Pelo Longo' },
      update: {},
      create: {
        name: 'Doméstico de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Don Sphynx' },
      update: {},
      create: {
        name: 'Don Sphynx',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Egyptian Mau' },
      update: {},
      create: {
        name: 'Egyptian Mau',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Europeu' },
      update: {},
      create: {
        name: 'Europeu',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Exótico de Pelo Curto' },
      update: {},
      create: {
        name: 'Exótico de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Gato Asiático de Pelo Semi-Longo' },
      update: {},
      create: {
        name: 'Gato Asiático de Pelo Semi-Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'German Rex' },
      update: {},
      create: {
        name: 'German Rex',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Havana' },
      update: {},
      create: {
        name: 'Havana',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Himalaio' },
      update: {},
      create: {
        name: 'Himalaio',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Khao Manee' },
      update: {},
      create: {
        name: 'Khao Manee',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Korat' },
      update: {},
      create: {
        name: 'Korat',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Kurilian Bobtail de Pelo Curto' },
      update: {},
      create: {
        name: 'Kurilian Bobtail de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Kurilian Bobtail de Pelo Longo' },
      update: {},
      create: {
        name: 'Kurilian Bobtail de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'LaPerm de Pelo Curto' },
      update: {},
      create: {
        name: 'LaPerm de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'LaPerm de Pelo Longo' },
      update: {},
      create: {
        name: 'LaPerm de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Maine Coon' },
      update: {},
      create: {
        name: 'Maine Coon',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Manx' },
      update: {},
      create: {
        name: 'Manx',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mekong Bobtail' },
      update: {},
      create: {
        name: 'Mekong Bobtail',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mistura de serval, gato-leopardo e gato doméstico (Ashera)' },
      update: {},
      create: {
        name: 'Mistura de serval, gato-leopardo e gato doméstico (Ashera)',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Munchkin de Pelo Curto' },
      update: {},
      create: {
        name: 'Munchkin de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Munchkin de Pelo Longo' },
      update: {},
      create: {
        name: 'Munchkin de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Nebelung' },
      update: {},
      create: {
        name: 'Nebelung',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ocicat' },
      update: {},
      create: {
        name: 'Ocicat',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ojos Azules de Pelo Curto' },
      update: {},
      create: {
        name: 'Ojos Azules de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Oriental de Pelo Curto' },
      update: {},
      create: {
        name: 'Oriental de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Oriental de Pelo Longo' },
      update: {},
      create: {
        name: 'Oriental de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Persa' },
      update: {},
      create: {
        name: 'Persa',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Peterbald' },
      update: {},
      create: {
        name: 'Peterbald',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pixiebob de Pelo Curto' },
      update: {},
      create: {
        name: 'Pixiebob de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pixiebob de Pelo Longo' },
      update: {},
      create: {
        name: 'Pixiebob de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ragamuffin' },
      update: {},
      create: {
        name: 'Ragamuffin',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ragdoll' },
      update: {},
      create: {
        name: 'Ragdoll',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Russo Azul' },
      update: {},
      create: {
        name: 'Russo Azul',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sagrado da Birmânia' },
      update: {},
      create: {
        name: 'Sagrado da Birmânia',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Savannah' },
      update: {},
      create: {
        name: 'Savannah',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Scottish Fold' },
      update: {},
      create: {
        name: 'Scottish Fold',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Selkirk Rex de Pelo Curto' },
      update: {},
      create: {
        name: 'Selkirk Rex de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Selkirk Rex de Pelo Longo' },
      update: {},
      create: {
        name: 'Selkirk Rex de Pelo Longo',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Serengeti' },
      update: {},
      create: {
        name: 'Serengeti',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sem Raça Definida (SRD)' },
      update: {},
      create: {
        name: 'Sem Raça Definida (SRD)',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Siamês' },
      update: {},
      create: {
        name: 'Siamês',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Siberiano' },
      update: {},
      create: {
        name: 'Siberiano',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Singapura' },
      update: {},
      create: {
        name: 'Singapura',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Snowshoe' },
      update: {},
      create: {
        name: 'Snowshoe',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sokoke' },
      update: {},
      create: {
        name: 'Sokoke',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Somali' },
      update: {},
      create: {
        name: 'Somali',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sphynx' },
      update: {},
      create: {
        name: 'Sphynx',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Thai' },
      update: {},
      create: {
        name: 'Thai',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Tonquinês de Pelo Curto' },
      update: {},
      create: {
        name: 'Tonquinês de Pelo Curto',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Toyger' },
      update: {},
      create: {
        name: 'Toyger',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Van Turco' },
      update: {},
      create: {
        name: 'Van Turco',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'York Chocolate' },
      update: {},
      create: {
        name: 'York Chocolate',
        specieId: cat.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Outra raça' },
      update: {},
      create: {
        name: 'Outra raça',
        specieId: cat.id
      }
    })
  ]

  const dogBreeds = [
    await prisma.breed.upsert({
      where: { name: 'Abissínio' },
      update: {},
      create: {
        name: 'Abissínio',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Bobtail de Pelo Curto' },
      update: {},
      create: {
        name: 'American Bobtail de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Bobtail de Pelo Longo' },
      update: {},
      create: {
        name: 'American Bobtail de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Shorthair' },
      update: {},
      create: {
        name: 'American Shorthair',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Wirehair' },
      update: {},
      create: {
        name: 'American Wirehair',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Angorá Turco' },
      update: {},
      create: {
        name: 'Angorá Turco',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Arabian Mau' },
      update: {},
      create: {
        name: 'Arabian Mau',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ashera' },
      update: {},
      create: {
        name: 'Ashera',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Australian Mist' },
      update: {},
      create: {
        name: 'Australian Mist',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Balinês' },
      update: {},
      create: {
        name: 'Balinês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bengal' },
      update: {},
      create: {
        name: 'Bengal',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bobtail americano' },
      update: {},
      create: {
        name: 'Bobtail americano',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bobtail japonês' },
      update: {},
      create: {
        name: 'Bobtail japonês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bombay' },
      update: {},
      create: {
        name: 'Bombay',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Brazilian Shorthair' },
      update: {},
      create: {
        name: 'Brazilian Shorthair',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'British de Pelo Longo' },
      update: {},
      create: {
        name: 'British de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Burmês' },
      update: {},
      create: {
        name: 'Burmês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Burmês vermelho' },
      update: {},
      create: {
        name: 'Burmês vermelho',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'California Spangled' },
      update: {},
      create: {
        name: 'California Spangled',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chartreux' },
      update: {},
      create: {
        name: 'Chartreux',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chausie' },
      update: {},
      create: {
        name: 'Chausie',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cornish Rex' },
      update: {},
      create: {
        name: 'Cornish Rex',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Curl Americano de Pelo Curto' },
      update: {},
      create: {
        name: 'Curl Americano de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Curl Americano de Pelo Longo' },
      update: {},
      create: {
        name: 'Curl Americano de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cymric' },
      update: {},
      create: {
        name: 'Cymric',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Devon Rex' },
      update: {},
      create: {
        name: 'Devon Rex',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Doméstico de Pelo Curto' },
      update: {},
      create: {
        name: 'Doméstico de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Doméstico de Pelo Longo' },
      update: {},
      create: {
        name: 'Doméstico de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Don Sphynx' },
      update: {},
      create: {
        name: 'Don Sphynx',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Egyptian Mau' },
      update: {},
      create: {
        name: 'Egyptian Mau',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Europeu' },
      update: {},
      create: {
        name: 'Europeu',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Exótico de Pelo Curto' },
      update: {},
      create: {
        name: 'Exótico de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Gato Asiático de Pelo Semi-Longo' },
      update: {},
      create: {
        name: 'Gato Asiático de Pelo Semi-Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'German Rex' },
      update: {},
      create: {
        name: 'German Rex',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Havana' },
      update: {},
      create: {
        name: 'Havana',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Himalaio' },
      update: {},
      create: {
        name: 'Himalaio',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Khao Manee' },
      update: {},
      create: {
        name: 'Khao Manee',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Korat' },
      update: {},
      create: {
        name: 'Korat',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Kurilian Bobtail de Pelo Curto' },
      update: {},
      create: {
        name: 'Kurilian Bobtail de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Kurilian Bobtail de Pelo Longo' },
      update: {},
      create: {
        name: 'Kurilian Bobtail de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'LaPerm de Pelo Curto' },
      update: {},
      create: {
        name: 'LaPerm de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'LaPerm de Pelo Longo' },
      update: {},
      create: {
        name: 'LaPerm de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Maine Coon' },
      update: {},
      create: {
        name: 'Maine Coon',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Manx' },
      update: {},
      create: {
        name: 'Manx',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mekong Bobtail' },
      update: {},
      create: {
        name: 'Mekong Bobtail',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mistura de serval, gato-leopardo e gato doméstico (Ashera)' },
      update: {},
      create: {
        name: 'Mistura de serval, gato-leopardo e gato doméstico (Ashera)',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Munchkin de Pelo Curto' },
      update: {},
      create: {
        name: 'Munchkin de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Munchkin de Pelo Longo' },
      update: {},
      create: {
        name: 'Munchkin de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Nebelung' },
      update: {},
      create: {
        name: 'Nebelung',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ocicat' },
      update: {},
      create: {
        name: 'Ocicat',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ojos Azules de Pelo Curto' },
      update: {},
      create: {
        name: 'Ojos Azules de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Oriental de Pelo Curto' },
      update: {},
      create: {
        name: 'Oriental de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Oriental de Pelo Longo' },
      update: {},
      create: {
        name: 'Oriental de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Persa' },
      update: {},
      create: {
        name: 'Persa',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Peterbald' },
      update: {},
      create: {
        name: 'Peterbald',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pixiebob de Pelo Curto' },
      update: {},
      create: {
        name: 'Pixiebob de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pixiebob de Pelo Longo' },
      update: {},
      create: {
        name: 'Pixiebob de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ragamuffin' },
      update: {},
      create: {
        name: 'Ragamuffin',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Ragdoll' },
      update: {},
      create: {
        name: 'Ragdoll',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Russo Azul' },
      update: {},
      create: {
        name: 'Russo Azul',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sagrado da Birmânia' },
      update: {},
      create: {
        name: 'Sagrado da Birmânia',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Savannah' },
      update: {},
      create: {
        name: 'Savannah',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Scottish Fold' },
      update: {},
      create: {
        name: 'Scottish Fold',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Selkirk Rex de Pelo Curto' },
      update: {},
      create: {
        name: 'Selkirk Rex de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Selkirk Rex de Pelo Longo' },
      update: {},
      create: {
        name: 'Selkirk Rex de Pelo Longo',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Serengeti' },
      update: {},
      create: {
        name: 'Serengeti',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sem Raça Definida (SRD)' },
      update: {},
      create: {
        name: 'Sem Raça Definida (SRD)',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Siamês' },
      update: {},
      create: {
        name: 'Siamês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Siberiano' },
      update: {},
      create: {
        name: 'Siberiano',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Singapura' },
      update: {},
      create: {
        name: 'Singapura',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Snowshoe' },
      update: {},
      create: {
        name: 'Snowshoe',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sokoke' },
      update: {},
      create: {
        name: 'Sokoke',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Somali' },
      update: {},
      create: {
        name: 'Somali',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sphynx' },
      update: {},
      create: {
        name: 'Sphynx',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Thai' },
      update: {},
      create: {
        name: 'Thai',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Tonquinês de Pelo Curto' },
      update: {},
      create: {
        name: 'Tonquinês de Pelo Curto',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Toyger' },
      update: {},
      create: {
        name: 'Toyger',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Van Turco' },
      update: {},
      create: {
        name: 'Van Turco',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'York Chocolate' },
      update: {},
      create: {
        name: 'York Chocolate',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Outra raça' },
      update: {},
      create: {
        name: 'Outra raça',
        specieId: dog.id
      }
    })
  ]

  const breeds = [
    ...catBreeds,
    ...dogBreeds
  ]

  console.log('breeds created:\n', breeds)
}
