import { type Validation } from '@/application/protocols'

export class OptionalFieldValidation implements Validation {
  private readonly fieldName: string
  private readonly validator: Validation

  constructor (fieldName: string, validator: Validation) {
    this.fieldName = fieldName
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (input[this.fieldName]) {
      return this.validator.validate(input)
    }
  }
}
