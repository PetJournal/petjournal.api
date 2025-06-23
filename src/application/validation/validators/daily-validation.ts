import { type Validation } from '@/application/protocols'
import { type BooleanValidator } from '../protocols'
import { InvalidParamError } from '@/application/errors'

export class DailyValidation implements Validation {
  private readonly fieldDaily: string
  private readonly validator: BooleanValidator

  constructor (fieldDaily: string, validator: BooleanValidator) {
    this.fieldDaily = fieldDaily
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (typeof input[this.fieldDaily] !== 'boolean' && input[this.fieldDaily] !== null) {
      return new InvalidParamError(this.fieldDaily)
    }
    const isValid = this.validator.isValid(input[this.fieldDaily])
    if (!isValid) {
      return new InvalidParamError(this.fieldDaily)
    }
  }
}
