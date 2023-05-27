import { type Authentication } from '@/domain/use-cases'
import { type Controller } from '@/application/protocols'
import { type EmailValidator } from '@/application/validation'
import { type HttpRequest, type HttpResponse, badRequest, serverError, success, unauthorized } from '@/application/helpers'
import { InvalidParamError, MissingParamError } from '@/application/errors'

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
      const accessToken = await this.authentication.auth({
        email,
        password
      })
      if (!accessToken) {
        return unauthorized()
      }
      return success({ accessToken })
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
