import { WaitingCodeController } from '@/application/controllers/waiting-code'
import { InvalidParamError, MissingParamError, NotFoundError, UnauthorizedError } from '@/application/errors'
import { badRequest, success, unauthorized } from '@/application/helpers/http'
import { type EmailValidator } from '@/application/validation/protocols'
import { type CreateAccessToken, type ValidateVerificationToken } from '@/domain/use-cases'
import {
  makeCreateAccessToken,
  makeEmailValidator,
  makeFakeServerError,
  makeFakeWaitingCodeRequest,
  validateVerificationToken
} from '@/tests/utils'

interface SutTypes {
  sut: WaitingCodeController
  emailValidatorStub: EmailValidator
  createAccessTokenStub: CreateAccessToken
  validateVerificationTokenStub: ValidateVerificationToken
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const createAccessTokenStub = makeCreateAccessToken()
  const validateVerificationTokenStub = validateVerificationToken()
  const sut = new WaitingCodeController({
    emailValidator: emailValidatorStub,
    createAccessToken: createAccessTokenStub,
    validateVerificationToken: validateVerificationTokenStub
  })
  return {
    sut,
    emailValidatorStub,
    createAccessTokenStub,
    validateVerificationTokenStub
  }
}

describe('WaitingCode Controller', () => {
  describe('tests the email field', () => {
    it('should return bad request if no email is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: { verificationToken: 'valid_code' }
      }

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('should return bad request if invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    it('should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

      await sut.handle(makeFakeWaitingCodeRequest())

      expect(isValidSpy).toHaveBeenCalledWith(makeFakeWaitingCodeRequest().body.email)
    })

    it('should throws if EmailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('tests the ValidateVerificationToken', () => {
    it('should return bad request if no verificationToken is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'valid_email'
        }
      }

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('verificationToken')))
    })

    it('should return unauthorized if invalid or expired verificationToken is provided', async () => {
      const { sut, validateVerificationTokenStub } = makeSut()
      const unauthorizedError = new UnauthorizedError('Verification token mismatch or expired')
      jest.spyOn(validateVerificationTokenStub, 'validate').mockResolvedValueOnce(unauthorizedError)

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(unauthorized(unauthorizedError))
    })

    it('should return serverError if verificationToken throws', async () => {
      const { sut, validateVerificationTokenStub } = makeSut()
      jest.spyOn(validateVerificationTokenStub, 'validate').mockRejectedValueOnce(new Error())

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('should call validateVerificationToken with correct values', async () => {
      const { sut, validateVerificationTokenStub } = makeSut()
      const httpRequest = makeFakeWaitingCodeRequest()
      const codeAuthSpy = jest.spyOn(validateVerificationTokenStub, 'validate')

      await sut.handle(httpRequest)

      expect(codeAuthSpy).toHaveBeenCalledWith({
        email: httpRequest.body.email,
        verificationToken: httpRequest.body.verificationToken
      })
    })
  })
  describe('test createAccessToken', () => {
    it('should call createAccessToken with correct values', async () => {
      const { sut, validateVerificationTokenStub, createAccessTokenStub } = makeSut()
      const httpRequest = makeFakeWaitingCodeRequest()
      jest.spyOn(validateVerificationTokenStub, 'validate').mockResolvedValueOnce(true)
      const createAccessTokenSpy = jest.spyOn(createAccessTokenStub, 'create')

      await sut.handle(httpRequest)

      expect(createAccessTokenSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    it('should return badRequest if createAccessToken return an error', async () => {
      const { sut, createAccessTokenStub } = makeSut()
      jest.spyOn(createAccessTokenStub, 'create').mockResolvedValueOnce(new NotFoundError('email'))

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(badRequest(new NotFoundError('email')))
    })

    it('should throws if createAccessToken throws', async () => {
      const { sut, createAccessTokenStub } = makeSut()
      jest.spyOn(createAccessTokenStub, 'create').mockRejectedValueOnce(new Error())

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test success case', () => {
    it('should return accessToken if valid input is provided', async () => {
      const { sut } = makeSut()

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(success({ accessToken: 'valid_token' }))
    })
  })
})
