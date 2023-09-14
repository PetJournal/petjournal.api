import { InvalidParamError } from '@/application/errors'
import { EmailValidation, type EmailValidator } from '@/application/validation'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const fakeFieldName: string = 'fieldName'
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation(fakeFieldName, emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  const params = {
    valid: { fieldName: 'valid_email@mail.com' },
    invalid: { fieldName: 'invalid_email@mail.com' },
    notStringValue: { fieldName: 11 }
  }

  it('should returns InvalidParamError if fieldName is not a string', () => {
    const { sut } = makeSut()

    const result = sut.validate(params.notStringValue)

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should returns InvalidParamError if fieldName is not a valid email', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const result = sut.validate(params.invalid)

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should throw if validator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    expect(() => { sut.validate(params.valid) }).toThrow()
  })

  it('should call validator with correct argument', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate(params.valid)

    expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  it('should returns undefined if fieldName is a valid email', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')

    const result = sut.validate(params.valid)

    expect(result).toBe(undefined)
  })
})
