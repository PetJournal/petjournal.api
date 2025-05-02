import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'
import { type NoteValidator } from '../protocols'

export class NoteValidation implements Validation {
  private readonly fieldNote: string
  private readonly validator: NoteValidator

  constructor (fieldNote: string, validator: NoteValidator) {
    this.fieldNote = fieldNote
    this.validator = validator
  }

  validate (input: any): Error | void {
    if (typeof input[this.fieldNote] !== 'string' && input[this.fieldNote] !== null) {
      return new InvalidParamError(this.fieldNote)
    }
    const isValid = this.validator.isValid(input[this.fieldNote])
    if (!isValid) {
      return new InvalidParamError(this.fieldNote)
    }
  }
}
