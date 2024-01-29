import { type Validation } from '@/application/protocols'
import { BreedValidation, NameValidation, PetGenderValidation, RequiredFieldValidation, SizeValidation, ValidationComposite } from '@/application/validation'
import { NameValidatorAdapter, BreedValidatorAdapter, SizeValidatorAdapter } from '@/infra/validators'

export const makePetRegistryValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['specieName', 'petName', 'gender', 'breedName', 'size']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new NameValidation('specieName', new NameValidatorAdapter()))
  validations.push(new NameValidation('petName', new NameValidatorAdapter()))
  validations.push(new PetGenderValidation('gender'))
  validations.push(new BreedValidation('breedName', new BreedValidatorAdapter()))
  validations.push(new SizeValidation('size', new SizeValidatorAdapter()))
  return new ValidationComposite(validations)
}
