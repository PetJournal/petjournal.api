import { type Authentication } from '@/domain/use-cases'
import { type EmailValidator } from '@/application/validation'
import { LoginController } from '@/application/controllers'
import { badRequest, unauthorized, success } from '@/application/helpers'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import { makeFakeAuthenticationUseCase, makeEmailValidator, makeFakeLoginRequest, makeFakeServerError } from '@/tests/utils'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeFakeAuthenticationUseCase()
  const emailValidatorStub = makeEmailValidator()
  const dependencies: LoginController.Dependencies = {
    authentication: authenticationStub,
    emailValidator: emailValidatorStub
  }
  const sut = new LoginController(dependencies)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  describe('test the email field', () => {
    it('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeLoginRequest({ fields: { email: undefined } })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('Should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpResponse = await sut.handle(makeFakeLoginRequest({ fields: { email: 'invalid_email' } }))

      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    it('Should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

      await sut.handle(makeFakeLoginRequest())

      expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    it('Should call return 500 if EmailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSut()

      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })

      const httpResponse = await sut.handle(makeFakeLoginRequest())
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test the password field', () => {
    it('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeLoginRequest({ fields: { password: undefined } })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
  })

  describe('test the execution of the Authentication use case', () => {
    it('Should call Authentication with correct values', async () => {
      const { sut, authenticationStub } = makeSut()
      const authSpy = jest.spyOn(authenticationStub, 'auth')

      await sut.handle(makeFakeLoginRequest())

      expect(authSpy).toHaveBeenCalledWith({
        email: 'any_email@mail.com',
        password: 'any_password'
      })
    })

    it('Should return 401 if invalid credentials are provided', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(''))

      const httpResponse = await sut.handle(makeFakeLoginRequest())

      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should return 500 if Authentication throws', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))

      const httpResponse = await sut.handle(makeFakeLoginRequest())

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test signup controller success case', () => {
    it('Should return 200 if valid credentials are provided', async () => {
      const { sut } = makeSut()

      const httpResponse = await sut.handle(makeFakeLoginRequest())

      expect(httpResponse).toEqual(success({ accessToken: 'any_token' }))
    })
  })
})
