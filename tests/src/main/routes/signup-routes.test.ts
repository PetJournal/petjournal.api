import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => { await PrismaHelper.connect() })

  beforeEach(async () => { await PrismaHelper.clearGuardian() })

  afterAll(async () => { await PrismaHelper.disconnect() })

  it('Should return 409 if guardian already exists on database', async () => {
    await PrismaHelper.createGuardian()

    await request(app)
      .post('/api/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: 'Test@1234',
        passwordConfirmation: 'Test@1234',
        phone: '11987654321',
        isPrivacyPolicyAccepted: true
      })
      .expect(409)
  })

  it('Should return a guardian account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: 'Test@1234',
        passwordConfirmation: 'Test@1234',
        phone: '11987654321',
        isPrivacyPolicyAccepted: true
      })
      .expect(201)
  })
})
