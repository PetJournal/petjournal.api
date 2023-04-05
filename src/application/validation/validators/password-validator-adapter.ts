import { type PasswordValidator } from '../protocols'

export class PasswordValidatorAdapter implements PasswordValidator {
  isValid (password: string): boolean {
    return false
  }
}
