import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
    private readonly customError?: () => Error
  ) {}

  validate (input: any): Error | void {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      if (this.customError) {
        return this.customError()
      } else {
        return new InvalidParamError(this.fieldToCompareName)
      }
    }
  }
}
