import { type EmailValidator } from '../protocols/email-validator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return false
  }
}
