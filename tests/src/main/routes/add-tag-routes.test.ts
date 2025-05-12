import { PrismaHelper, prisma } from '@/tests/helpers/prisma-helper'
import request from 'supertest'
import app from '@/main/config/app'

describe('Tag Routes', () => {
  let accessToken = ''

  beforeAll(async () => {
    await PrismaHelper.connect()
    await PrismaHelper.createGuardian()
    const { body } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Test@1234'
      })
    accessToken = body.accessToken
  })

  beforeEach(async () => { await prisma.tag.deleteMany() })
  afterAll(async () => { await PrismaHelper.disconnect() })

  describe('POST - /api/tag route', () => {
    it('Should return 201(created) when tag is successfully created', async () => {
      const response = await request(app)
        .post('/api/tag')
        .set('Authorization', accessToken)
        .send({
          name: 'Vacina',
          color: '#324ca8'
        })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'Vacina',
        color: '#324ca8'
      })
    })

    it('Should return 400 if no access token is provided', async () => {
      await request(app)
        .post('/api/tag')
        .set('Authorization', '')
        .expect(400)
    })
  })
})
