import { type NameValidator } from '@/application/validation'
import validator from 'validator'

export class NameValidatorAdapter implements NameValidator {
  isValid (name: string): boolean {
    const isValidName = (field: string): boolean => validator.matches(field, /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]{3,}$/)

    if (isValidName(name)) {
      return true
    }

    return false
  }
}
