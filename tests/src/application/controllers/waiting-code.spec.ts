import { WaitingCodeController } from '@/application/controllers/waiting-code'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import { badRequest, success, unauthorized } from '@/application/helpers/http'
import { type EmailValidator } from '@/application/validation/protocols'
import { type Authentication } from '@/domain/use-cases'
import {
  makeAuthentication,
  makeEmailValidator,
  makeFakeServerError,
  makeFakeWaitingCodeRequest
} from '@/tests/utils'

interface SutTypes {
  sut: WaitingCodeController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new WaitingCodeController({ emailValidator: emailValidatorStub, authentication: authenticationStub })
  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  describe('tests the verificationToken field', () => {
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

    it('should return unauthorized if invalid verificationToken is provided', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(new Error())

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(unauthorized(new Error()))
    })

    it('should call Authentication with correct values', async () => {
      const { sut, authenticationStub } = makeSut()
      const httpRequest = makeFakeWaitingCodeRequest()
      const codeAuthSpy = jest.spyOn(authenticationStub, 'auth')

      await sut.handle(makeFakeWaitingCodeRequest())

      expect(codeAuthSpy).toHaveBeenCalledWith({
        email: httpRequest.body.email,
        sensitiveData: { field: 'verificationToken', value: httpRequest.body.verificationToken }
      })
    })

    it('should throws if Authentication throws', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test success case', () => {
    it('should return accessToken if valid input is provided', async () => {
      const { sut } = makeSut()

      const httpResponse = await sut.handle(makeFakeWaitingCodeRequest())

      expect(httpResponse).toEqual(success({ accessToken: 'any_token' }))
    })
  })
})
