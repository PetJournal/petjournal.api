import { type Controller } from '@/application/controllers/controller'
import { type HttpRequest, type HttpResponse, badRequest, serverError } from '@/application/helpers/http'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import { type EmailValidator } from '../validation/protocols'

export class WaitingCodeController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'forgetPasswordCode']
    for (const field of requiredFields) {
      if (httpRequest.body[field] === undefined) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email } = httpRequest.body
    const isEmailValid = this.emailValidator.isValid(email)
    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return serverError(new Error())
  }
}
