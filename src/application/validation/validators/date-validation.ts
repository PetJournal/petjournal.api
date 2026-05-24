import { InvalidParamError } from '@/application/errors'
import { type Validation } from '@/application/protocols'
import { type DateValidator } from '../protocols'

export class DateValidation implements Validation {
  private readonly fieldName: string
  private readonly dateValidator: DateValidator

  constructor (fieldName: string, dateValidator: DateValidator) {
    this.fieldName = fieldName
    this.dateValidator = dateValidator
  }

  validate (input: any): void | Error {
    if (typeof input[this.fieldName] !== 'string' && input[this.fieldName] !== null) {
      return new InvalidParamError(this.fieldName)
    }

    const isValid = this.dateValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
