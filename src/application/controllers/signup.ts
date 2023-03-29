import { InvalidParamError, MissingParamError } from '../errors'
import { type EmailValidator } from 'application/validation/email-validator'
import { badRequest, serverError, success, type HttpRequest, type HttpResponse } from '../helpers/http'
import { type Controller } from './controller'
import { type AddGuardian } from 'domain/use-cases/add-guardian'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addGuardian: AddGuardian

  constructor (emailValidator: EmailValidator, addGuardian: AddGuardian) {
    this.emailValidator = emailValidator
    this.addGuardian = addGuardian
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation', 'isProvicyPolicyAccepted']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { firstName, lastName, email, phone, password, passwordConfirmation, isProvicyPolicyAccepted } = httpRequest.body
      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      if (!isProvicyPolicyAccepted) {
        return badRequest(new InvalidParamError('isProvicyPolicyAccepted'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const guardian = this.addGuardian.add({
        firstName,
        lastName,
        email,
        phone,
        password,
        isProvicyPolicyAccepted
      })
      return success(guardian)
    } catch (error) {
      return serverError()
    }
  }
}
