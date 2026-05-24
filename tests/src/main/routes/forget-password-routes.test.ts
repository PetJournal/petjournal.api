import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

describe('forget-password-routes', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
    await PrismaHelper.createGuardian()
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  describe('ForgetPassword Routes', () => {
    it('Should send email for password recovery on success', async () => {
      await request(app)
        .post('/api/forget-password')
        .send({
          email: 'johndoe@email.com'
        })
        .expect(200)
    })
  })
})
