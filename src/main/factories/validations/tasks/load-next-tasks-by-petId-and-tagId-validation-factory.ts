import { type Validation } from '@/application/protocols'
import { RequiredFieldValidation, UuidValidation, ValidationComposite } from '@/application/validation'
import { UuidValidatorAdapter } from '@/infra/validators'

export const makeLoadNextTasksByPetIdAndTagIdValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['petId', 'tagId']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new UuidValidation('petId', new UuidValidatorAdapter()))
  validations.push(new UuidValidation('tagId', new UuidValidatorAdapter()))
  return new ValidationComposite(validations)
}
