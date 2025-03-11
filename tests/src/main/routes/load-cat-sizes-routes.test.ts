import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

describe('LoadCatSizes route', () => {
  let accessToken = ''

  beforeAll(async () => {
    await PrismaHelper.connect()

    const guardian = await request(app)
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
      .get(`/api/guardian/email-confirmation/${guardian.body.id as string}`)

    const { body } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Teste@123'
      })

    accessToken = body.accessToken
  })
  afterAll(async () => { await PrismaHelper.disconnect() })

  it('Should return 200 on success', async () => {
    await request(app)
      .get('/api/sizes/cat')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
  })

  it('Should return 400 if no access token is provided', async () => {
    await request(app)
      .get('/api/sizes/cat')
      .set('Authorization', '')
      .expect(400)
  })

  it('Should return 401 if invalid access token is provided', async () => {
    await request(app)
      .get('/api/sizes/cat')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401)
  })
})
