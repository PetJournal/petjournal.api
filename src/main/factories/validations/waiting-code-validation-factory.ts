import { type Validation } from '@/application/protocols'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '@/application/validation'
import { EmailValidatorAdapter } from '@/infra/validators'

export const makeWaitingCodeValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['email', 'forgetPasswordCode']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
