import { type Controller } from '@/application/controllers/controller'
import { type HttpRequest, type HttpResponse, badRequest, serverError, unauthorized } from '@/application/helpers/http'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import { type EmailValidator } from '../validation/protocols'
import { type ForgetCodeAuthentication } from '@/domain/use-cases'

export class WaitingCodeController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly forgetCodeAuthentication: ForgetCodeAuthentication

  constructor (emailValidator: EmailValidator, forgetCodeAuthentication: ForgetCodeAuthentication) {
    this.emailValidator = emailValidator
    this.forgetCodeAuthentication = forgetCodeAuthentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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
    const codeAuthorized = await this.forgetCodeAuthentication.auth({
      email,
      forgetPasswordCode
    })
    if (!codeAuthorized) {
      return unauthorized()
    }

    return serverError(new Error())
  }
}
