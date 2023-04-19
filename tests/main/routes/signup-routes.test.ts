import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(() => { PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

describe('SignUp Routes', () => {
  it('Should return a guardian account on success', async () => {
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
      .expect(200)
  })
})
