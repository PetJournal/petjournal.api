import { type ColorValidator } from '@/application/validation'
import validator from 'validator'

export class ColorValidatorAdapter implements ColorValidator {
  isValid (color: string): boolean {
    const result = validator.isHexColor(color)
    return result
  }
}
