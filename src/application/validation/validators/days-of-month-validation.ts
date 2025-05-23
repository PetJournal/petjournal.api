import { type Validation } from '@/application/protocols'
import { type DaysOfMonthValidator } from '../protocols'
import { InvalidParamError } from '@/application/errors'

export class DaysOfMonthValidation implements Validation {
  private readonly fieldDaysOfMonth: string
  private readonly validator: DaysOfMonthValidator

  constructor (fieldDaysOfMonth: string, validator: DaysOfMonthValidator) {
    this.fieldDaysOfMonth = fieldDaysOfMonth
    this.validator = validator
  }

  validate (input: number[]): Error | void {
    if (!input.length) {
      return new InvalidParamError(this.fieldDaysOfMonth)
    }
    for (let i = 0; i < input.length; i++) {
      if (typeof input[i] !== 'number') {
        return new InvalidParamError(this.fieldDaysOfMonth)
      }
    }
    const isValid = this.validator.isValid(input)
    if (!isValid) {
      return new InvalidParamError(this.fieldDaysOfMonth)
    }
  }
}
