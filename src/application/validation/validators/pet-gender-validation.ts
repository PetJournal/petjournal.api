import { InvalidParamError } from '@/application/errors'
import { PetGender } from '@/domain/models/pet'

export class PetGenderValidation {
  constructor (
    private readonly fieldName: string
  ) {}

  validate (input: any): Error | void {
    const gender = input[this.fieldName]

    if (typeof gender !== 'string') {
      return new InvalidParamError(this.fieldName)
    }

    if (!Object.values(PetGender).includes(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
