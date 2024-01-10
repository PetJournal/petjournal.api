import { type Validation } from '@/application/protocols'
import { type SizeValidator } from '../protocols'

export class SizeValidation implements Validation {
  private readonly size: string
  private readonly validator: SizeValidator

  constructor (size: string, validator: SizeValidator) {
    this.size = size
    this.validator = validator
  }

  validate (input: any): void | Error {

  }
}
