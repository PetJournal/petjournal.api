import { InvalidParamError, MissingParamError } from '../errors'
import { type EmailValidator, type NameValidator, type PasswordValidator, type PhoneValidator } from '../validation/protocols'
import { badRequest, serverError, success, type HttpRequest, type HttpResponse } from '../helpers/http'
import { type Controller } from './controller'
import { type AddGuardian } from 'domain/use-cases/add-guardian'

export class SignUpController implements Controller {
  private readonly addGuardian: AddGuardian
  private readonly emailValidator: EmailValidator
  private readonly nameValidator: NameValidator
  private readonly passwordValidator: PasswordValidator
  private readonly phoneValidator: PhoneValidator

  constructor (addGuardian: AddGuardian, emailValidator: EmailValidator, nameValidator: NameValidator, passwordValidator: PasswordValidator, phoneValidator: PhoneValidator) {
    this.emailValidator = emailValidator
    this.addGuardian = addGuardian
    this.nameValidator = nameValidator
    this.passwordValidator = passwordValidator
    this.phoneValidator = phoneValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation', 'isPrivacyPolicyAccepted']
      for (const field of requiredFields) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { firstName, lastName, email, phone, password, passwordConfirmation, isPrivacyPolicyAccepted } = httpRequest.body
      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      if (!isPrivacyPolicyAccepted) {
        return badRequest(new InvalidParamError('isPrivacyPolicyAccepted'))
      }
      const isValidName = this.nameValidator.isValid(firstName, lastName)
      if (!isValidName) {
        return badRequest(new InvalidParamError('name'))
      }
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }
      const isValidPassword = this.passwordValidator.isValid(password)
      if (!isValidPassword) {
        return badRequest(new InvalidParamError('password'))
      }
      const isValidPhone = this.phoneValidator.isValid(phone)
      if (!isValidPhone) {
        return badRequest(new InvalidParamError('phone'))
      }
      const guardian = await this.addGuardian.add({
        firstName,
        lastName,
        email,
        phone,
        password,
        isPrivacyPolicyAccepted
      })
      return success(guardian)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
