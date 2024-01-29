import { type Validation } from '@/application/protocols'
import { type SizeValidator } from '@/application/validation'
import { InvalidParamError } from '@/application/errors'

export class SizeValidation implements Validation {
  private readonly size: string
  private readonly validator: SizeValidator

  constructor (size: string, validator: SizeValidator) {
    this.size = size
    this.validator = validator
  }

  validate (input: any): void | Error {
    if (typeof input[this.size] !== 'string') {
      return new InvalidParamError(this.size)
    }
    const isValid = this.validator.isValid(input[this.size])
    if (!isValid) {
      return new InvalidParamError(this.size)
    }
  }
}
