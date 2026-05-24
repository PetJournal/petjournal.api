import { type PetGenderValidator } from '@/application/validation/protocols'
import { PetGender } from '@/domain/models/pet'

export class PetGenderValidatorAdapter implements PetGenderValidator {
  isValid (input: any, fieldName: string): boolean {
    if (!Object.values(PetGender).includes(input[fieldName])) {
      return false
    }
    return true
  }
}
