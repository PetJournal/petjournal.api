import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

describe('waiting-code-routes', () => {
  beforeEach(async () => { await PrismaHelper.connect() })

  afterEach(async () => { await PrismaHelper.disconnect() })

  describe('WaitingCode Routes', () => {
    it('Should return 400 with invalid body', async () => {
      await request(app)
        .post('/api/waiting-code')
        .send({
          email: 'johndoe@email.com'
        }).expect(400)

      await request(app)
        .post('/api/waiting-code')
        .send({
          forgetPasswordCode: 'valide_code'
        }).expect(400)
    })
  })
})
