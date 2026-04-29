import { type EndAtDateValidator } from '@/application/validation'
import validator from 'validator'
import { DateTime } from 'luxon'

export class EndAtValidatorAdapter implements EndAtDateValidator {
  isValid (startAt: string, endAt: string): boolean {
    if (!validator.isISO8601(endAt) || !endAt.endsWith('Z')) {
      return false
    }

    const dateOfValidation = DateTime.fromISO(endAt, { zone: 'utc' }).set({ year: 2000, month: 1, day: 1, millisecond: 0 })
    const dateStartAt = DateTime.fromISO(startAt, { zone: 'utc' }).set({ year: 2000, month: 1, day: 1, millisecond: 0 })
    if (dateOfValidation.diff(dateStartAt, 'seconds').seconds < 0) {
      return false
    }

    return true
  }
}
