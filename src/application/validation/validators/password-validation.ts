import { type PasswordValidator } from '@/application/validation'
import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class PasswordValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly validator: PasswordValidator,
    private readonly customError?: () => Error
  ) {}

  validate (input: any): Error | void {
    const isValid = this.validator.isValid(input[this.fieldName])
    if (!isValid) {
      if (this.customError) {
        return this.customError()
      } else {
        return new InvalidParamError(this.fieldName)
      }
    }
  }
}
