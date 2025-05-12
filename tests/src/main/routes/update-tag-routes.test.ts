import { PrismaHelper, prisma } from '@/tests/helpers/prisma-helper'
import request from 'supertest'
import app from '@/main/config/app'

describe('Tag Routes', () => {
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

  beforeEach(async () => { await prisma.tag.deleteMany() })
  afterAll(async () => { await PrismaHelper.disconnect() })

  describe('PUT - /api/tag/:tagId route', () => {
    it('Should update a name tag', async () => {
      const tag = await request(app)
        .post('/api/tag')
        .set('Authorization', accessToken)
        .send({
          name: 'Vacina',
          color: '#324ca8'
        })
      const response = await request(app)
        .put(`/api/tag/${tag.body.id as string}`)
        .set('Authorization', accessToken)
        .send({
          name: 'tag name updated'
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        isSuccess: true,
        data: {
          id: expect.any(String),
          name: 'tag name updated',
          color: '#324ca8'
        }
      })
    })

    it('Should return 400 if no access token is provided', async () => {
      await request(app)
        .put('/api/tag/:tagId')
        .set('Authorization', '')
        .expect(400)
    })

    it('Should return 406 (NotAcceptable) if invalid tagId is Provided', async () => {
      await request(app)
        .post('/api/tag')
        .set('Authorization', accessToken)
        .send({
          name: 'Vacina',
          color: '#324ca8'
        })
      const response = await request(app)
        .put('/api/tag/b1e64ea1-0f6f-4cad-b3d6-434468cb2c5d')
        .set('Authorization', accessToken)
        .send({
          name: 'tag name updated'
        })
      expect(response.status).toBe(406)
    })
  })
})
