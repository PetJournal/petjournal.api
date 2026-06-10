import { type Validation } from '@/application/protocols'
import { RequiredFieldValidation, UuidValidation, ValidationComposite } from '@/application/validation'
import { UuidValidatorAdapter } from '@/infra/validators'

export const makeDeleteSchedulerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['schedulerId']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new UuidValidation('schedulerId', new UuidValidatorAdapter()))
  return new ValidationComposite(validations)
}
