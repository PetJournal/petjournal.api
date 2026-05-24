import { InvalidParamError } from '@/application/errors'
import { type Validation } from '@/application/protocols'
import { type CastratedValidator } from '../protocols'

export class CastratedValidation implements Validation {
  private readonly fieldName: string
  private readonly validator: CastratedValidator

  constructor (fieldName: string, validator: CastratedValidator) {
    this.fieldName = fieldName
    this.validator = validator
  }

  validate (input: any): void | Error {
    if (typeof input[this.fieldName] !== 'boolean' && input[this.fieldName] !== null) {
      return new InvalidParamError(this.fieldName)
    }
    const isValid = this.validator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
