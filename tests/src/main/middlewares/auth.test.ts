import request from 'supertest'
import app from '@/main/config/app'
import { auth } from '@/main/middlewares'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import env from '@/main/config/env'
import { JwtAdapter } from '@/infra/cryptography'

describe('Authentication Middleware', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()

    app.get('/test_auth', auth, (req, res) => {
      res.send({ userId: req.userId })
    })
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  it('Should return 400 if no authorization is provided', async () => {
    await request(app)
      .get('/test_auth')
      .expect(400)
  })

  it('Should return 401 if token is invalid', async () => {
    const invalidToken = 'invalid_token'
    await request(app)
      .get('/test_auth')
      .set('Authorization', invalidToken)
      .expect(401)
  })

  it('Should return 401 if token payload is empty', async () => {
    const jwtAdapter = new JwtAdapter(env.secret)
    const tokenWithPayloadEmpty = await jwtAdapter.generate({ payload: {} })
    await request(app)
      .get('/test_auth')
      .set('Authorization', tokenWithPayloadEmpty)
      .expect(401)
  })

  it('Should return 200 and user ID if token is valid', async () => {
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

    const { body: { accessToken } } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Teste@123'
      })
    const response = await request(app)
      .get('/test_auth')
      .set('Authorization', accessToken)

    expect(response.status).toBe(200)
    expect(response.body.userId).toBeTruthy()
  })
})
