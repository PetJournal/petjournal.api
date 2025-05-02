import { type BooleanValidator } from '@/application/validation/protocols/boolean-validator'
import validator from 'validator'

export class BooleanValidatorAdapter implements BooleanValidator {
  isValid (param: any): boolean {
    return validator.isBoolean(param)
  }
}
