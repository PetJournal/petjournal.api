import { type Validation } from '@/application/protocols'
import { NameValidation, OptionalFieldValidation, PhoneValidation, ValidationComposite } from '@/application/validation'
import { NameValidatorAdapter, PhoneValidatorAdapter } from '@/infra/validators'

export const makeUpdateGuardianValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  validations.push(new OptionalFieldValidation('firstName', new NameValidation('firstName', new NameValidatorAdapter())))
  validations.push(new OptionalFieldValidation('lastName', new NameValidation('lastName', new NameValidatorAdapter())))
  validations.push(new OptionalFieldValidation('phone', new PhoneValidation('phone', new PhoneValidatorAdapter())))

  return new ValidationComposite(validations)
}
