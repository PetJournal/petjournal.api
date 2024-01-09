import { type Validation } from '@/application/protocols'
import { type NameValidator, type EmailValidator, type PasswordValidator, type PhoneValidator } from '@/application/validation'
import { type BreedValidator } from '@/application/validation/protocols/breed-validator'

interface Options {
  error?: Error
  input?: any
}

const makeFakeValidation = (): Validation & Options => {
  class ValidationStub implements Validation {
    error: Error | undefined = undefined
    input: any

    validate (input: any): Error | void {
      this.input = input
      return this.error
    }
  }
  return new ValidationStub()
}

const makeFakeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFakeNameValidator = (): NameValidator => {
  class NameValidatorStub implements NameValidator {
    isValid (name: string): boolean {
      return true
    }
  }
  return new NameValidatorStub()
}

const makeFakeBreedValidator = (): BreedValidator => {
  class BreedValidatorStub implements BreedValidator {
    isValid (breedName: string): boolean {
      return true
    }
  }
  return new BreedValidatorStub()
}

const makeFakePasswordValidator = (): PasswordValidator => {
  class PasswordValidatorStub implements PasswordValidator {
    isValid (password: string): boolean {
      return true
    }
  }
  return new PasswordValidatorStub()
}

const makeFakePhoneValidator = (): PhoneValidator => {
  class PhoneValidatorStub implements PhoneValidator {
    isValid (phone: string): boolean {
      return true
    }
  }
  return new PhoneValidatorStub()
}

export {
  makeFakeValidation,
  makeFakeEmailValidator,
  makeFakeNameValidator,
  makeFakePasswordValidator,
  makeFakePhoneValidator,
  makeFakeBreedValidator
}
