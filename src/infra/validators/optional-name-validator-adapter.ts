import { type NameValidator } from '@/application/validation'
import validator from 'validator'

export class OptionalNameValidatorAdapter implements NameValidator {
  isValid (name: string | undefined): boolean {
    const isValidName = (field: string): boolean => validator.matches(field, /^[a-zA-Z]{3,}$/)

    if (name === undefined || isValidName(name)) {
      return true
    }

    return false
  }
}
