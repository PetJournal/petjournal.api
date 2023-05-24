import { WaitingCodeController } from '@/application/controllers/waiting-code'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import { badRequest } from '@/application/helpers/http'
import { type EmailValidator } from '@/application/validation/protocols'
import { makeEmailValidator } from '@/tests/utils'

interface SutTypes {
  sut: WaitingCodeController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new WaitingCodeController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('WaitingCode Controller', () => {
  describe('tests the email field', () => {
    it('should return bad request if no email is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {}
      }

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('should return bad request if invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const httpRequest = {
        body: {
          email: 'invalid_email',
          forgetPasswordCode: 'valid_code'
        }
      }
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    it('should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const httpRequest = {
        body: {
          email: 'valid_email',
          forgetPasswordCode: 'valid_code'
        }
      }
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

      await sut.handle(httpRequest)

      expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })
  })

  describe('tests the forgetPasswordCode field', () => {
    it('should return bad request if no forgetPasswordCode is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'valid_email'
        }
      }

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('forgetPasswordCode')))
    })
  })
})
