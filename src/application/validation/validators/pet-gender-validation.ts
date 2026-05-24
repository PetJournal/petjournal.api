import { InvalidParamError } from '@/application/errors'
import { type Validation } from '@/application/protocols'
import { type PetGenderValidator } from '../protocols'

export class PetGenderValidation implements Validation {
  private readonly fieldName: string
  private readonly validator: PetGenderValidator

  constructor (fieldName: string, validator: PetGenderValidator) {
    this.fieldName = fieldName
    this.validator = validator
  }

  validate (input: any): Error | void {
    const gender = input[this.fieldName]

    if (typeof gender !== 'string' && input[this.fieldName] !== null) {
      return new InvalidParamError(this.fieldName)
    }
    const isValid = this.validator.isValid(input, this.fieldName)
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
