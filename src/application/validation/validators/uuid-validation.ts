import { type Validation } from '@/application/protocols'
import { type UuidValidator } from '../protocols'
import { InvalidParamError } from '@/application/errors'

export class UuidValidation implements Validation {
  private readonly fieldName: string
  private readonly validator: UuidValidator

  constructor (fieldName: string, validator: UuidValidator) {
    this.fieldName = fieldName
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (typeof input[this.fieldName] !== 'string' && input[this.fieldName] !== null) {
      return new InvalidParamError(this.fieldName)
    }
    const isValid = this.validator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
