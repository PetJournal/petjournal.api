import { type Validation } from '@/application/protocols'
import { NameValidation, RequiredFieldValidation, ValidationComposite } from '@/application/validation'
import { NameValidatorAdapter } from '@/infra/validators'

export const makeUpdateTagValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['name']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new NameValidation('name', new NameValidatorAdapter()))
  return new ValidationComposite(validations)
}
