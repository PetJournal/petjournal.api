import { type PhoneValidator } from '../protocols'

export class PhoneValidatorAdapter implements PhoneValidator {
  isValid (phone: string): boolean {
    return false
  }
}
