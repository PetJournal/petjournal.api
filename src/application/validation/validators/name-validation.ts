import { type NameValidator } from '@/application/validation'
import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class NameValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly nameValidator: NameValidator
  ) {}

  validate (input: any): Error | void {
    const isValid = this.nameValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
