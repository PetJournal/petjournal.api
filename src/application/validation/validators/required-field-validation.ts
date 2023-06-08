import { type Validation } from '@/application/protocols'
import { MissingParamError } from '@/application/errors'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error | void {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
