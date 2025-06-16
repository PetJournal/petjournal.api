import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class CurrentDateValidation implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error | void {
    const value = input[this.fieldName]
    if (!value) {
      return new InvalidParamError(this.fieldName)
    }

    const inputDate = new Date(value)
    if (isNaN(inputDate.getTime())) {
      return new InvalidParamError(this.fieldName)
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    inputDate.setUTCHours(0, 0, 0, 0)

    const isSameDate = inputDate.getTime() === today.getTime()
    if (!isSameDate) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
