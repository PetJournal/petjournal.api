import { InvalidParamError } from '@/application/errors'
import { type Validation } from '@/application/protocols'
import { type ColorValidator } from '../protocols'

export class ColorValidation implements Validation {
  private readonly fieldName: string
  private readonly validator: ColorValidator

  constructor (fieldName: string, validator: ColorValidator) {
    this.fieldName = fieldName
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (typeof input[this.fieldName] !== 'string') {
      return new InvalidParamError(this.fieldName)
    }
    const isValid = this.validator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
