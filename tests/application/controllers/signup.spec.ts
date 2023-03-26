import { SignUpController } from '../../../src/application/controllers/signup'

describe('SignUp Controller', () => {
  it('Should return 400 if no firstName is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: firstName'))
  })

  it('Should return 400 if no lastName is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: lastName'))
  })
})
