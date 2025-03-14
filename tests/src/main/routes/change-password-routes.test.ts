import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

describe('PATCH - /api/guardian/change-password Route', () => {
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

  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  it('Should return 400 if the password field is not provided', async () => {
    const response = await request(app)
      .patch('/api/guardian/change-password')
      .set('Authorization', accessToken)
      .send({
        passwordConfirmation: 'Test@1234'
      })

    expect(response.body.error).toBe('Missing param: password')
    expect(response.status).toBe(400)
  }, 10000)

  it('Should return 400 if the passwordConfirmation field is not provided', async () => {
    const response = await request(app)
      .patch('/api/guardian/change-password')
      .set('Authorization', accessToken)
      .send({
        password: 'Test@1234'
      })

    expect(response.body.error).toBe('Missing param: passwordConfirmation')
    expect(response.status).toBe(400)
  })

  it('Should return 400 if the password is invalid', async () => {
    const response = await request(app)
      .patch('/api/guardian/change-password')
      .set('Authorization', accessToken)
      .send({
        password: 'invalid',
        passwordConfirmation: 'invalid'
      })

    expect(response.body.error).toBe('The entered password does not meet the required 8-character requirements')
    expect(response.status).toBe(400)
  })

  it('Should return 400 if the passwordConfirmation is different from password', async () => {
    const response = await request(app)
      .patch('/api/guardian/change-password')
      .set('Authorization', accessToken)
      .send({
        password: 'Test1234@',
        passwordConfirmation: 'Invalid_Test1234@'
      })

    expect(response.body.error).toBe('Passwords must be identical')
    expect(response.status).toBe(400)
  })

  it('Should return a status 200 when the password is successfully updated', async () => {
    const response = await request(app)
      .patch('/api/guardian/change-password')
      .set('Authorization', accessToken)
      .send({
        password: 'Test1234@',
        passwordConfirmation: 'Test1234@'
      })

    expect(response.body.message).toBe('Password reset completed successfully')
    expect(response.status).toBe(200)
  })
})
