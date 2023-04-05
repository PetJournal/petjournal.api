import { type PasswordValidator } from '../protocols'
import validator from 'validator'

export class PasswordValidatorAdapter implements PasswordValidator {
  isValid (password: string): boolean {
    return validator.isStrongPassword(password)
  }
}
