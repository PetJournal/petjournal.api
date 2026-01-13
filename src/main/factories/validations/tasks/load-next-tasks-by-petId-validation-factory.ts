import { ValidationComposite, RequiredFieldValidation, UuidValidation } from '@/application/validation'
import { UuidValidatorAdapter } from '@/infra/validators'
import { type Validation } from '@/application/protocols'

export const makeLoadNextTasksByPetIdValidation = (): Validation => {
  return new ValidationComposite([
    new RequiredFieldValidation('petId'),
    new UuidValidation('petId', new UuidValidatorAdapter())
  ])
}
