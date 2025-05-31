import app from '@/main/config/app'
import { PrismaHelper, prisma } from '@/tests/helpers/prisma-helper'
import path from 'node:path'
import request from 'supertest'

const seedDb = async (): Promise<void> => {
  await prisma.specie.create({
    data: { name: 'Cachorro' }
  })

  const { id: dogId } = await prisma.specie.findUniqueOrThrow({ where: { name: 'Cachorro' }, select: { id: true } })

  const breed = {
    name: 'Afghan Hound',
    specieId: dogId
  }

  const size = {
    name: 'Mini (Até 6Kg)',
    specieId: dogId
  }

  await prisma.breed.create({ data: breed })
  await prisma.size.create({ data: size })
}

const createPetData = {
  input: {
    specieName: 'Cachorro',
    petName: 'any pet name',
    gender: 'M',
    breedName: 'Afghan Hound',
    size: 'Mini (Até 6Kg)',
    dateOfBirth: '2024-06-05T23:40:42.628Z',
    castrated: true,
    image: path.join(__dirname, '..', '..', '..', 'utils', 'images', 'pet.jpg')
  },
  expected: {
    status: 201,
    body: {
      specie: { name: 'Cachorro' },
      specieAlias: null,
      petName: 'any pet name',
      gender: 'M',
      breed: { name: 'Afghan Hound' },
      size: { name: 'Mini (Até 6Kg)' },
      dateOfBirth: '2024-06-05T23:40:42.628Z',
      castrated: true,
      image: expect.any(String)
    }
  }
}

const generateDate = (): any => {
  const start = new Date()
  const end = new Date()
  start.setUTCHours(18, 0, 0, 0)
  end.setUTCHours(19, 0, 0, 0)
  start.setDate(start.getDate() + 1)
  end.setDate(end.getDate() + 3)
  return {
    startAt: start,
    endAt: end
  }
}

const createSchedulerData = {
  input: {
    title: 'Passear com o cat',
    description: 'levar o cat para passear no parque',
    note: 'passeio',
    startAt: generateDate().startAt,
    endAt: generateDate().endAt,
    daily: true
  },
  expect: {
    id: expect.any(String),
    tagId: expect.any(String),
    title: 'Passear com o cat',
    description: 'levar o cat para passear no parque',
    note: 'passeio',
    startAt: generateDate().startAt.toISOString(),
    endAt: generateDate().endAt.toISOString(),
    daysOfWeek: [],
    daysOfMonth: [],
    daily: true,
    pets: [
      {
        id: expect.any(String),
        guardianId: expect.any(String),
        specieId: expect.any(String),
        specieAlias: null,
        petName: 'any pet name',
        gender: 'M',
        breedAlias: '',
        breedId: expect.any(String),
        sizeId: expect.any(String),
        castrated: true,
        dateOfBirth: '2024-06-05T23:40:42.628Z',
        image: expect.any(String)
      }
    ]
  }
}

describe('Scheduler Routes', () => {
  let accessToken = ''
  let fakeUser = {}

  beforeAll(async () => {
    await PrismaHelper.connect()

    const guardian = await PrismaHelper.createGuardian()

    const { body } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Test@1234'
      })
    await seedDb()

    accessToken = body.accessToken
    fakeUser = { ...guardian }
    Reflect.deleteProperty(fakeUser, 'password')
    Reflect.deleteProperty(fakeUser, 'accessToken')
    Reflect.deleteProperty(fakeUser, 'verificationToken')
    Reflect.deleteProperty(fakeUser, 'verificationTokenCreatedAt')
  })

  beforeEach(async () => {
    await prisma.pet.deleteMany()
    await prisma.tag.deleteMany()
  })
  afterAll(async () => { await PrismaHelper.disconnect() })

  describe('POST - /api/scheduler Route', () => {
    it('Should return a scheduler when events are successfully generated', async () => {
      const pet = await request(app)
        .post('/api/pet')
        .set('Authorization', accessToken)
        .field('specieName', createPetData.input.specieName)
        .field('petName', createPetData.input.petName)
        .field('gender', createPetData.input.gender)
        .field('breedName', createPetData.input.breedName)
        .field('size', createPetData.input.size)
        .field('dateOfBirth', createPetData.input.dateOfBirth)
        .field('castrated', createPetData.input.castrated)
        .attach('image', createPetData.input.image)

      const tag = await request(app)
        .post('/api/tag')
        .set('Authorization', accessToken)
        .send({
          name: 'Vacina',
          color: '#3e32a8'
        })

      const response = await request(app)
        .post('/api/scheduler')
        .set('Authorization', accessToken)
        .send({
          tagId: tag.body.id,
          title: createSchedulerData.input.title,
          description: createSchedulerData.input.description,
          note: createSchedulerData.input.note,
          startAt: createSchedulerData.input.startAt,
          endAt: createSchedulerData.input.endAt,
          daily: createSchedulerData.input.daily,
          pets: [pet.body.id as string]
        })

      expect(response.status).toBe(201)
      expect(response.body).toStrictEqual(createSchedulerData.expect)
    })
  })
})
