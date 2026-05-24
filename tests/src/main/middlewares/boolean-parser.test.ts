import app from '@/main/config/app'
import { booleanParser } from '@/main/middlewares'
import request from 'supertest'

describe('Boolean Parser Middleware', () => {
  beforeAll(async () => {
    app.post('/test_boolean_parser', booleanParser('isActive'), (req, res) => {
      res.send(req.body)
    })
  })

  it('Should parse body as boolean', async () => {
    await request(app)
      .post('/test_boolean_parser')
      .send({ isActive: 'true' })
      .expect({ isActive: true })
  })
})
