import { type DateValidator } from '@/application/validation'
import validator from 'validator'
export class DateOfBirthValidatorAdapter implements DateValidator {
  isValid (date: string): boolean {
    const dateOfValidation = new Date(date)
    if (isNaN(dateOfValidation.getTime())) {
      return false
    }

    if (dateOfValidation > new Date()) {
      return false
    }

    const isValid = validator.isISO8601(date)
    return isValid
  }
}
