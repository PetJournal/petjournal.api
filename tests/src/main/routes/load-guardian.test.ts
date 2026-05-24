import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

describe('LoadGuardian route', () => {
  let accessToken = ''

  beforeAll(async () => {
    await PrismaHelper.connect()

    await PrismaHelper.createGuardian()

    const { body } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Test@1234'
      })

    accessToken = body.accessToken
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  it('Should return 200 on success', async () => {
    const response = await request(app)
      .get('/api/guardian')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({
      email: 'johndoe@email.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '11987654321',
      image: ''
    })
  })

  it('Should return 400 if no access token is provided', async () => {
    await request(app)
      .get('/api/guardian')
      .set('Authorization', '')
      .expect(400)
  })

  it('Should return 401 if invalid access token is provided', async () => {
    await request(app)
      .get('/api/guardian')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401)
  })
})
