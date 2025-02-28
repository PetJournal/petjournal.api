import app from '@/main/config/app'
import request from 'supertest'

describe('Upload Middleware', () => {
  it('Should set req.file on undefined if no file is provided', async () => {
    app.post('/test_upload', (req, res) => {
      res.send({ file: req.file !== undefined ? req.file : null })
    })

    await request(app).post('/test_upload').expect({ file: null })
  })
})
