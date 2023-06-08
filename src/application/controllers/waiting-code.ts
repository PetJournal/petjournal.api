import { type Controller } from '@/application/controllers/controller'
import {
  type HttpRequest,
  type HttpResponse,
  badRequest,
  unauthorized,
  success,
  serverError
} from '@/application/helpers/http'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import { type EmailValidator } from '../validation/protocols'
import { type ValidateVerificationToken } from '@/domain/use-cases/validate-verification-token'
import { type CreateAccessToken } from '@/domain/use-cases/create-access-token'

export class WaitingCodeController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly validateVerificationToken: ValidateVerificationToken
  private readonly createAccessToken: CreateAccessToken

  constructor ({ emailValidator, validateVerificationToken, createAccessToken }: WaitingCodeController.Dependencies) {
    this.emailValidator = emailValidator
    this.validateVerificationToken = validateVerificationToken
    this.createAccessToken = createAccessToken
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'verificationToken']
      for (const field of requiredFields) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, verificationToken } = httpRequest.body
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const tokenIsValid = await this.validateVerificationToken.validate({
        email,
        verificationToken
      })
      if (tokenIsValid instanceof Error) {
        return unauthorized(tokenIsValid)
      }
      const accessToken = await this.createAccessToken.create(email)
      if (accessToken instanceof Error) {
        return badRequest(accessToken)
      }
      return success({ accessToken })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

namespace WaitingCodeController {
  export interface Dependencies {
    emailValidator: EmailValidator
    validateVerificationToken: ValidateVerificationToken
    createAccessToken: CreateAccessToken
  }
}
