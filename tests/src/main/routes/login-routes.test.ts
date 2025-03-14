import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

describe('Login Routes', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
    await PrismaHelper.createGuardian()
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  it('Should return an access token on success', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Test@1234'
      })

    expect(response.status).toBe(200)
    expect(response.body.accessToken).toStrictEqual(expect.any(String))
  })
})
