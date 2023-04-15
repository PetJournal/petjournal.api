import request from 'supertest'
import app from '../../../src/main/config/app'

describe('SignUp Routes', () => {
  it('Should return an guardian account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: '123',
        passwordConfirmation: '123',
        phone: '11987654321',
        isPrivacyPolicyAccepted: true
      })
      .expect(200)
  })
})
