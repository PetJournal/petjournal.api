import { InvalidParamError } from '@/application/errors'
import { type Validation } from '@/application/protocols'
import { type EndAtDateValidator } from '../protocols'

export class EndAtValidation implements Validation {
  private readonly fieldEndAt: string
  private readonly fieldStartAt: string
  private readonly endAtValidator: EndAtDateValidator

  constructor (fieldEndAt: string, fieldStartAt: string, validator: EndAtDateValidator) {
    this.fieldEndAt = fieldEndAt
    this.fieldStartAt = fieldStartAt
    this.endAtValidator = validator
  }

  validate (input: any): void | Error {
    if (typeof input[this.fieldEndAt] !== 'string' && input[this.fieldEndAt] !== null) {
      return new InvalidParamError(this.fieldEndAt)
    }

    const isValid = this.endAtValidator.isValid(input[this.fieldStartAt], input[this.fieldEndAt])
    if (!isValid) {
      return new InvalidParamError(this.fieldEndAt)
    }
  }
}
