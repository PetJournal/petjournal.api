import { type Validation } from '@/application/protocols'
import { NameValidation, RequiredFieldValidation, ValidationComposite } from '@/application/validation'
import { NameValidatorAdapter, OptionalNameValidatorAdapter } from '@/infra/validators'

export const makePetRegistryValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['specieName']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new NameValidation('specieName', new NameValidatorAdapter()))
  validations.push(new NameValidation('specieAlias', new OptionalNameValidatorAdapter()))
  return new ValidationComposite(validations)
}
