import { type CastratedValidator } from '@/application/validation/protocols'

export class CastratedValidatorAdapter implements CastratedValidator {
  isValid (castrated: boolean): boolean {
    if (typeof castrated !== 'boolean') {
      return false
    }
    return true
  }
}
