import { ValidationComposite, RequiredFieldValidation } from '@/application/validation'
import { type Validation } from '@/application/protocols'

export const makeLoadNextTasksByPetIdValidation = (): Validation => {
  return new ValidationComposite([
    new RequiredFieldValidation('petId')
  ])
}
