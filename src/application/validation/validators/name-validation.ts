import { type NameValidator } from '@/application/validation'
import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class NameValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly validator: NameValidator
  ) {}

  validate (input: any): Error | void {
    const isValid = this.validator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
