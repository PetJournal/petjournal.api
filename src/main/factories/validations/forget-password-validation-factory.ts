import { type Validation } from '@/application/protocols'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '@/application/validation'
import { EmailValidatorAdapter } from '@/infra/validators'

export const makeForgetPasswordValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['email']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
