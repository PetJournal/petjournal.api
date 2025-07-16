import { type Validation } from '@/application/protocols'
import { type UuidValidator } from '../protocols'
import { InvalidParamError } from '@/application/errors'

export class TagIdValidation implements Validation {
  private readonly fieldName: string
  private readonly validator: UuidValidator

  constructor (fieldName: string, validator: UuidValidator) {
    this.fieldName = fieldName
    this.validator = validator
  }

  validate (input: any): Error | void {
    const tagId = input[this.fieldName]
    if (tagId === undefined || tagId === null) return

    if (typeof tagId !== 'string' || !this.validator.isValid(tagId)) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
