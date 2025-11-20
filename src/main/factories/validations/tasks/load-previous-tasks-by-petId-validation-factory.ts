import { ValidationComposite, RequiredFieldValidation, UuidValidation } from '@/application/validation'
import { UuidValidatorAdapter } from '@/infra/validators'
import { type Validation } from '@/application/protocols'

export const makeLoadPreviousTasksByPetIdValidation = (): Validation => {
  return new ValidationComposite([
    new RequiredFieldValidation('petId'),
    new UuidValidation('petId', new UuidValidatorAdapter())
  ])
}
