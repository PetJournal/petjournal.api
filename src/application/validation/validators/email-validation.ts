import { type EmailValidator } from '@/application/validation'
import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | void {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
