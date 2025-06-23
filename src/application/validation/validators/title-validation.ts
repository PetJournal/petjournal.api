import { type Validation } from '@/application/protocols'
import { type TitleValidator } from '../protocols'
import { InvalidParamError } from '@/application/errors'

export class TitleValidation implements Validation {
  private readonly fieldTitle: string
  private readonly validator: TitleValidator

  constructor (fieldTitle: string, validator: TitleValidator) {
    this.fieldTitle = fieldTitle
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (typeof input[this.fieldTitle] !== 'string' && input[this.fieldTitle] !== null) {
      return new InvalidParamError(this.fieldTitle)
    }
    const isValid = this.validator.isValid(input[this.fieldTitle])
    if (!isValid) {
      return new InvalidParamError(this.fieldTitle)
    }
  }
}
