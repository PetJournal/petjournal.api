import { type DateValidator } from '@/application/validation'
import validator from 'validator'

export class EndAtValidatorAdapter implements DateValidator {
  isValid (date: string): boolean {
    const dateWithoutTimeZone = new Date(date)
    const timeZone = (+3 * 60 * 60 * 1000)
    const dateOfValidation = new Date(dateWithoutTimeZone.getTime() + timeZone)
    if (!validator.isISO8601(date)) {
      return false
    }

    if (dateOfValidation < new Date()) {
      return false
    }

    return true
  }
}
