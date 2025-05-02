import { type UuidValidator } from '@/application/validation'
import validator from 'validator'

export class UuidValidatorAdapter implements UuidValidator {
  isValid (id: string): boolean {
    return validator.isUUID(id)
  }
}
