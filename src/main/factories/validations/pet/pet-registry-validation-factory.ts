import { type Validation } from '@/application/protocols'
import { NameValidation, PetGenderValidation, RequiredFieldValidation, ValidationComposite } from '@/application/validation'
import { NameValidatorAdapter } from '@/infra/validators'

export const makePetRegistryValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['specieName', 'petName', 'gender']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new NameValidation('specieName', new NameValidatorAdapter()))
  validations.push(new NameValidation('petName', new NameValidatorAdapter()))
  validations.push(new PetGenderValidation('gender'))
  return new ValidationComposite(validations)
}
