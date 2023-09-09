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
  fakeCustomError: undefined
}

const makesut = (): SutTypes => {
  const fakeFieldName: string = 'fieldName'
  const fakeCustomError = undefined
  const passwordValidatorStub = makePasswordValidatorStub()
  const sut = new PasswordValidation(fakeFieldName, passwordValidatorStub, fakeCustomError)
  return {
    sut,
    passwordValidatorStub,
    fakeCustomError
  }
}

describe('PasswordValidation', () => {
  it('should returns InvalidParamError if fieldName is not a string', () => {
    const { sut } = makesut()

    const result = sut.validate({ fieldName: 11 })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should returns InvalidParamError if fieldName is not a valid password', () => {
    const { sut, passwordValidatorStub } = makesut()
    jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)

    const result = sut.validate({ fieldName: 'invalid_password' })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })
})
