import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

describe('LoadTasks Routes', () => {
  let accessToken = ''
  let tagId = ''
  let petId = ''

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
        .get(`/api/tasks/pet/history/${petId}/`)
        .expect(200)
    })

    it('Should return 400 if petId is invalid', async () => {
      await request(app)
        .get('/api/tasks/pet/history/invalid_id/')
        .expect(400)
    })
  })

  describe('GET - /api/tasks/pet/next/:petId', () => {
    it('Should return 200 on success', async () => {
      await request(app)
        .get(`/api/tasks/pet/next/${petId}`)
        .expect(200)
    })

    it('Should return 400 if petId is invalid', async () => {
      await request(app)
        .get('/api/tasks/pet/next/invalid_id')
        .expect(400)
    })
  })

  describe('GET - /api/tasks/pet/:petId/tag/:tagId', () => {
    it('Should return 200 on success', async () => {
      const response = await request(app)
        .get(`/api/tasks/pet/${petId}/tag/${tagId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      console.log(response)
    })

    it('Should return 400 if an invalid petId or tagId are provided', async () => {
      await request(app)
        .get('/api/tasks/pet/invalid_petId/tag/invalid_tagId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
    })
  })
})
