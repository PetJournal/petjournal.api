import { type NameValidator } from '@/application/validation'
import validator from 'validator'

export class NameValidatorAdapter implements NameValidator {
  isValid (firstName: string, lastName: string): boolean {
    const isValidName = (field: string): boolean => validator.matches(field, /^[a-zA-Z]{3,}$/)

    if (isValidName(firstName) && isValidName(lastName)) {
      return true
    }

    return false
  }
}
