import { ValidationComposite, RequiredFieldValidation } from '@/application/validation'
import { type Validation } from '@/application/protocols'

export const makeLoadPreviousTasksByPetIdValidation = (): Validation => {
  return new ValidationComposite([
    new RequiredFieldValidation('petId')
  ])
}
