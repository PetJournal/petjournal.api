import { BcryptAdapter } from '@/infra/cryptography'
import { PrismaClient } from '@/infra/repos/postgresql/prisma/generated'
import { execSync } from 'child_process'
import 'dotenv/config'
import { join } from 'path'
import { URL } from 'url'
import { v4 } from 'uuid'
import { type Guardian } from '../utils'

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
  }
}
