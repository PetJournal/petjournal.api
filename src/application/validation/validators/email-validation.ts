import { type EmailValidator } from '@/application/validation'
import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly validator: EmailValidator
  ) {}

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
