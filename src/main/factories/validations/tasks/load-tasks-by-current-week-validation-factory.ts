import { ValidationComposite, TagIdValidation } from '@/application/validation'
import { UuidValidatorAdapter } from '@/infra/validators'
import { type Validation } from '@/application/protocols'

export const makeLoadTasksByCurrentWeekValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  validations.push(new TagIdValidation('tagId', new UuidValidatorAdapter()))

  return new ValidationComposite(validations)
}
