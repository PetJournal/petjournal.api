import app from '@/main/config/app'
import path from 'node:path'
import { PrismaHelper, prisma } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

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

describe('LoadTasks Routes', () => {
  let accessToken = ''
  let tagId = ''
  let petId = ''

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
    }
  }

  beforeAll(async () => {
    await PrismaHelper.connect()
    const { id: guardianId } = await PrismaHelper.createGuardian()
    const pet = await PrismaHelper.createPet(guardianId)

    petId = pet.id

    const { body } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Test@1234'
      })

    const { id } = await PrismaHelper.createTag(guardianId)

    accessToken = body.accessToken
    tagId = id
    await seedDb()
  })

  beforeEach(async () => {
    await prisma.event.deleteMany()
    await prisma.scheduler.deleteMany()
  })

  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  const routes = [
    { path: '/api/tasks/current-date', label: 'LoadCurrentDateTasks' },
    { path: '/api/tasks/current-week', label: 'LoadCurrentWeekTasks' },
    { path: '/api/tasks/current-month', label: 'LoadCurrentMonthTasks' }
  ]

  describe.each(routes)('$label route', ({ path }) => {
    it('Should return 200 on success', async () => {
      await request(app)
        .get(path)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })

    it('Should return 400 if no access token is provided', async () => {
      await request(app)
        .get(path)
        .set('Authorization', '')
        .expect(400)
    })

    it('Should return 401 if invalid access token is provided', async () => {
      await request(app)
        .get(path)
        .set('Authorization', 'Bearer invalid_token')
        .expect(401)
    })
  })

  describe('GET - /api/tasks/current-month route with tagId', () => {
    it('Should return 200 with tasks for the current month and tagId', async () => {
      await request(app)
        .get(`/api/tasks/current-month?tagId=${tagId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })

    it('Should return 400 if tagId is invalid', async () => {
      await request(app)
        .get('/api/tasks/current-month?tagId=invalid_tag_id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
    })
  })

  describe('GET - /api/tasks/pet/history/:petId/', () => {
    it('Should return 200 on success', async () => {
      await request(app)
        .get(`/api/tasks/pet/history/${petId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })

    it('Should return 400 if petId is invalid', async () => {
      await request(app)
        .get('/api/tasks/pet/history/invalid_id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
    })
  })

  describe('GET - /api/tasks/pet/next/:petId/', () => {
    it('Should return 200 on success', async () => {
      await request(app)
        .get(`/api/tasks/pet/next/${petId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })

    it('Should return 400 if petId is invalid', async () => {
      await request(app)
        .get('/api/tasks/pet/next/invalid_id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
    })
  })

  describe('GET - /api/tasks/pet/:petId/tag/:tagId', () => {
    it('Should return 200 on success', async () => {
      await request(app)
        .get(`/api/tasks/pet/${petId}/tag/${tagId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })

    it('Should return 400 if an invalid petId or tagId are provided', async () => {
      await request(app)
        .get('/api/tasks/pet/invalid_petId/tag/invalid_tagId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
    })
  })

  describe('DELETE - /api/tasks/:eventId', () => {
    it('Should return 200 on success', async () => {
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

      const scheduler = await request(app)
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

      const event = await prisma.event.findFirst({
        where: {
          scheduler: {
            id: scheduler.body.id
          }
        }
      })

      await request(app)
        .delete(`/api/tasks/${event?.id as string}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })
  })
})
