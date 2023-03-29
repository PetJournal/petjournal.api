import { InvalidParamError, MissingParamError } from '../errors'
import { type EmailValidator } from 'application/validation/email-validator'
import { badRequest, serverError, type HttpRequest, type HttpResponse } from '../helpers/http'
import { type Controller } from './controller'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation', 'isProvicyPolicyAccepted']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirmation } = httpRequest.body
      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
