import { PrismaHelper, prisma } from '@/tests/helpers/prisma-helper'
import request from 'supertest'
import app from '@/main/config/app'

describe('Settings Routes', () => {
  let accessToken = ''

  beforeAll(async () => {
    await PrismaHelper.connect()

    const guardian = await PrismaHelper.createGuardian()
    await prisma.settings.create({
      data: {
        guardianId: guardian.id,
        notification_email: true,
        notification_mobile: true
      }
    })

    const { body } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Test@1234'
      })

    accessToken = body.accessToken
  })

  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  describe('GET /api/settings', () => {
    it('Should return 200 and a list of settings on success', async () => {
      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        {
          notification_email: true,
          notification_mobile: true
        }
      ])
    })

    it('Should return 400 if no access token is provided', async () => {
      const response = await request(app)
        .get('/api/settings')

      expect(response.status).toBe(400)
    })

    it('Should return 401 if invalid access token is provided', async () => {
      const response = await request(app)
        .get('/api/settings')
        .set('Authorization', 'Bearer invalid_token')

      expect(response.status).toBe(401)
    })
  })
})
