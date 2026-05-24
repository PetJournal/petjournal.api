import { type Validation } from '@/application/protocols'
import { type NameValidator, type EmailValidator, type PasswordValidator, type PhoneValidator, type SizeValidator, type ColorValidator, type UuidValidator, type TitleValidator, type DateValidator, type NoteValidator, type DescriptionValidator, type DaysOfWeekValidator, type DaysOfMonthValidator, type BooleanValidator } from '@/application/validation'
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

const makeFakeSizeValidator = (): SizeValidator => {
  class SizeValidatorStub implements SizeValidator {
    isValid (size: string): boolean {
      return true
    }
  }
  return new SizeValidatorStub()
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

const makeFakeColorValidator = (): ColorValidator => {
  class ColorValidatorStub implements ColorValidator {
    isValid (color: string): boolean {
      return true
    }
  }
  return new ColorValidatorStub()
}

const makeFakeUuidValidator = (): UuidValidator => {
  class UuidValidatorStub implements UuidValidator {
    isValid (id: string): boolean {
      return true
    }
  }
  return new UuidValidatorStub()
}

const makeFakeTitleValidator = (): TitleValidator => {
  class TitleValidatorStub implements TitleValidator {
    isValid (title: string): boolean {
      return true
    }
  }
  return new TitleValidatorStub()
}

const makeFakeDateValidator = (): DateValidator => {
  class DateValidatorStub implements DateValidator {
    isValid (date: string): boolean {
      return true
    }
  }
  return new DateValidatorStub()
}

const makeFakeNoteValidator = (): NoteValidator => {
  class NoteValidatorStub implements NoteValidator {
    isValid (note: string): boolean {
      return true
    }
  }
  return new NoteValidatorStub()
}

const makeFakeDescriptionValidator = (): DescriptionValidator => {
  class DescriptionValidatorStub implements DescriptionValidator {
    isValid (description: string): boolean {
      return true
    }
  }
  return new DescriptionValidatorStub()
}

const makeFakeDaysOfWeekValidator = (): DaysOfWeekValidator => {
  class DaysOfWeekValidatorStub implements DaysOfWeekValidator {
    isValid (days: number[]): boolean {
      return true
    }
  }
  return new DaysOfWeekValidatorStub()
}

const makeFakeDaysOfMonthValidator = (): DaysOfMonthValidator => {
  class DaysOfMonthValidatorStub implements DaysOfMonthValidator {
    isValid (days: number[]): boolean {
      return true
    }
  }
  return new DaysOfMonthValidatorStub()
}

const makeFakeDailyValidator = (): BooleanValidator => {
  class DailyValidatorStub implements BooleanValidator {
    isValid (param: any): boolean {
      return true
    }
  }
  return new DailyValidatorStub()
}

export {
  makeFakeValidation,
  makeFakeEmailValidator,
  makeFakeNameValidator,
  makeFakePasswordValidator,
  makeFakePhoneValidator,
  makeFakeBreedValidator,
  makeFakeSizeValidator,
  makeFakeColorValidator,
  makeFakeUuidValidator,
  makeFakeTitleValidator,
  makeFakeDateValidator,
  makeFakeNoteValidator,
  makeFakeDescriptionValidator,
  makeFakeDaysOfWeekValidator,
  makeFakeDaysOfMonthValidator,
  makeFakeDailyValidator
}
