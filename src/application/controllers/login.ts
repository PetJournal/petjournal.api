import { type Controller } from './controller'
import { badRequest, type HttpRequest, type HttpResponse } from '../helpers/http'
import { InvalidParamError, MissingParamError } from '../errors'
import { type EmailValidator } from '@/application/validation/protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
    }
    if (!password) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))) })
    }
    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return await new Promise(resolve => { resolve(badRequest(new InvalidParamError('email'))) })
    }
    return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email or password'))) })
  }
}
