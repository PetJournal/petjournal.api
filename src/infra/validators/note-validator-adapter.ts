import { type NoteValidator } from '@/application/validation'
import validator from 'validator'

export class NoteValidatorAdapter implements NoteValidator {
  isValid (note: string): boolean {
    const isValidNote = (field: string): boolean => validator.matches(field, /^[a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ .,-]{3,}$/)

    if (isValidNote(note)) {
      return true
    }

    return false
  }
}
