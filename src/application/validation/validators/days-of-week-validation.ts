import { type Validation } from '@/application/protocols'
import { type DaysOfWeekValidator } from '../protocols'
import { InvalidParamError } from '@/application/errors'

export class DaysOfWeekValidation implements Validation {
  private readonly fieldDaysOfWeek: string
  private readonly validator: DaysOfWeekValidator

  constructor (fieldDaysOfWeek: string, validator: DaysOfWeekValidator) {
    this.fieldDaysOfWeek = fieldDaysOfWeek
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (!input[this.fieldDaysOfWeek].length) {
      return new InvalidParamError(this.fieldDaysOfWeek)
    }
    for (let i = 0; i < input[this.fieldDaysOfWeek].length; i++) {
      if (typeof input[this.fieldDaysOfWeek][i] !== 'number') {
        return new InvalidParamError(this.fieldDaysOfWeek)
      }
    }
    const isValid = this.validator.isValid(input[this.fieldDaysOfWeek])
    if (!isValid) {
      return new InvalidParamError(this.fieldDaysOfWeek)
    }
  }
}
