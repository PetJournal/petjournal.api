import { type DaysOfWeekValidator } from '@/application/validation'

export class DaysOfWeekValidatorAdapter implements DaysOfWeekValidator {
  isValid (days: number[]): boolean {
    for (let i = 0; i < days.length; i++) {
      if (isNaN(days[i])) {
        return false
      }
      if (!days.every(day => day >= 0 && day <= 6)) {
        return false
      }
    }
    if (!days.length) {
      return false
    }
    return true
  }
}
