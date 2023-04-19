import request from 'supertest'
import app from '@/main/config/app'

describe('Body Parser Middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'John Doe' })
      .expect({ name: 'John Doe' })
  })
})
