import { type Validation } from '@/application/protocols'
import { MissingParamError } from '@/application/errors'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error | void {
    if (!(this.fieldName in input)) {
      return new MissingParamError(this.fieldName)
    }
  }
}
