import { LoginController } from '@/application/controllers/login'
import { type HttpRequest, badRequest, serverError, unauthorized, success } from '@/application/helpers/http'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import { type IdentifierValidator } from '@/application/validation/protocols'
import { type AuthenticationModel, type Authentication } from '@/domain/use-cases'

const makeIdentifierValidator = (): IdentifierValidator => {
  class IdentifierValidatorStub implements IdentifierValidator {
    isValid (guardian: string): boolean {
      return true
    }
  }
  return new IdentifierValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }
  return new AuthenticationStub()
}

interface SutTypes {
  sut: LoginController
  identifierValidatorStub: IdentifierValidator
  authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    identifier: 'any_email_or_phone',
    password: 'any_password'
  }
})

const makeSut = (): SutTypes => {
  const identifierValidatorStub = makeIdentifierValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(identifierValidatorStub, authenticationStub)
  return {
    sut,
    identifierValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no identifier (email or phone) is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('identifier')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        identifier: 'any_email_or_phone'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid identifier is provided', async () => {
    const { sut, identifierValidatorStub } = makeSut()
    jest.spyOn(identifierValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('identifier')))
  })

  test('Should call IdentifierValidator with correct identifier', async () => {
    const { sut, identifierValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(identifierValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email_or_phone')
  })

  test('Should call return 500 if IdentifierValidator throws', async () => {
    const { sut, identifierValidatorStub } = makeSut()
    jest.spyOn(identifierValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError())
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      identifier: 'any_email_or_phone',
      password: 'any_password'
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => { resolve('') }))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(success({ accessToken: 'any_token' }))
  })
})
