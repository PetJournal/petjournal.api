import { WaitingCodeController } from '@/application/controllers'
import { MissingParamError, UnauthorizedError } from '@/application/errors'
import { badRequest, success, unauthorized } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type Logger } from '@/data/protocols'
import { type CreateAccessToken, type ValidateVerificationToken } from '@/domain/use-cases'
import {
  makeFakeCreateAccessTokenUseCase,
  makeFakeServerError,
  makeFakeValidation,
  makeFakeWaitingCodeRequest,
  makeFakeValidateVerificationTokenUseCase,
  mockTokenService,
  makeFakeLogger
} from '@/tests/utils'

interface SutTypes {
  sut: WaitingCodeController
  validationStub: Validation
  createAccessTokenStub: CreateAccessToken
  validateVerificationTokenStub: ValidateVerificationToken
  loggerStub: Logger
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const createAccessTokenStub = makeFakeCreateAccessTokenUseCase()
  const validateVerificationTokenStub = makeFakeValidateVerificationTokenUseCase()
  const loggerStub = makeFakeLogger()
  const dependencies: WaitingCodeController.Dependencies = {
    validation: validationStub,
    createAccessToken: createAccessTokenStub,
    validateVerificationToken: validateVerificationTokenStub,
    logger: loggerStub
  }
  const sut = new WaitingCodeController(dependencies)
  return {
    sut,
    validationStub,
    createAccessTokenStub,
    validateVerificationTokenStub,
    loggerStub
  }
}

describe('WaitingCode Controller', () => {
  const httpRequest = makeFakeWaitingCodeRequest()
  describe('Validation', () => {
    it('Should return 400 (BadRequest) if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('email'))
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('Should call Validation with correct value', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith({
        email: httpRequest.body.email,
        verificationToken: httpRequest.body.verificationToken
      })
    })
  })

  describe('ValidateVerificationToken', () => {
    it('should return 401 (Unauthorized) if invalid or expired verificationToken is provided', async () => {
      const { sut, validateVerificationTokenStub } = makeSut()
      const unauthorizedError = new UnauthorizedError('Verification token mismatch or expired')
      jest.spyOn(validateVerificationTokenStub, 'validate').mockResolvedValueOnce(unauthorizedError)
      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())
      expect(httpResponse).toEqual(unauthorized(unauthorizedError))
    })

    it('should return 500 (ServerError) if verificationToken throws', async () => {
      const { sut, validateVerificationTokenStub } = makeSut()
      jest.spyOn(validateVerificationTokenStub, 'validate').mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('should call validateVerificationToken with correct values', async () => {
      const { sut, validateVerificationTokenStub } = makeSut()
      const codeAuthSpy = jest.spyOn(validateVerificationTokenStub, 'validate')
      await sut.handle(httpRequest)
      expect(codeAuthSpy).toHaveBeenCalledWith(httpRequest.body)
    })
  })

  describe('Logger', () => {
    it('should call logger.error if throws', async () => {
      const { sut, loggerStub, validateVerificationTokenStub } = makeSut()
      const loggerErrorSpy = jest.spyOn(loggerStub, 'error')
      const error = new Error('any_error')
      jest.spyOn(validateVerificationTokenStub, 'validate').mockRejectedValueOnce(error)
      await sut.handle(httpRequest)
      expect(loggerErrorSpy).toHaveBeenCalledWith(error.message, error)
    })
  })

  describe('CreateAccessToken', () => {
    it('should return 500 (ServerError) if CreateAccessToken throws', async () => {
      const { sut, createAccessTokenStub } = makeSut()
      jest.spyOn(createAccessTokenStub, 'create').mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('should call CreateAccessToken with correct values', async () => {
      const { sut, validateVerificationTokenStub, createAccessTokenStub } = makeSut()
      const httpRequest = makeFakeWaitingCodeRequest()
      jest.spyOn(validateVerificationTokenStub, 'validate').mockResolvedValueOnce(true)
      const createAccessTokenSpy = jest.spyOn(createAccessTokenStub, 'create')
      await sut.handle(httpRequest)
      expect(createAccessTokenSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    it('Should return 200 (Success) if valid email is provide', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(success({ accessToken: mockTokenService.anyToken }))
    })
  })
})
