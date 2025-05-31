import { type DateValidator } from '@/application/validation'
import validator from 'validator'

export class EndAtValidatorAdapter implements DateValidator {
  isValid (date: string): boolean {
    const dateOfValidation = new Date(date)
    if (!validator.isISO8601(date)) {
      return false
    }

    if (dateOfValidation < new Date()) {
      return false
    }

    return true
  }
}
