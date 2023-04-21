import { type Controller } from './controller'
import { badRequest, serverError, type HttpRequest, type HttpResponse, success } from '../helpers/http'
import { InvalidParamError, MissingParamError } from '../errors'
import { type EmailValidator } from '@/application/validation/protocols'
import { type Authentication } from '@/domain/use-cases/authentication'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
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
      const authenticationModel = await this.authentication.auth(email, password)
      return success(authenticationModel)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
