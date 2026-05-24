import { InvalidParamError } from '@/application/errors'
import { type Validation } from '@/application/protocols'
import { type DateValidator } from '../protocols'

export class StartAtValidation implements Validation {
  private readonly fieldStartAt: string
  private readonly startAtValidator: DateValidator

  constructor (fieldStartAt: string, validator: DateValidator) {
    this.fieldStartAt = fieldStartAt
    this.startAtValidator = validator
  }

  validate (input: any): void | Error {
    if (typeof input[this.fieldStartAt] !== 'string' && input[this.fieldStartAt] !== null) {
      return new InvalidParamError(this.fieldStartAt)
    }

    const isValid = this.startAtValidator.isValid(input[this.fieldStartAt])
    if (!isValid) {
      return new InvalidParamError(this.fieldStartAt)
    }
  }
}
