import { type Controller } from '@/application/controllers/controller'
import {
  type HttpRequest,
  type HttpResponse,
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/application/helpers/http'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import { type Authentication } from '@/domain/use-cases/authentication'
import { type EmailValidator } from '@/application/validation/protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (
    emailValidator: EmailValidator,
    authentication: Authentication
  ) {
    this.emailValidator = emailValidator
    this.authentication = authentication
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
