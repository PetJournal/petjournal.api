import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

describe('waiting-code-routes', () => {
  beforeEach(async () => { await PrismaHelper.connect() })

  afterEach(async () => { await PrismaHelper.disconnect() })

  describe('WaitingCode Routes', () => {
    it('Should return 400 if invalid body is provided', async () => {
      await request(app)
        .post('/api/waiting-code')
        .send({
          email: 'johndoe@email.com'
        }).expect(400)

      await request(app)
        .post('/api/waiting-code')
        .send({
          verificationToken: 'valid_code'
        }).expect(400)
    })

    it('Should return 401 if incorrect email or code is provided', async () => {
      await request(app)
        .post('/api/waiting-code')
        .send({
          email: 'incorrect@email.com',
          verificationToken: 'valid_code'
        }).expect(401)
    })
  })
})
