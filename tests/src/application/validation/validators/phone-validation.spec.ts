import { InvalidParamError } from '@/application/errors'
import { PhoneValidation, type PhoneValidator } from '@/application/validation'

const makesut = (): PhoneValidation => {
  class PhoneValidatorStub implements PhoneValidator {
    isValid (phone: string): boolean {
      return true
    }
  }
  const fakeFieldName: string = 'fieldName'
  const phoneValidatorStub = new PhoneValidatorStub()
  const sut = new PhoneValidation(fakeFieldName, phoneValidatorStub)
  return sut
}

describe('PhoneValidation', () => {
  test('should returns InvalidParamError if fieldName is not a string', () => {
    const sut = makesut()

    const result = sut.validate({ fieldName: 11 })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })
})
