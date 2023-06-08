import { type Authentication } from '@/domain/use-cases'
import { type Controller } from '@/application/protocols'
import { type EmailValidator } from '@/application/validation'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import {
  type HttpRequest,
  type HttpResponse,
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/application/helpers'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly emailValidator: EmailValidator

  constructor ({ authentication, emailValidator }: LoginController.Dependencies) {
    this.authentication = authentication
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const result = await this.authentication.auth({
        email,
        sensitiveData: { field: 'password', value: password }
      })
      if (result instanceof Error) {
        return unauthorized(result)
      }
      return success({ accessToken: result })
    } catch (error) {
      console.error(error)
      return serverError(error as Error)
    }
  }
}

export namespace LoginController {
  export interface Dependencies {
    authentication: Authentication
    emailValidator: EmailValidator
  }
}
