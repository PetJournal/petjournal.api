import { type Authentication } from '@/domain/use-cases'
import { type Validation } from '@/application/protocols'
import { LoginController } from '@/application/controllers'
import { badRequest, success, unauthorized } from '@/application/helpers'
import { MissingParamError, UnauthorizedError } from '@/application/errors'
import {
  makeFakeAuthenticationUseCase,
  makeFakeValidation,
  makeFakeLoginRequest,
  makeFakeServerError
} from '@/tests/utils'

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeFakeAuthenticationUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: LoginController.Dependencies = {
    authentication: authenticationStub,
    validation: validationStub
  }
  const sut = new LoginController(dependencies)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  const httpRequest = makeFakeLoginRequest()
  describe('Authentication', () => {
    it('Should call Authentication with correct values', async () => {
      const { sut, authenticationStub } = makeSut()
      const authSpy = jest.spyOn(authenticationStub, 'auth')
      await sut.handle(httpRequest)
      expect(authSpy).toHaveBeenCalledWith({
        email: httpRequest.body.email,
        sensitiveData: {
          field: 'password',
          value: httpRequest.body.password
        }
      })
    })

    it('Should return 500 if Authentication throws', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should return 401 if invalid credentials are provide', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockResolvedValue(new UnauthorizedError())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should return 200 if valid credentials are provide', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(success({ accessToken: 'any_token' }))
    })
  })

  describe('Validation', () => {
    it('Should call Validation with correct value', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith({
        email: httpRequest.body.email,
        password: httpRequest.body.password
      })
    })

    it('Should return 400 if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('email'))
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
  })
})
