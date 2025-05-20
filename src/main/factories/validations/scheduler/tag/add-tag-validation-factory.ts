import { type Validation } from '@/application/protocols'
import { ColorValidation, NameValidation, RequiredFieldValidation, ValidationComposite } from '@/application/validation'
import { ColorValidatorAdapter, NameValidatorAdapter } from '@/infra/validators'

export const makeAddTagValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'color']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new NameValidation('name', new NameValidatorAdapter()))
  validations.push(new ColorValidation('color', new ColorValidatorAdapter()))
  return new ValidationComposite(validations)
}
