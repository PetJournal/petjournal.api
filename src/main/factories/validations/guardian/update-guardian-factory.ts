import { type Validation } from '@/application/protocols'
import { NameValidation, OptionalFieldValidation, ValidationComposite } from '@/application/validation'
import { NameValidatorAdapter } from '@/infra/validators'

export const makeUpdateGuardianValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  validations.push(new OptionalFieldValidation('firstName', new NameValidation('firstName', new NameValidatorAdapter())))
  validations.push(new OptionalFieldValidation('lastName', new NameValidation('lastName', new NameValidatorAdapter())))
  validations.push(new OptionalFieldValidation('phone', new NameValidation('phone', new NameValidatorAdapter())))

  return new ValidationComposite(validations)
}
