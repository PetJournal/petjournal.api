import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

describe('LoadDogBreeds route', () => {
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
    await request(app)
      .get('/api/breeds/dog')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
  })

  it('Should return 400 if no access token is provided', async () => {
    await request(app)
      .get('/api/breeds/dog')
      .set('Authorization', '')
      .expect(400)
  })

  it('Should return 401 if invalid access token is provided', async () => {
    await request(app)
      .get('/api/breeds/dog')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401)
  })
})
