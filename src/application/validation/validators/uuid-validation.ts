import { type Validation } from '@/application/protocols'
import { type UuidValidator } from '../protocols'
import { InvalidParamError } from '@/application/errors'

export class UuidValidation implements Validation {
  private readonly uuid: string
  private readonly validator: UuidValidator

  constructor (uuid: string, validator: UuidValidator) {
    this.uuid = uuid
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (typeof input[this.uuid] !== 'string' && input[this.uuid] !== null) {
      return new InvalidParamError(this.uuid)
    }
    const isValid = this.validator.isValid(input[this.uuid])
    if (!isValid) {
      return new InvalidParamError(this.uuid)
    }
  }
}
