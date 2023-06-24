import { type Validation } from '@/application/protocols'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation,
  PasswordValidation
} from '@/application/validation'
import { EmailValidatorAdapter, PasswordValidatorAdapter } from '@/infra/validators'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['email', 'password']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  validations.push(new PasswordValidation('password', new PasswordValidatorAdapter()))

  return new ValidationComposite(validations)
}
