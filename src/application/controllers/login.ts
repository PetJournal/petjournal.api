import { type Controller } from './controller'
import { badRequest, type HttpRequest, type HttpResponse } from '../helpers/http'
import { MissingParamError } from '../errors'
import { type EmailValidator } from '@/application/validation/protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
    }
    if (!httpRequest.body.password) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))) })
    }
    this.emailValidator.isValid(httpRequest.body.email)
    return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email or password'))) })
  }
}
