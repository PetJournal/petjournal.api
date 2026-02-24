import request from 'supertest'
import app from '@/main/config/app'
import path from 'node:path'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => { await PrismaHelper.connect() })

  beforeEach(async () => { await PrismaHelper.clearGuardian() })

  afterAll(async () => { await PrismaHelper.disconnect() })

  const image = path.join(__dirname, '..', '..', '..', 'utils', 'images', 'guardian.jpg')
  it('Should return 409 if guardian already exists on database', async () => {
    await PrismaHelper.createGuardian()

    await request(app)
      .post('/api/signup')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('email', 'johndoe@email.com')
      .field('password', 'Test@1234')
      .field('passwordConfirmation', 'Test@1234')
      .field('phone', '11987654321')
      .field('isPrivacyPolicyAccepted', 'true')
      .attach('image', image)
      .expect(409)
  })

  it('Should return a guardian account on success', async () => {
    await request(app)
      .post('/api/signup')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('email', 'johndoe@email.com')
      .field('password', 'Test@1234')
      .field('passwordConfirmation', 'Test@1234')
      .field('phone', '11987654321')
      .field('isPrivacyPolicyAccepted', 'true')
      .attach('image', image)
      .expect(201)
  })
})
