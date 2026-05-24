import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'
import { type DescriptionValidator } from '../protocols'

export class DescriptionValidation implements Validation {
  private readonly fieldDescription: string
  private readonly validator: DescriptionValidator

  constructor (fieldDescription: string, validator: DescriptionValidator) {
    this.fieldDescription = fieldDescription
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (typeof input[this.fieldDescription] !== 'string' && input[this.fieldDescription] !== null) {
      return new InvalidParamError(this.fieldDescription)
    }
    const isValid = this.validator.isValid(input[this.fieldDescription])
    if (!isValid) {
      return new InvalidParamError(this.fieldDescription)
    }
  }
}
