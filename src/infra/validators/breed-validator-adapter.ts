import { type BreedValidator } from '@/application/validation/protocols/breed-validator'
import validator from 'validator'

export class BreedValidatorAdapter implements BreedValidator {
  isValid (breedName: string): boolean {
    const isValidName = (field: string): boolean => validator.matches(field, /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]{3,}$/)

    if (isValidName(breedName)) {
      return true
    }

    return false
  }
}
