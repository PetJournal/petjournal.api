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
      where: { name: 'Sem Raça Definida (SRD) gato' },
      update: {},
      create: {
        name: 'Sem Raça Definida (SRD) gato',
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
      where: { name: 'Outra raça gato' },
      update: {},
      create: {
        name: 'Outra raça gato',
        specieId: cat.id
      }
    })
  ]

  const dogBreeds = [
    await prisma.breed.upsert({
      where: { name: 'Afghan Hound' },
      update: {},
      create: {
        name: 'Afghan Hound',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Affenpinscher' },
      update: {},
      create: {
        name: 'Affenpinscher',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Airedale Terrier' },
      update: {},
      create: {
        name: 'Airedale Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Akita' },
      update: {},
      create: {
        name: 'Akita',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'American Staffordshire Terrier' },
      update: {},
      create: {
        name: 'American Staffordshire Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Basenji' },
      update: {},
      create: {
        name: 'Basenji',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Basset Hound' },
      update: {},
      create: {
        name: 'Basset Hound',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Beagle' },
      update: {},
      create: {
        name: 'Beagle',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Beagle Harrier' },
      update: {},
      create: {
        name: 'Beagle Harrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bearded Collie' },
      update: {},
      create: {
        name: 'Bearded Collie',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bedlington Terrier' },
      update: {},
      create: {
        name: 'Bedlington Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bichon Frisé' },
      update: {},
      create: {
        name: 'Bichon Frisé',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bloodhound' },
      update: {},
      create: {
        name: 'Bloodhound',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bobtail' },
      update: {},
      create: {
        name: 'Bobtail',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Boiadeiro Australiano' },
      update: {},
      create: {
        name: 'Boiadeiro Australiano',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Boiadeiro Bernês' },
      update: {},
      create: {
        name: 'Boiadeiro Bernês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Border Collie' },
      update: {},
      create: {
        name: 'Border Collie',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Border Terrier' },
      update: {},
      create: {
        name: 'Border Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Borzoi' },
      update: {},
      create: {
        name: 'Borzoi',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Boston Terrier' },
      update: {},
      create: {
        name: 'Boston Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Boxer' },
      update: {},
      create: {
        name: 'Boxer',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Buldogue Francês' },
      update: {},
      create: {
        name: 'Buldogue Francês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Buldogue Inglês' },
      update: {},
      create: {
        name: 'Buldogue Inglês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bull Terrier' },
      update: {},
      create: {
        name: 'Bull Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Bulmastife' },
      update: {},
      create: {
        name: 'Bulmastife',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cairn Terrier' },
      update: {},
      create: {
        name: 'Cairn Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cane Corso' },
      update: {},
      create: {
        name: 'Cane Corso',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cão de Água Português' },
      update: {},
      create: {
        name: 'Cão de Água Português',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cão de Crista Chinês' },
      update: {},
      create: {
        name: 'Cão de Crista Chinês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cavalier King Charles Spaniel' },
      update: {},
      create: {
        name: 'Cavalier King Charles Spaniel',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chesapeake Bay Retriever' },
      update: {},
      create: {
        name: 'Chesapeake Bay Retriever',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chihuahua' },
      update: {},
      create: {
        name: 'Chihuahua',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Chow Chow' },
      update: {},
      create: {
        name: 'Chow Chow',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cocker Spaniel Americano' },
      update: {},
      create: {
        name: 'Cocker Spaniel Americano',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Cocker Spaniel Inglês' },
      update: {},
      create: {
        name: 'Cocker Spaniel Inglês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Collie' },
      update: {},
      create: {
        name: 'Collie',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Coton de Tuléar' },
      update: {},
      create: {
        name: 'Coton de Tuléar',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Dachshund' },
      update: {},
      create: {
        name: 'Dachshund',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Dálmata' },
      update: {},
      create: {
        name: 'Dálmata',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Dandie Dinmont Terrier' },
      update: {},
      create: {
        name: 'Dandie Dinmont Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Dobermann' },
      update: {},
      create: {
        name: 'Dobermann',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Dogo Argentino' },
      update: {},
      create: {
        name: 'Dogo Argentino',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Dogue Alemão' },
      update: {},
      create: {
        name: 'Dogue Alemão',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Fila Brasileiro' },
      update: {},
      create: {
        name: 'Fila Brasileiro',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Fox Terrier (Pelo Duro e Pelo Liso)' },
      update: {},
      create: {
        name: 'Fox Terrier (Pelo Duro e Pelo Liso)',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Foxhound Inglês' },
      update: {},
      create: {
        name: 'Foxhound Inglês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Galgo Escocês' },
      update: {},
      create: {
        name: 'Galgo Escocês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Galgo Irlandês' },
      update: {},
      create: {
        name: 'Galgo Irlandês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Golden Retriever' },
      update: {},
      create: {
        name: 'Golden Retriever',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Grande Boiadeiro Suiço' },
      update: {},
      create: {
        name: 'Grande Boiadeiro Suiço',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Greyhound' },
      update: {},
      create: {
        name: 'Greyhound',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Grifo da Bélgica' },
      update: {},
      create: {
        name: 'Grifo da Bélgica',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Husky Siberiano' },
      update: {},
      create: {
        name: 'Husky Siberiano',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Jack Russell Terrier' },
      update: {},
      create: {
        name: 'Jack Russell Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'King Charles' },
      update: {},
      create: {
        name: 'King Charles',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Komondor' },
      update: {},
      create: {
        name: 'Komondor',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Labradoodle' },
      update: {},
      create: {
        name: 'Labradoodle',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Labrador Retriever' },
      update: {},
      create: {
        name: 'Labrador Retriever',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Leonberger' },
      update: {},
      create: {
        name: 'Leonberger',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Lhasa Apso' },
      update: {},
      create: {
        name: 'Lhasa Apso',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Malamute do Alasca' },
      update: {},
      create: {
        name: 'Malamute do Alasca',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Maltês' },
      update: {},
      create: {
        name: 'Maltês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mastife' },
      update: {},
      create: {
        name: 'Mastife',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Mastim Napolitano' },
      update: {},
      create: {
        name: 'Mastim Napolitano',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Norfolk Terrier' },
      update: {},
      create: {
        name: 'Norfolk Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Norwich Terrier' },
      update: {},
      create: {
        name: 'Norwich Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Papillon' },
      update: {},
      create: {
        name: 'Papillon',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pastor Alemão' },
      update: {},
      create: {
        name: 'Pastor Alemão',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pinscher Miniatura' },
      update: {},
      create: {
        name: 'Pinscher Miniatura',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Poodle' },
      update: {},
      create: {
        name: 'Poodle',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Pug' },
      update: {},
      create: {
        name: 'Pug',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Rottweiler' },
      update: {},
      create: {
        name: 'Rottweiler',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Sem Raça Definida (SRD) cachorro' },
      update: {},
      create: {
        name: 'Sem Raça Definida (SRD) cachorro',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'ShihTzu' },
      update: {},
      create: {
        name: 'ShihTzu',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Silky Terrier' },
      update: {},
      create: {
        name: 'Silky Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Skye Terrier' },
      update: {},
      create: {
        name: 'Skye Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Staffordshire Bull Terrier' },
      update: {},
      create: {
        name: 'Staffordshire Bull Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Terrier Escocês' },
      update: {},
      create: {
        name: 'Terrier Escocês',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Yorkshire Terrier' },
      update: {},
      create: {
        name: 'Yorkshire Terrier',
        specieId: dog.id
      }
    }),
    await prisma.breed.upsert({
      where: { name: 'Outra raça cachorro' },
      update: {},
      create: {
        name: 'Outra raça cachorro',
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
