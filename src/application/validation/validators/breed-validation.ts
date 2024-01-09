import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'
import { type BreedValidator } from '../protocols/breed-validator'

export class BreedValidation implements Validation {
  private readonly breedName: string
  private readonly validator: BreedValidator

  constructor (breedName: string, validator: BreedValidator) {
    this.breedName = breedName
    this.validator = validator
  }

  validate (input: any): void | Error {
    if (typeof input[this.breedName] !== 'string') {
      return new InvalidParamError(this.breedName)
    }
    const isValid = this.validator.isValid(input[this.breedName])
    if (!isValid) {
      return new InvalidParamError(this.breedName)
    }
  }
}
