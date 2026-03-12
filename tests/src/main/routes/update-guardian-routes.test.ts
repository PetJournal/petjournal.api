import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

jest.setTimeout(30000)
describe('Update Guardian Routes', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
  })

  afterEach(async () => {
    await PrismaHelper.clearGuardian()
  })

  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  describe('PUT - /api/guardian/:guardianId route', () => {
    it('Should update a guardian', async () => {
      const guardian = await PrismaHelper.createGuardian()

      const { body } = await request(app)
        .post('/api/login')
        .send({
          email: 'johndoe@email.com',
          password: 'Test@1234'
        })

      const response = await request(app)
        .put(`/api/guardian/${guardian.id}`)
        .set('Authorization', body.accessToken)
        .field('firstName', 'John Updated')
        .field('lastName', 'Doe')
        .field('phone', '11987654322')
        .attach('image', '')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: guardian.id,
        firstName: 'John Updated',
        lastName: 'Doe',
        phone: '11987654322',
        image: ''

      })
    })

    it('Should return 400 if no access token is provided', async () => {
      await request(app)
        .put('/api/guardian/:guardianId')
        .set('Authorization', '')
        .expect(400)
    })

    it('Should return 406 (NotAcceptable) if invalid guardianId is provided', async () => {
      await PrismaHelper.createGuardian()

      const { body } = await request(app)
        .post('/api/login')
        .send({
          email: 'johndoe@email.com',
          password: 'Test@1234'
        })

      const response = await request(app)
        .put('/api/guardian/b1e64ea1-0f6f-4cad-b3d6-434468cb2c5d')
        .set('Authorization', body.accessToken)

      expect(response.status).toBe(406)
    })
  })
})
