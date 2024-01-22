import { type SizeValidator } from '@/application/validation/protocols'
import validator from 'validator'

export class SizeValidatorAdapter implements SizeValidator {
  isValid (size: string): boolean {
    const isValidName = (field: string): boolean => validator.matches(field, /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ()]/)
    if (isValidName(size)) {
      return true
    }
    return false
  }
}
