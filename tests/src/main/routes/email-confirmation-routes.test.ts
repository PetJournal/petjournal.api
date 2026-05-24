import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

describe('EmailConfirmation route', () => {
  let userId = ''

  beforeAll(async () => {
    await PrismaHelper.connect()

    const { id } = await PrismaHelper.createGuardian()

    userId = id
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  it('Should return 200 on success', async () => {
    await request(app)
      .get(`/api/guardian/email-confirmation/${userId}`)
      .expect(200)
  })

  it('Should return 400 if userId are not found', async () => {
    await request(app)
      .get('/api/guardian/email-confirmation/invalid_user_id')
      .expect(400)
  })
})
