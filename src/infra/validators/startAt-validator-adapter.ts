import { type DateValidator } from '@/application/validation'
import validator from 'validator'
import { DateTime } from 'luxon'

export class StartAtValidatorAdapter implements DateValidator {
  isValid (date: string): boolean {
    if (!validator.isISO8601(date) || !date.endsWith('Z')) {
      return false
    }

    const dateOfValidation = DateTime.fromISO(date, { zone: 'utc' })
    const dateNow = DateTime.fromISO(DateTime.now().toFormat('HH:mm:ss'), { zone: 'utc' })
    if (dateOfValidation < dateNow) {
      return false
    }

    return true
  }
}
