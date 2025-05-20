import { type DateValidator } from '@/application/validation'
import validator from 'validator'

export class StartAtValidatorAdapter implements DateValidator {
  isValid (date: string): boolean {
    const dateOfValidation = new Date(date)
    if (isNaN(dateOfValidation.getTime())) {
      return false
    }

    if (dateOfValidation.getDate() > new Date().getDate()) {
      return false
    }

    return validator.isISO8601(date)
  }
}
