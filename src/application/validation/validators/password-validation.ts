import { type PasswordValidator } from '@/application/validation'
import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class PasswordValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly passwordValidator: PasswordValidator
  ) {}

  validate (input: any): Error | void {
    const isValid = this.passwordValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
