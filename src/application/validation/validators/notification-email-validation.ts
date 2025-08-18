import { type Validation } from '@/application/protocols'
import { type BooleanValidator } from '../protocols'
import { InvalidParamError } from '@/application/errors'

export class NotificationEmailValidation implements Validation {
  private readonly fieldName: string
  private readonly validator: BooleanValidator

  constructor (fieldName: string, validator: BooleanValidator) {
    this.fieldName = fieldName
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (typeof input[this.fieldName] !== 'boolean' && input[this.fieldName] !== null) {
      return new InvalidParamError(this.fieldName)
    }
    const isValid = this.validator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
