import { type TitleValidator } from '@/application/validation/protocols/title-validator'
import validator from 'validator'

export class TitleValidatorAdapter implements TitleValidator {
  isValid (title: string): boolean {
    const isValidTitle = (field: string): boolean => validator.matches(field, /^[a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ .,-]{3,}$/)

    if (isValidTitle(title)) {
      return true
    }

    return false
  }
}
