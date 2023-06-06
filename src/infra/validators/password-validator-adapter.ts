import { type PasswordValidator } from '@/application/validation'
import validator from 'validator'

export class PasswordValidatorAdapter implements PasswordValidator {
  isValid (password: string): boolean {
    return validator.isStrongPassword(password)
  }
}
