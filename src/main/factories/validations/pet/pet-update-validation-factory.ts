import { type Validation } from '@/application/protocols'
import { BreedValidation, DateValidation, NameValidation, OptionalFieldValidation, PetGenderValidation, SizeValidation, ValidationComposite } from '@/application/validation'
import { CastratedValidation } from '@/application/validation/validators/castrated-validation'
import { BreedValidatorAdapter, CastratedValidatorAdapter, DateOfBirthValidatorAdapter, NameValidatorAdapter, PetGenderValidatorAdapter, SizeValidatorAdapter } from '@/infra/validators'

export const makePetUpdateValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  validations.push(new OptionalFieldValidation('specieName', new NameValidation('specieName', new NameValidatorAdapter())))
  validations.push(new OptionalFieldValidation('petName', new NameValidation('petName', new NameValidatorAdapter())))
  validations.push(new OptionalFieldValidation('gender', new PetGenderValidation('gender', new PetGenderValidatorAdapter())))
  validations.push(new OptionalFieldValidation('breedName', new BreedValidation('breedName', new BreedValidatorAdapter())))
  validations.push(new OptionalFieldValidation('size', new SizeValidation('size', new SizeValidatorAdapter())))
  validations.push(new OptionalFieldValidation('castrated', new CastratedValidation('castrated', new CastratedValidatorAdapter())))
  validations.push(new OptionalFieldValidation('dateOfBirth', new DateValidation('dateOfBirth', new DateOfBirthValidatorAdapter())))

  return new ValidationComposite(validations)
}
