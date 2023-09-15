import { InvalidParamError } from '@/application/errors'
import { PasswordValidation, type PasswordValidator } from '@/application/validation'

const makePasswordValidatorStub = (): PasswordValidator => {
  class PasswordValidatorStub implements PasswordValidator {
    isValid (password: string): boolean {
      return true
    }
  }
  return new PasswordValidatorStub()
}

interface SutTypes {
  sut: PasswordValidation
  passwordValidatorStub: PasswordValidator
  fakeFieldName: string
}

const makesut = (): SutTypes => {
  const fakeFieldName: string = 'fieldName'
  const passwordValidatorStub = makePasswordValidatorStub()
  const sut = new PasswordValidation(fakeFieldName, passwordValidatorStub)
  return {
    sut,
    passwordValidatorStub,
    fakeFieldName
  }
}

describe('PasswordValidation', () => {
  const params = {
    valid: { fieldName: 'valid_password' },
    invalid: { fieldName: 'invalid_password' },
    notStringValue: { fieldName: 11 }
  }

  describe('PasswordValidator', () => {
    it('should returns InvalidParamError if fieldName is not a valid password', () => {
      const { sut, passwordValidatorStub } = makesut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)

      const result = sut.validate(params.invalid)

      expect(result).toStrictEqual(new InvalidParamError('fieldName'))
    })

    it('should call validator with a correct argument', () => {
      const { sut, passwordValidatorStub } = makesut()
      const spyIsValid = jest.spyOn(passwordValidatorStub, 'isValid')

      sut.validate(params.valid)

      expect(spyIsValid).toBeCalledWith('valid_password')
    })

    it('should throw if validator throws', () => {
      const { sut, passwordValidatorStub } = makesut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

      expect(() => { sut.validate(params.valid) }).toThrow()
    })
  })

  describe('CustomError', () => {
    it('should returns Error if customError is provided', () => {
      const { fakeFieldName, passwordValidatorStub } = makesut()
      const fakeCustomError = jest.fn(() => Error)
      const sut = new PasswordValidation(fakeFieldName, passwordValidatorStub, fakeCustomError())
      jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)

      const result = sut.validate(params.invalid)

      expect(result).toStrictEqual(new Error())
    })
  })

  it('should returns InvalidParamError if fieldName is not a string', () => {
    const { sut } = makesut()

    const result = sut.validate(params.notStringValue)

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should returns void if fieldName is a valid password', () => {
    const { sut } = makesut()

    const result = sut.validate(params.valid)

    expect(result).toBeFalsy()
  })
})
