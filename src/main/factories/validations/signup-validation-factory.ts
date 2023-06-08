import { type Validation } from '@/application/protocols'
import {
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  NameValidation,
  PhoneValidation,
  PasswordValidation
} from '@/application/validation'
import {
  EmailValidatorAdapter,
  NameValidatorAdapter,
  PasswordValidatorAdapter,
  PhoneValidatorAdapter
} from '@/infra/validators'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phone', 'passwordConfirmation', 'isPrivacyPolicyAccepted']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new NameValidation('firstName', new NameValidatorAdapter()))
  validations.push(new NameValidation('lastName', new NameValidatorAdapter()))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  validations.push(new PhoneValidation('phone', new PhoneValidatorAdapter()))
  validations.push(new PasswordValidation('password', new PasswordValidatorAdapter()))

  return new ValidationComposite(validations)
}
