import { BcryptAdapter } from '@/infra/cryptography'
import { PrismaClient, type Tag } from '@/infra/repos/postgresql/prisma/generated'
import { execSync } from 'child_process'
import 'dotenv/config'
import { join } from 'path'
import { URL } from 'url'
import { v4 } from 'uuid'
import { type Pet, type Guardian } from '../utils'
import { PetGender } from '@/domain/models'

const generateDatabaseURL = (schema: string): string => {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a database url')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.append('schema', schema)
  return url.toString()
}

const schemaId = 'test-'.concat(v4())
const prismaBinary = join(__dirname, '..', '..', 'node_modules', '.bin', 'prisma')

const url = generateDatabaseURL(schemaId)
process.env.DATABASE_URL = url
export const prisma = new PrismaClient({
  datasources: { db: { url } }
})

export const PrismaHelper = {
  async connect (): Promise<void> {
    execSync(`${prismaBinary} db push --skip-generate`, {
      env: {
        ...process.env,
        DATABASE_URL: generateDatabaseURL(schemaId)
      }
    })
  },
  async disconnect (): Promise<void> {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`)
    await prisma.$disconnect()
  },
  async clearSettings (): Promise<void> {
    await prisma.settings.deleteMany()
  },

  async clearGuardian (): Promise<void> {
    await prisma.guardian.deleteMany()
  },
  async clearBreed (): Promise<void> {
    await prisma.breed.deleteMany()
  },
  async clearSize (): Promise<void> {
    await prisma.size.deleteMany()
  },
  async clearSpecie (): Promise<void> {
    await prisma.specie.deleteMany()
  },
  async clearPet (): Promise<void> {
    await prisma.pet.deleteMany()
  },
  async clearTag (): Promise<void> {
    await prisma.tag.deleteMany()
  },
  async clearEvent (): Promise<void> {
    await prisma.event.deleteMany()
  },
  async clearScheduler (): Promise<void> {
    await prisma.scheduler.deleteMany()
  },
  async createGuardian (): Promise<Guardian> {
    const bcryptAdapter = new BcryptAdapter(3)
    return await prisma.guardian.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: await bcryptAdapter.encrypt({ value: 'Test@1234' }),
        phone: '11987654321',
        emailConfirmation: true,
        verificationToken: ''
      }
    })
  },
  async createPet (guardianId: string): Promise<Pet> {
    const specie = await prisma.specie.create({
      data: {
        name: 'any_name'
      }
    })
    const breed = await prisma.breed.create({
      data: {
        name: 'any_name',
        specieId: specie.id
      }
    })
    const size = await prisma.size.create({
      data: {
        name: 'any_name',
        specieId: specie.id
      }
    })
    return await prisma.pet.create({
      data: {
        guardianId,
        specieId: specie.id,
        specieAlias: 'any_specie_alias',
        petName: 'any_pet_name',
        gender: PetGender.MALE,
        breedId: breed.id,
        breedAlias: 'any_breed_alias',
        sizeId: size.id,
        castrated: false,
        dateOfBirth: new Date(2000, 10, 23)
      },
      select: {
        id: true,
        specieAlias: true,
        guardian: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            emailConfirmation: true
          }
        },
        specie: true,
        petName: true,
        gender: true,
        breed: true,
        breedAlias: true,
        size: true,
        castrated: true,
        dateOfBirth: true,
        image: true
      }
    })
  },
  async createTag (guardianId: string): Promise<Tag> {
    return await prisma.tag.create({
      data: {
        guardianId,
        name: 'tagTest',
        color: '#000000'
      }
    })
  }
}
