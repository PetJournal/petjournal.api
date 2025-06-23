import { type Validation } from '@/application/protocols'
import { type UuidValidator } from '../protocols'
import { InvalidParamError } from '@/application/errors'

export class PetsIdValidation implements Validation {
  private readonly pets: string
  private readonly validator: UuidValidator

  constructor (pets: string, validator: UuidValidator) {
    this.pets = pets
    this.validator = validator
  }

  validate (input: string[]): Error | void {
    for (let i = 0; i < input.length; i++) {
      if (typeof input[i] !== 'string' && input[i] !== null) {
        return new InvalidParamError(this.pets)
      }
      const isValid = this.validator.isValid(input[i])
      if (!isValid) {
        return new InvalidParamError(this.pets)
      }
    }
  }
}
