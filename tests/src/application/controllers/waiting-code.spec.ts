import { type Authentication } from '@/domain/use-cases'
import { type Validation } from '@/application/protocols'
import { WaitingCodeController } from '@/application/controllers'
import { MissingParamError, NotFoundError } from '@/application/errors'
import { badRequest, success, unauthorized } from '@/application/helpers'
import {
  makeFakeAuthenticationUseCase,
  makeFakeServerError,
  makeFakeWaitingCodeRequest,
  makeFakeValidation
} from '@/tests/utils'

interface SutTypes {
  sut: WaitingCodeController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeFakeAuthenticationUseCase()
  const validationStub = makeFakeValidation()
  const sut = new WaitingCodeController({
    authentication: authenticationStub,
    validation: validationStub
  })
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('WaitingCode Controller', () => {
  const httpRequest = makeFakeWaitingCodeRequest()
  describe('Authentication', () => {
    it('Should call Authentication with correct values', async () => {
      const { sut, authenticationStub } = makeSut()
      const authSpy = jest.spyOn(authenticationStub, 'auth')
      await sut.handle(httpRequest)
      expect(authSpy).toHaveBeenCalledWith({
        email: httpRequest.body.email,
        sensitiveData: { field: 'forgetPasswordCode', value: httpRequest.body.forgetPasswordCode }
      })
    })

    it('Should return 500 if Authentication use case throws', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should return 400 if invalid email is provide', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockResolvedValue(new NotFoundError('email'))
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized(new NotFoundError('email')))
    })

    it('Should return 200 if valid email is provide', async () => {
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
        forgetPasswordCode: httpRequest.body.forgetPasswordCode
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
