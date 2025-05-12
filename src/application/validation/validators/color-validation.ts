import { InvalidParamError } from '@/application/errors'
import { type Validation } from '@/application/protocols'
import { type ColorValidator } from '../protocols'

export class ColorValidation implements Validation {
  private readonly color: string
  private readonly validator: ColorValidator

  constructor (color: string, validator: ColorValidator) {
    this.color = color
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (typeof input[this.color] !== 'string') {
      return new InvalidParamError(this.color)
    }
    const isValid = this.validator.isValid(input[this.color])
    if (!isValid) {
      return new InvalidParamError(this.color)
    }
  }
}
