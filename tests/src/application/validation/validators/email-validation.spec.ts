import { InvalidParamError } from '@/application/errors'
import { EmailValidation, type EmailValidator } from '@/application/validation'

const makeSut = (): EmailValidation => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const fakeFieldName: string = 'fieldName'
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new EmailValidation(fakeFieldName, emailValidatorStub)
  return sut
}

describe('EmailValidation', () => {
  test('should returns InvalidParamError if fieldName is not a string', () => {
    const sut = makeSut()

    const result = sut.validate({ fieldName: 11 })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })
})
