import { type DaysOfMonthValidator } from '@/application/validation'

export class DaysOfMonthValidatorAdapter implements DaysOfMonthValidator {
  isValid (days: number[]): boolean {
    for (let i = 0; i < days.length; i++) {
      if (isNaN(days[i])) {
        return false
      }
      if (!days.every(day => day >= 0 && day <= 30)) {
        return false
      }
    }
    if (!days.length) {
      return false
    }
    return true
  }
}
