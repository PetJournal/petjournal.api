import {
  type NameValidator,
  type PhoneValidator,
  type EmailValidator,
  type PasswordValidator
} from '@/application/validation/protocols'

const makeNameValidator = (): NameValidator => {
  class NameValidatorStub implements NameValidator {
    isValid (name: string): boolean {
      return true
    }
  }
  return new NameValidatorStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makePhoneValidator = (): PhoneValidator => {
  class PhoneValidatorStub implements PhoneValidator {
    isValid (phone: string): boolean {
      return true
    }
  }
  return new PhoneValidatorStub()
}

const makePasswordValidator = (): PasswordValidator => {
  class PasswordValidatorStub implements PasswordValidator {
    isValid (password: string): boolean {
      return true
    }
  }
  return new PasswordValidatorStub()
}

export {
  makeNameValidator,
  makeEmailValidator,
  makePhoneValidator,
  makePasswordValidator
}
