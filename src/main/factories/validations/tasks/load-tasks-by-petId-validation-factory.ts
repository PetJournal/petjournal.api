import { ValidationComposite, RequiredFieldValidation } from '@/application/validation'
import { type Validation } from '@/application/protocols'

export const makeLoadTasksByPetIdValidation = (): Validation => {
  return new ValidationComposite([
    new RequiredFieldValidation('petId')
  ])
}
