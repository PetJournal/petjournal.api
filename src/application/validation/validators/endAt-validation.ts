import { InvalidParamError } from '@/application/errors'
import { type Validation } from '@/application/protocols'
import { type DateValidator } from '../protocols'

export class EndAtValidation implements Validation {
  private readonly fieldEndAt: string
  private readonly endAtValidator: DateValidator

  constructor (fieldEndAt: string, validator: DateValidator) {
    this.fieldEndAt = fieldEndAt
    this.endAtValidator = validator
  }

  validate (input: any): void | Error {
    if (typeof input[this.fieldEndAt] !== 'string' && input[this.fieldEndAt] !== null) {
      return new InvalidParamError(this.fieldEndAt)
    }

    const isValid = this.endAtValidator.isValid(input[this.fieldEndAt])
    if (!isValid) {
      return new InvalidParamError(this.fieldEndAt)
    }
  }
}
