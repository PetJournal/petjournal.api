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
import { type Authentication } from '@/domain/use-cases'

export class WaitingCodeController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor ({ emailValidator, authentication }: WaitingCodeController.Dependencies) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'forgetPasswordCode']
      for (const field of requiredFields) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, forgetPasswordCode } = httpRequest.body
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const result = await this.authentication.auth({
        email,
        sensitiveData: { field: 'forgetPasswordCode', value: forgetPasswordCode }
      })
      if (result instanceof Error) {
        return unauthorized(result)
      }
      return success({ accessToken: result })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

namespace WaitingCodeController {
  export interface Dependencies {
    emailValidator: EmailValidator
    authentication: Authentication
  }
}
