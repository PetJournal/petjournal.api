import { InvalidParamError } from '@/application/errors'
import { PasswordValidation, type PasswordValidator } from '@/application/validation'

const makesut = (): PasswordValidation => {
  class PasswordValidatorStub implements PasswordValidator {
    isValid (password: string): boolean {
      return true
    }
  }
  const fakeFieldName: string = 'fieldName'
  const passwordValidatorStub = new PasswordValidatorStub()
  const sut = new PasswordValidation(fakeFieldName, passwordValidatorStub)
  return sut
}

describe('PasswordValidation', () => {
  it('should returns InvalidParamError if fieldName is not a string', () => {
    const sut = makesut()

    const result = sut.validate({ fieldName: 11 })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })
})
