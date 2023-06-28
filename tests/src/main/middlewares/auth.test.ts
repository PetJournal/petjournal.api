import request from 'supertest'
import app from '@/main/config/app'
import { auth } from '@/main/middlewares'
import { sign } from 'jsonwebtoken'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import env from '@/main/config/env'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

describe('Authentication Middleware', () => {
  it('Should return 400 if no authorization is provided', async () => {
    app.get('/test_auth', auth, (req, res) => {
      res.send({ userId: req.userId })
    })
    await request(app)
      .get('/test_auth')
      .expect(400)
  })

  it('Should return 401 if token is invalid', async () => {
    const invalidToken = 'invalid_token'
    app.get('/test_auth', auth, (req, res) => {
      res.send({ userId: req.userId })
    })
    await request(app)
      .get('/test_auth')
      .set('Authorization', invalidToken)
      .expect(401)
  })

  it('Should return 401 if token payload is empty', async () => {
    const tokenWithPayloadEmpty = sign({ payload: {} }, env.secret)
    app.get('/test_auth', auth, (req, res) => {
      res.send({ userId: req.userId })
    })
    await request(app)
      .get('/test_auth')
      .set('Authorization', tokenWithPayloadEmpty)
      .expect(401)
  })

  it('Should return 200 and user ID if token is valid', async () => {
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
    const { body: { accessToken } } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Teste@123'
      })
    app.get('/test_auth', auth, (req, res) => {
      res.send({ userId: req.userId })
    })
    const response = await request(app)
      .get('/test_auth')
      .set('Authorization', accessToken)
    expect(response.status).toBe(200)
    expect(response.body.userId).toBeTruthy()
  })
})
