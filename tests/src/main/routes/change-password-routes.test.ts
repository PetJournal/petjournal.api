import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

const makeSetup = async (): Promise<{ accessToken: string }> => {
  await request(app)
    .post('/api/signup')
    .send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@email.com',
      password: 'Test@123',
      passwordConfirmation: 'Test@123',
      phone: '11987654321',
      isPrivacyPolicyAccepted: true
    })

  const { body } = await request(app)
    .post('/api/login')
    .send({
      email: 'johndoe@email.com',
      password: 'Test@123'
    })

  return body
}

describe('POST - /api/change-password Route', () => {
  it('Should return 400 if the password field is not provided', async () => {
    const { accessToken } = await makeSetup()
    const response = await request(app)
      .post('/api/change-password')
      .set('Authorization', accessToken)
      .send({
        passwordConfirmation: 'Test@123'
      })

    expect(response.body.error).toBe('Missing param: password')
    expect(response.status).toBe(400)
  })

  it('Should return 400 if the passwordConfirmation field is not provided', async () => {
    const { accessToken } = await makeSetup()
    const response = await request(app)
      .post('/api/change-password')
      .set('Authorization', accessToken)
      .send({
        password: 'Test@123'
      })

    expect(response.body.error).toBe('Missing param: passwordConfirmation')
    expect(response.status).toBe(400)
  })

  it('Should return 400 if the password is invalid', async () => {
    const { accessToken } = await makeSetup()
    const response = await request(app)
      .post('/api/change-password')
      .set('Authorization', accessToken)
      .send({
        password: 'invalid',
        passwordConfirmation: 'invalid'
      })

    expect(response.body.error).toBe('The entered password does not meet the required 8-character requirements')
    expect(response.status).toBe(400)
  })

  it('Should return 400 if the passwordConfirmation is different from password', async () => {
    const { accessToken } = await makeSetup()
    const response = await request(app)
      .post('/api/change-password')
      .set('Authorization', accessToken)
      .send({
        password: 'Test123@',
        passwordConfirmation: 'Invalid_Test123@'
      })

    expect(response.body.error).toBe('Passwords must be identical')
    expect(response.status).toBe(400)
  })

  it('Should return a status 200 when the password is successfully updated', async () => {
    const { accessToken } = await makeSetup()
    const response = await request(app)
      .post('/api/change-password')
      .set('Authorization', accessToken)
      .send({
        password: 'Teste123@',
        passwordConfirmation: 'Teste123@'
      })

    expect(response.body.message).toBe('Password reset completed successfully')
    expect(response.status).toBe(200)
  })
})
