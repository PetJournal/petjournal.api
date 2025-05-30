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
    if (!input.daysOfWeek.length) {
      return new InvalidParamError(this.fieldDaysOfWeek)
    }
    for (let i = 0; i < input.daysOfWeek.length; i++) {
      if (typeof input.daysOfWeek[i] !== 'number') {
        return new InvalidParamError(this.fieldDaysOfWeek)
      }
    }
    const isValid = this.validator.isValid(input.daysOfWeek)
    if (!isValid) {
      return new InvalidParamError(this.fieldDaysOfWeek)
    }
  }
}
