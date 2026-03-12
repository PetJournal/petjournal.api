import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

jest.setTimeout(30000)
describe('Update Guardian Routes', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
  })

  afterAll(async () => {
    await PrismaHelper.clearGuardian()
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
  })
})
