import { EmailValidatorAdapter } from './email-validator-adapter'
import { PhoneValidatorAdapter } from './phone-validator-adapter'
import { type EmailValidator, type PhoneValidator } from '@/application/validation/protocols'

export class IdentifierValidator implements EmailValidator, PhoneValidator {
  private readonly emailValidator: EmailValidatorAdapter
  private readonly phoneValidator: PhoneValidatorAdapter

  constructor () {
    this.emailValidator = new EmailValidatorAdapter()
    this.phoneValidator = new PhoneValidatorAdapter()
  }

  isValid (identifier: string): boolean {
    if (this.emailValidator.isValid(identifier)) {
      return true
    }
    if (this.phoneValidator.isValid(identifier)) {
      return true
    }
    return false
  }
}
