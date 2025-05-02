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

  validate (input: number[]): Error | void {
    for (let i = 0; i < input.length; i++) {
      if (typeof input[i] !== 'number' && input[i] !== null) {
        return new InvalidParamError(this.fieldDaysOfWeek)
      }
    }
    const isValid = this.validator.isValid(input)
    if (!isValid) {
      return new InvalidParamError(this.fieldDaysOfWeek)
    }
  }
}
