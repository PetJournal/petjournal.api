import { type Validation } from '@/application/protocols'
import {
  ValidationComposite,
  RequiredFieldValidation,
  PasswordValidation,
  CompareFieldsValidation
} from '@/application/validation'
import { PasswordValidatorAdapter } from '@/infra/validators'
import { PasswordMismatchError, PasswordRequirementsError } from '@/application/errors'

export const makeChangePasswordValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['userId', 'password', 'passwordConfirmation']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  const passwordMismatch = (): Error => new PasswordMismatchError()
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation', passwordMismatch))

  const passwordRequirements = (): Error => new PasswordRequirementsError()
  validations.push(new PasswordValidation('password', new PasswordValidatorAdapter(), passwordRequirements))

  return new ValidationComposite(validations)
}
