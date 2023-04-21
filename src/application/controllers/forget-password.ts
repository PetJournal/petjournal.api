import { InvalidParamError, MissingParamError } from '../errors'
import { type HttpRequest, type HttpResponse, badRequest, success } from '../helpers/http'
import { type EmailValidator } from '../validation/protocols'
import { type Controller } from './controller'

export class ForgetPasswordController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }

    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return success('')
  }
}
