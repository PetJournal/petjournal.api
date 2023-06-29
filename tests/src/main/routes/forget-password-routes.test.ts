import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

jest.setTimeout(10000)

describe('forget-password-routes', () => {
  beforeEach(async () => { await PrismaHelper.connect() })
  afterEach(async () => { await PrismaHelper.disconnect() })

  describe('ForgetPassword Routes', () => {
    it('Should send email for password recovery on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@email.com',
          password: 'Teste@123',
          passwordConfirmation: 'Teste@123',
          phone: '11987654321',
          isPrivacyPolicyAccepted: true
        })
      await request(app)
        .post('/api/forget-password')
        .send({
          email: 'johndoe@email.com'
        })
        .expect(200)
    })
  })
})
