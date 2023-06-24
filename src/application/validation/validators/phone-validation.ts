import { type PhoneValidator } from '@/application/validation'
import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class PhoneValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly validator: PhoneValidator
  ) {}

  validate (input: any): Error | void {
    const isValid = this.validator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
