import app from '@/main/config/app'
import { upload } from '@/main/middlewares'
import request from 'supertest'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

describe('Upload Middleware', () => {
  beforeAll(() => {
    app.post('/test_upload', upload, (req, res) => {
      res.send({ file: req.file !== undefined ? req.file : null })
    })
  })

  it('Should set req.file on undefined if no file is provided', async () => {
    await request(app).post('/test_upload').expect({ file: null })
  })

  it('should set req.file on file if file is provided', async () => {
    const filePath = resolve(__dirname, '..', '..', '..', 'utils', 'images', 'pet.jpg')
    const file = await readFile(filePath)

    await request(app)
      .post('/test_upload')
      .attach('image', filePath)
      .expect((res) => {
        expect(res.body).toEqual({
          file: {
            fieldname: 'image',
            originalname: 'pet.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            buffer: file.toJSON(),
            size: file.byteLength
          }
        })
      })
  })
})
